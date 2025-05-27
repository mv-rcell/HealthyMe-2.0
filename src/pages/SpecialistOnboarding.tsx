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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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

const specialistTypes = [
  'Nutritionist',
  'Personal Trainer',
  'Physical Therapist',
  'Mental Health Therapist',
  'Yoga Instructor',
  'Massage Therapist',
  'Preventive Care Specialist',
  'Stress Management Coach',
  'Other'
];

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  specialistType: z.string().min(1, { message: "Please select a specialist type." }),
  experience: z.string().min(1, { message: "Please enter your years of experience." }),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters." }),
  phoneNumber: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address." }).optional(),
});

const SpecialistOnboarding = () => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Modified redirect logic to be less strict, allowing initial onboarding
  useEffect(() => {
    if (!loading && !user) {
      // Only redirect if not logged in at all
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: profile?.full_name || '',
      specialistType: profile?.specialist_type || '',
      experience: profile?.experience || '',
      bio: profile?.bio || '',
      phoneNumber: profile?.phone_number || '',
      email: user?.email || '',
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

      // Update profile and also ensure role is set to specialist
      const { error } = await supabase
        .from('profiles')
        .upsert({
          full_name: values.fullName,
          specialist_type: values.specialistType,
          experience: values.experience,
          bio: values.bio,
          phone_number: values.phoneNumber,
          profile_picture_url,
          role: 'specialist', // Ensure role is set correctly
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profile successfully updated!');
      navigate('/specialist-dashboard');
    } catch (error: any) {
      toast.error(`Error saving profile: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Complete Your Specialist Profile</CardTitle>
            <CardDescription>
              Fill out your professional profile to start offering services to clients.
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
                  <p className="text-sm text-muted-foreground mt-2">Recommended: Square image, at least 400x400px</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="Dr. Jane Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input  placeholder="Your email address" {...field} />
                        </FormControl>
                        <FormDescription>
                          You cannot change your email address
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="specialistType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialist Type*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select specialist type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {specialistTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Experience*</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 5 years" {...field} />
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
                      <FormLabel>Professional Bio*</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your professional background, qualifications, specialties, and approach..." 
                          className="min-h-32" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Next Steps:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Complete your profile to become visible to potential clients</li>
                    <li>Set your availability in the dashboard</li>
                    <li>Define your services and pricing</li>
                  </ul>
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

export default SpecialistOnboarding;