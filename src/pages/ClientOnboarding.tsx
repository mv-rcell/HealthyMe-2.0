import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Membership from '@/components/Membership';

type Membership = {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
};

const paymentMethods = [
  'M-Pesa',
  'Visa',
  'MasterCard',
  'PayPal',
  'Bank Transfer'
];

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phoneNumber: z.string().optional(),
  bio: z.string().optional(),
  membershipTier: z.string().min(1, { message: "Please select a membership tier." }),
  paymentMethod: z.string().min(1, { message: "Please select a payment method." }),
});

const ClientOnboarding = () => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const [saving, setSaving] = useState(false);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loadingMemberships, setLoadingMemberships] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Modified redirect logic to be less strict, allowing initial onboarding
  useEffect(() => {
    if (!loading && !user) {
      // Only redirect if not logged in at all
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Fetch memberships
  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const { data, error } = await supabase
          .from('memberships')
          .select('*');
        
        if (error) throw error;
        
        // Transform the data to match the Membership type
        const typedMemberships = data.map(item => ({
          ...item,
          features: Array.isArray(item.features) 
            ? item.features.map(f => String(f)) 
            : []
        }));
        
        setMemberships(typedMemberships);
      } catch (error) {
        console.error('Error fetching memberships:', error);
        toast.error('Failed to load membership options');
      } finally {
        setLoadingMemberships(false);
      }
    };

    fetchMemberships();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: profile?.full_name || '',
      phoneNumber: profile?.phone_number || '',
      bio: profile?.bio || '',
      membershipTier: profile?.membership_tier || '',
      paymentMethod: profile?.payment_method || '',
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    setSaving(true);

    try {
      let profile_picture_url = profile?.profile_picture_url || null;

      // Upload image if selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        // Check if profile-pictures bucket exists, if not create it
        try {
          const { data: buckets } = await supabase.storage.listBuckets();
          const bucketExists = buckets?.some(bucket => bucket.name === 'profile-pictures');
          
          if (!bucketExists) {
            await supabase.storage.createBucket('profile-pictures', {
              public: true,
              allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif'],
              fileSizeLimit: 5242880, // 5MB
            });
          }
        } catch (error) {
          console.error('Error checking/creating bucket:', error);
        }
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profile-pictures')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        // Get public URL for the uploaded image
        const { data: { publicUrl } } = supabase.storage
          .from('profile-pictures')
          .getPublicUrl(fileName);
        
        profile_picture_url = publicUrl;
      }

      // Update profile and also ensure role is set to client
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: values.fullName,
          phone_number: values.phoneNumber,
          bio: values.bio,
          membership_tier: values.membershipTier,
          payment_method: values.paymentMethod,
          profile_picture_url,
          role: 'client', // Ensure role is set correctly
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profile successfully updated!');
      navigate('/client-dashboard');
    } catch (error: any) {
      toast.error(`Error saving profile: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading || loadingMemberships) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  console.log("Loaded Memberships:", memberships);


  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Complete Your Client Profile</CardTitle>
            <CardDescription>
              Set up your profile and choose a membership plan to get started.
            </CardDescription>
          </CardHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 mb-4">
                    {imagePreview || profile?.profile_picture_url ? (
                      <img 
                        src={imagePreview || profile?.profile_picture_url || ''} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-primary/10 text-primary font-bold text-3xl">
                        {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>
                  
                  <Label htmlFor="picture" className="cursor-pointer bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors">
                    Upload Photo
                  </Label>
                  <Input 
                    id="picture" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageChange}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+254712345678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About you (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about yourself, your fitness goals, and health concerns..." 
                          className="min-h-24" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Choose your membership plan*</h3>
                  
                  <FormField
                    control={form.control}
                    name="membershipTier"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="space-y-3"
                          >
                            {memberships.map((membership) => (
                              <div
                                key={membership.id}
                                className={`flex items-center space-x-2 border rounded-lg p-4 ${
                                  field.value === membership.name ? 'border-primary bg-primary/5' : 'border-gray-200'
                                }`}
                              >
                                <RadioGroupItem value={membership.name} id={membership.id} />
                                <Label htmlFor={membership.id} className="flex flex-1 justify-between cursor-pointer">
                                  <div>
                                    <p className="font-medium">{membership.name}</p>
                                    <p className="text-sm text-muted-foreground">{membership.description}</p>
                                    <div className="mt-2 space-y-1">
                                      {membership.features.slice(0, 3).map((feature, idx) => (
                                        <div key={idx} className="flex items-center text-sm">
                                          <Check className="h-3 w-3 text-primary mr-2" />
                                          <span>{feature}</span>
                                        </div>
                                      ))}
                                      {membership.features.length > 3 && (
                                        <p className="text-xs text-muted-foreground">
                                          +{membership.features.length - 3} more features
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold">${membership.price.toFixed(2)}</p>
                                    <p className="text-xs text-muted-foreground">per month</p>
                                  </div>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Choose a payment method*</h3>
                  
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 md:grid-cols-3 gap-3"
                          >
                            {paymentMethods.map((method) => (
                              <div key={method} className="flex items-center space-x-2">
                                <RadioGroupItem value={method} id={`payment-${method}`} />
                                <Label htmlFor={`payment-${method}`}>{method}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormDescription>
                          You'll complete payment after saving your profile
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => navigate('/')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Profile & Continue'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default ClientOnboarding;