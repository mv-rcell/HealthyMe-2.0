
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
  'General Surgery',
  'Personal Trainer',
  'Physical Therapist',
  'Mental Health Therapist',
  'General Medicine',
  'Massage Therapist',
  'Preventive Care Specialist',
  'Stress Management Coach',
  "Neurology",
  "Psychiatry",
  "ENT Surgery",
  "Dermatology",
  "Ophthalmology",
  "Neonatology",
  "Paediatrics",
  "Gastroenterology",
  "Pain Management",
  "Urology",
  "Paediatric Cardiology",
  "Adult Cardiology", 
  "Paediatric Surgery",
  "Maxillo-Facial Surgery",
  "Neuro-Surgery",
  "Rheumatology",
  "Paediatric Nephrology",
  "Paed Endocrinologist",
  "Asthma",
  "MTCC",
  "Cardiothoracic Surgery",
  "Breast Surgery",
  'Other',
];

const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  specialistType: z.string().min(1, { message: 'Please select a specialist type.' }),
  experience: z.string().min(1, { message: 'Please enter your years of experience.' }),
  bio: z.string().min(10, { message: 'Bio must be at least 10 characters.' }),
  phoneNumber: z.string().optional(),
  email: z.string().email({ message: 'Please enter a valid email address.' }).optional(),
  location: z.string().min(1, { message: 'Please enter your location/clinic.' }),
  consultationFee: z.string().min(1, { message: 'Please enter your consultation fee.' }),
  subsequentVisitsFee: z.string().optional(),
  languages: z.string().min(1, { message: 'Please enter languages you speak.' }),
  availability: z.string().min(1, { message: 'Please enter your availability.' }),
});

// Function to add specialist to specialists data
const addToSpecialistsData = async (specialistData: any) => {
  try {
    // Insert into a specialists table for easier management
    const { error } = await supabase
      .from('specialists_directory')
      .insert([{
        specialist_id: specialistData.id,
        name: specialistData.fullName,
        specialty: specialistData.specialistType,
        rating: 5.0, // Default rating for new specialists
        reviews: 0, // Start with 0 reviews
        location: specialistData.location,
        availability: specialistData.availability,
        image_url: specialistData.profile_picture_url || '/placeholder.svg',
        experience: specialistData.experience,
        languages: specialistData.languages.split(',').map((lang: string) => lang.trim()),
        consultation_fee: parseFloat(specialistData.consultationFee),
        subsequent_visits_fee: specialistData.subsequentVisitsFee ? parseFloat(specialistData.subsequentVisitsFee) : parseFloat(specialistData.consultationFee),
        description: specialistData.bio,
        is_online: false, // Default to offline
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]);

    if (error) throw error;
    
    console.log('Specialist added to directory successfully');
    return true;
  } catch (error) {
    console.error('Error adding specialist to directory:', error);
    return false;
  }
};

// Function to generate specialists.ts content (for development/admin use)
const generateSpecialistsFile = async () => {
  try {
    const { data: specialists, error } = await supabase
      .from('specialists_directory')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    const specialistsArray = specialists.map((specialist, index) => {
      return `  {
    id: "${specialist.specialist_id}",
    name: "${specialist.name}",
    specialty: "${specialist.specialty}",
    rating: ${specialist.rating},
    reviews: ${specialist.reviews},
    location: "${specialist.location}",
    availability: "${specialist.availability}",
    imageUrl: "${specialist.image_url}",
    experience: "${specialist.experience}",
    languages: ${JSON.stringify(specialist.languages)},
    consultationFee: ${specialist.consultation_fee},
    subsequentvisits: ${specialist.subsequent_visits_fee},
    title: "",
    description: "${specialist.description.replace(/"/g, '\\"')}",
    category: "",
    subcategory: "",
    isSpecialist: true,
    isOnline: ${specialist.is_online}
  }`;
    });

    const fileContent = `export interface Specialist {
  isOnline: any;
  id: string;
  name: string;
  title: string;
  specialty: string;
  rating: number;
  reviews: number;
  location: string;
  availability: string;
  imageUrl: string;
  experience: string;
  languages: string[];
  consultationFee: number;
  subsequentvisits: number;
  description: string;
  category: string;
  subcategory: string;
  isSpecialist: boolean;
}

export const specialistsData: Specialist[] = [
${specialistsArray.join(',\n')}
];`;

    // In a real application, you would save this to a file or return it for admin download
    console.log('Generated specialists file content:', fileContent);
    return fileContent;
  } catch (error) {
    console.error('Error generating specialists file:', error);
    return null;
  }
};

const SpecialistOnboarding = () => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
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
      location: profile?.location || 'MH-DOC Clinic',
      consultationFee: profile?.consultation_fee?.toString() || '',
      subsequentVisitsFee: profile?.subsequent_visits_fee?.toString() || '',
      languages: profile?.languages?.join(', ') || 'English',
      availability: profile?.availability || '',
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    setSaving(true);

    try {
      let profile_picture_url = profile?.profile_picture_url || null;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('profile-pictures')
          .upload(filePath, imageFile);

        if (uploadError) {
          toast.error(`Image upload failed: ${uploadError.message}`);
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('profile-pictures')
          .getPublicUrl(filePath);

        profile_picture_url = publicUrl;
      }

      // Update the main profiles table
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: values.fullName,
          specialist_type: values.specialistType,
          experience: values.experience,
          bio: values.bio,
          phone_number: values.phoneNumber,
          profile_picture_url,
          location: values.location,
          consultation_fee: parseFloat(values.consultationFee),
          subsequent_visits_fee: values.subsequentVisitsFee ? parseFloat(values.subsequentVisitsFee) : parseFloat(values.consultationFee),
          languages: values.languages.split(',').map(lang => lang.trim()),
          availability: values.availability,
          role: 'specialist',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Add to specialists directory for easy querying
      const specialistData = {
        id: user.id,
        fullName: values.fullName,
        specialistType: values.specialistType,
        experience: values.experience,
        bio: values.bio,
        phoneNumber: values.phoneNumber,
        profile_picture_url,
        location: values.location,
        consultationFee: values.consultationFee,
        subsequentVisitsFee: values.subsequentVisitsFee,
        languages: values.languages,
        availability: values.availability,
      };

      const addedToDirectory = await addToSpecialistsData(specialistData);
      
      if (addedToDirectory) {
        toast.success('Profile successfully updated and added to specialists directory!');
        
        // Optional: Generate updated specialists file for admin
        await generateSpecialistsFile();
      } else {
        toast.success('Profile updated successfully!');
        toast.warning('Note: There was an issue adding to the specialists directory. Please contact support.');
      }

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
              Fill out your professional profile to start offering services to clients. Your information will be added to our specialists directory.
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
                  <p className="text-sm text-muted-foreground mt-2">
                    Recommended: Square image, at least 400x400px
                  </p>
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
                          <Input placeholder="Your email address" {...field}  />
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
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
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

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location/Clinic*</FormLabel>
                        <FormControl>
                          <Input placeholder="MH-DOC Clinic" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="consultationFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Consultation Fee (USD)*</FormLabel>
                        <FormControl>
                          <Input placeholder="40" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subsequentVisitsFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subsequent Visits Fee (USD)</FormLabel>
                        <FormControl>
                          <Input placeholder="35" type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                          Leave blank to use same as consultation fee
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="languages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Languages Spoken*</FormLabel>
                        <FormControl>
                          <Input placeholder="English, Swahili" {...field} />
                        </FormControl>
                        <FormDescription>
                          Separate multiple languages with commas
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Availability*</FormLabel>
                        <FormControl>
                          <Input placeholder="Mon 9:00am" {...field} />
                        </FormControl>
                        <FormDescription>
                          e.g., "Mon 9:00am", "Tue 2:00pm", "Wed 10:30am"
                        </FormDescription>
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
                    <li>Your information will be automatically added to our specialists directory</li>
                    <li>Set your availability in the dashboard</li>
                    <li>Define additional services and pricing</li>
                  </ul>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => navigate('/')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
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
