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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
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
  // Healthcare Professionals
  'Doctor/Physician',
  'Nurse',
  'Physical Therapist',
  'Occupational Therapist',
  'Speech Therapist',
  'Psychologist/Counselor',
  'Nutritionist/Dietitian',
  'Pharmacist',
  
  // Fitness & Wellness
  'Fitness Trainer', // Added as requested
  'Personal Trainer',
  'Yoga Instructor',
  'Sports Coach',
  'Wellness Coach',
  'Massage Therapist',
  
  // Educational Specialists
  'Tutor/Teacher',
  'Subject Matter Expert',
  'Language Instructor',
  
  // Technical Specialists
  'IT Consultant',
  'Engineer',
  'Software Developer',
  
  // Other Professional Services
  'Legal Advisor',
  'Financial Consultant',
  'Business Coach',
  'Preventive Care Specialist',
  'Stress Management Coach',
  'Other'
];

const fitnessTrainerCertifications = [
  'ACSM (American College of Sports Medicine)',
  'NASM (National Academy of Sports Medicine)',
  'ACE (American Council on Exercise)',
  'NSCA (National Strength and Conditioning Association)',
  'ISSA (International Sports Sciences Association)',
  'AAFA (Aerobics and Fitness Association of America)',
  'Other Accredited Certification'
];

const fitnessSpecialties = [
  'Personal Training',
  'Group Fitness',
  'Strength and Conditioning',
  'Cardio Fitness',
  'Rehabilitation Fitness',
  'Sports-Specific Training',
  'Senior Fitness',
  'Youth Fitness',
  'Weight Loss',
  'Bodybuilding',
  'Functional Training',
  'HIIT Training'
];

interface DocumentUpload {
  id: string;
  name: string;
  file: File | null;
  url: string | null;
  required: boolean;
  uploaded: boolean;
  verified: boolean;
  description: string;
}

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  specialistType: z.string().min(1, { message: "Please select a specialist type." }),
  experience: z.string().min(1, { message: "Please enter your years of experience." }),
  bio: z.string().min(50, { message: "Bio must be at least 50 characters." }),
  phoneNumber: z.string().min(10, { message: "Please enter a valid phone number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  
  // Fitness Trainer specific fields
  fitnessSpecialties: z.array(z.string()).optional(),
  primaryCertification: z.string().optional(),
  certificationExpiry: z.string().optional(),
  
  // Professional details
  licenseNumber: z.string().optional(),
  yearsExperience: z.number().min(0).max(50),
  education: z.string().min(10, { message: "Please describe your educational background." }),
  references: z.string().min(20, { message: "Please provide at least 2 professional references." })
});

const SpecialistOnboarding = () => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [documents, setDocuments] = useState<DocumentUpload[]>([]);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'in_review' | 'approved' | 'rejected'>('pending');

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
      fitnessSpecialties: [],
      yearsExperience: 0,
      education: '',
      references: ''
    },
  });

  // Initialize required documents based on specialist type
  useEffect(() => {
    if (selectedSpecialty) {
      const baseDocuments: DocumentUpload[] = [
        {
          id: 'cv',
          name: 'Curriculum Vitae (CV/Resume)',
          file: null,
          url: null,
          required: true,
          uploaded: false,
          verified: false,
          description: 'Comprehensive CV with work history, education, and achievements'
        },
        {
          id: 'degree',
          name: 'Educational Credentials',
          file: null,
          url: null,
          required: true,
          uploaded: false,
          verified: false,
          description: 'Degree certificates, diplomas, or relevant educational qualifications'
        },
        {
          id: 'id',
          name: 'Government ID',
          file: null,
          url: null,
          required: true,
          uploaded: false,
          verified: false,
          description: 'Government-issued photo identification'
        }
      ];

      // Add specialty-specific documents
      if (selectedSpecialty === 'Fitness Trainer' || selectedSpecialty === 'Personal Trainer') {
        baseDocuments.push(
          {
            id: 'fitness_cert',
            name: 'Fitness Certification',
            file: null,
            url: null,
            required: true,
            uploaded: false,
            verified: false,
            description: 'Current fitness certification from recognized body (ACSM, NASM, ACE, etc.)'
          },
          {
            id: 'cpr_cert',
            name: 'CPR/AED Certification',
            file: null,
            url: null,
            required: true,
            uploaded: false,
            verified: false,
            description: 'Current CPR and AED certification'
          },
          {
            id: 'first_aid',
            name: 'First Aid Certification',
            file: null,
            url: null,
            required: true,
            uploaded: false,
            verified: false,
            description: 'Current First Aid certification'
          },
          {
            id: 'insurance',
            name: 'Liability Insurance',
            file: null,
            url: null,
            required: true,
            uploaded: false,
            verified: false,
            description: 'Professional liability insurance certificate'
          }
        );
      } else if (selectedSpecialty.includes('Doctor') || selectedSpecialty.includes('Nurse') || selectedSpecialty.includes('Therapist')) {
        baseDocuments.push(
          {
            id: 'medical_license',
            name: 'Medical License',
            file: null,
            url: null,
            required: true,
            uploaded: false,
            verified: false,
            description: 'Active medical license in good standing'
          },
          {
            id: 'malpractice_insurance',
            name: 'Malpractice Insurance',
            file: null,
            url: null,
            required: true,
            uploaded: false,
            verified: false,
            description: 'Current malpractice insurance documentation'
          }
        );
      }

      setDocuments(baseDocuments);
    }
  }, [selectedSpecialty]);

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

  const handleDocumentUpload = async (documentId: string, file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${documentId}-${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('specialist-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('specialist-documents')
        .getPublicUrl(fileName);

      setDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { ...doc, file, url: publicUrl, uploaded: true }
          : doc
      ));

      toast.success(`${documents.find(d => d.id === documentId)?.name} uploaded successfully`);
    } catch (error: any) {
      toast.error(`Error uploading document: ${error.message}`);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    setSaving(true);
    try {
      let profile_picture_url = profile?.profile_picture_url || null;

      // Upload profile image if selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}-profile-${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profile-pictures')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('profile-pictures')
          .getPublicUrl(fileName);
        
        profile_picture_url = publicUrl;
      }

      const applicationPayload = {
        user_id: user.id,
        full_name: values.fullName,
        specialist_type: values.specialistType,
        experience_years: values.yearsExperience,
        education: values.education,
        bio: values.bio,
        phone_number: values.phoneNumber,
        license_number: values.licenseNumber,
        primary_certification: values.primaryCertification,
        certification_expiry: values.certificationExpiry,
        fitness_specialties: values.fitnessSpecialties,
        references: values.references,
        profile_picture_url,
        documents: documents.map(doc => ({
          id: doc.id,
          name: doc.name,
          url: doc.url,
          uploaded: doc.uploaded
        })),
        status: 'pending_review',
        submitted_at: new Date().toISOString()
      };
      
      const fileName = `${user.id}-application-${Date.now()}.json`;
      const fileBlob = new Blob([JSON.stringify(applicationPayload)], { type: 'application/json' });
      
      const { error: applicationUploadError } = await supabase.storage
        .from('specialist-applications')
        .upload(fileName, fileBlob);

      if (applicationUploadError) {
        console.error('Application Upload Error:', applicationUploadError);
        toast.error('Failed to upload application to storage.');
        throw applicationUploadError;
      }


      const { error: profileError } = await supabase
      .from('profiles')
      .update({
        full_name: values.fullName,
        specialist_type: values.specialistType,
        experience: values.yearsExperience,
        bio: values.bio,
        phone_number: values.phoneNumber,
        profile_picture_url,
        role: 'specialist_pending',
        is_active: false,
        is_online: false,
        verification_status: 'pending_review',
      })
      .eq('id', user.id);
    
    if (profileError) throw profileError;
    
    toast.success('Application submitted successfully! Your profile is now under review.');
    navigate('/specialist-pending');
      
      // Navigate to a pending approval page instead of dashboard
      navigate('/specialist-pending');
    } catch (error: any) {
      toast.error(`Error submitting application: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 0: // Basic info
        return form.getValues('fullName') && form.getValues('specialistType') && form.getValues('bio');
      case 1: // Documents
        return documents.filter(doc => doc.required).every(doc => doc.uploaded);
      case 2: // Professional details
        return form.getValues('education') && form.getValues('references');
      default:
        return false;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Specialist Application & Verification</CardTitle>
            <CardDescription>
              Complete your professional verification to start offering services. All documents will be reviewed for authenticity.
            </CardDescription>
            
            <div className="flex space-x-2 mt-4">
              {['Basic Info', 'Documents', 'Professional Details', 'Review'].map((step, index) => (
                <Badge 
                  key={step} 
                  variant={currentStep === index ? 'default' : isStepComplete(index) ? 'secondary' : 'outline'}
                  className="px-3 py-1"
                >
                  {isStepComplete(index) && <CheckCircle className="w-3 h-3 mr-1" />}
                  {step}
                </Badge>
              ))}
            </div>
          </CardHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent>
                <Tabs value={currentStep.toString()} className="w-full">
                  <TabsContent value="0" className="space-y-6">
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                    
                    {/* Profile Picture Upload */}
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
                            {form.getValues('fullName')?.charAt(0) || user?.email?.charAt(0) || '?'}
                          </div>
                        )}
                      </div>
                      
                      <Label htmlFor="picture" className="cursor-pointer bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors">
                        Upload Professional Photo
                      </Label>
                      <Input 
                        id="picture" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageChange}
                      />
                      <p className="text-sm text-muted-foreground mt-2">Required: Professional headshot, square format, minimum 400x400px</p>
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
                            <FormLabel>Email*</FormLabel>
                            <FormControl>
                              <Input placeholder="Your email address" {...field} disabled />
                            </FormControl>
                            <FormDescription>Cannot be changed after registration</FormDescription>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="specialistType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Specialist Type*</FormLabel>
                            <Select onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedSpecialty(value);
                            }} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your specialty" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="max-h-60">
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
                        name="yearsExperience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Years of Experience*</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="5" 
                                {...field} 
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
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
                            <FormLabel>Phone Number*</FormLabel>
                            <FormControl>
                              <Input placeholder="+254712345678" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {(selectedSpecialty === 'Fitness Trainer' || selectedSpecialty === 'Personal Trainer') && (
                        <FormField
                          control={form.control}
                          name="primaryCertification"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Primary Certification*</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select primary certification" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {fitnessTrainerCertifications.map((cert) => (
                                    <SelectItem key={cert} value={cert}>{cert}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Professional Bio*</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your professional background, qualifications, specialties, approach to client care, and what makes you unique as a practitioner..." 
                              className="min-h-32" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Minimum 50 characters. This will be visible to potential clients.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="1" className="space-y-6">
                    <h3 className="text-lg font-semibold">Required Documents</h3>
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        All documents will be verified for authenticity. Upload clear, high-quality images or PDFs.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="grid gap-4">
                      {documents.map((document) => (
                        <Card key={document.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4" />
                                <h4 className="font-medium">{document.name}</h4>
                                {document.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                                {document.uploaded && (
                                  <Badge variant="default" className="text-xs">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Uploaded
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">{document.description}</p>
                              
                              <Label htmlFor={`doc-${document.id}`} className="cursor-pointer">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-primary transition-colors">
                                  <div className="flex flex-col items-center">
                                    <Upload className="w-6 h-6 mb-2 text-gray-400" />
                                    <span className="text-sm font-medium">
                                      {document.uploaded ? 'Replace Document' : 'Upload Document'}
                                    </span>
                                    <span className="text-xs text-muted-foreground">PDF, JPG, PNG (Max 5MB)</span>
                                  </div>
                                </div>
                              </Label>
                              <Input
                                id={`doc-${document.id}`}
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleDocumentUpload(document.id, file);
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="2" className="space-y-6">
                    <h3 className="text-lg font-semibold">Professional Details</h3>
                    
                    <FormField
                      control={form.control}
                      name="education"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Educational Background*</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="List your degrees, certifications, institutions attended, graduation years, and any relevant coursework..." 
                              className="min-h-24" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {(selectedSpecialty === 'Fitness Trainer' || selectedSpecialty === 'Personal Trainer') && (
                      <div className="space-y-4">
                        <Label>Fitness Specialties</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {fitnessSpecialties.map((specialty) => (
                            <Label key={specialty} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={(e) => {
                                  const current = form.getValues('fitnessSpecialties') || [];
                                  if (e.target.checked) {
                                    form.setValue('fitnessSpecialties', [...current, specialty]);
                                  } else {
                                    form.setValue('fitnessSpecialties', current.filter(s => s !== specialty));
                                  }
                                }}
                              />
                              <span className="text-sm">{specialty}</span>
                            </Label>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <FormField
                      control={form.control}
                      name="references"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Professional References*</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Provide at least 2 professional references with names, titles, organizations, phone numbers, and email addresses..." 
                              className="min-h-24" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            References will be contacted during the verification process
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="licenseNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>License/Registration Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Professional license or registration number (if applicable)" {...field} />
                          </FormControl>
                          <FormDescription>
                            Required for licensed professions (medical, legal, etc.)
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="3" className="space-y-6">
                    <h3 className="text-lg font-semibold">Review & Submit</h3>
                    
                    <Alert>
                      <Clock className="h-4 w-4" />
                      <AlertDescription>
                        Review your application carefully. Once submitted, it will take 5-10 business days for verification and approval.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Application Summary</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Name:</span> {form.getValues('fullName')}
                          </div>
                          <div>
                            <span className="font-medium">Specialty:</span> {form.getValues('specialistType')}
                          </div>
                          <div>
                            <span className="font-medium">Experience:</span> {form.getValues('yearsExperience')} years
                          </div>
                          <div>
                            <span className="font-medium">Documents:</span> {documents.filter(d => d.uploaded).length}/{documents.filter(d => d.required).length} required uploaded
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-medium mb-2">Next Steps After Submission:</h4>
                        <ol className="list-decimal pl-5 space-y-1 text-sm">
                          <li>Document verification (3-5 business days)</li>
                          <li>Reference checks (2-3 business days)</li>
                          <li>Background screening (3-5 business days)</li>
                          <li>Skills assessment interview (scheduled separately)</li>
                          <li>Final approval and platform activation</li>
                        </ol>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : navigate('/')}
                >
                  {currentStep > 0 ? 'Previous' : 'Cancel'}
                </Button>
                
                <div className="flex gap-2">
                  {currentStep < 3 && (
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(currentStep + 1)}
                      disabled={!isStepComplete(currentStep)}
                    >
                      Next
                    </Button>
                  )}
                  
                  {currentStep === 3 && (
                    <Button 
                      type="submit" 
                      disabled={saving}
                    >
                      {saving ? 'Submitting Application...' : 'Submit Application'}
                    </Button>
                  )}
                  
                </div>
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