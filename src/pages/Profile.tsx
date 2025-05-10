import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth'; // Make sure this exists and exports useAuth

const Profile = () => {
  const { user, loading, profile, isSpecialist, isClient, fetchProfile } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (profile) {
      setFullName(profile.full_name || '');
      setPhoneNumber(profile.phone_number || '');
      setBio(profile.bio || '');
    }
  }, [user, loading, navigate, profile]);

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

  async function updateProfile() {
    try {
      if (!user) return;
      
      setSaving(true);
      
      let profile_picture_url = profile?.profile_picture_url || null;

      // Upload image if selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('profile-pictures')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        // Get public URL for the uploaded image
        const { data: { publicUrl } } = supabase.storage
          .from('profile-pictures')
          .getPublicUrl(fileName);
        
        profile_picture_url = publicUrl;
      }
      
      const updates = {
        id: user.id,
        full_name: fullName,
        phone_number: phoneNumber,
        bio: bio,
        profile_picture_url,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updates, { onConflict: 'id' });

      if (error) {
        throw error;
      }

      toast.success('Profile updated successfully');
      await fetchProfile?.(user?.id as string); // Optional chaining if fetchProfile exists
    } catch (error: any) {
      toast.error(`Error updating profile: ${error.message}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex-grow flex items-center justify-center">
          <p>Loading profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-16 flex-grow">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Manage your personal information</CardDescription>
                </div>
                {profile?.role && (
                  <Badge variant={isSpecialist ? 'secondary' : 'outline'}>
                    {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center mb-6">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={imagePreview || profile?.profile_picture_url || ''} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                
                <Label htmlFor="picture" className="cursor-pointer bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors">
                  Change Photo
                </Label>
                <Input 
                  id="picture" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={user?.email} disabled />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Your phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself"
                  className="min-h-24"
                />
              </div>


              {isSpecialist && (
                <div className="border-t pt-4 mt-6">
                  <h3 className="text-lg font-medium mb-4">Specialist Information</h3>
                  <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Specialist Type</Label>
                        <p>{profile?.specialist_type || 'Not set'}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Experience</Label>
                        <p>{profile?.experience || 'Not set'}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      To update your specialist information, please visit the specialist dashboard.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/specialist-dashboard')}
                      className="w-full"
                    >
                      Go to Specialist Dashboard
                    </Button>
                  </div>
                </div>
              )}

              {isClient && (
                <div className="border-t pt-4 mt-6">
                  <h3 className="text-lg font-medium mb-4">Health Information</h3>
                  <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Membership Tier</Label>
                        <p>{profile?.membership_tier || 'Not selected'}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Payment Method</Label>
                        <p>{profile?.payment_method || 'Not selected'}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                    To update your health information and membership, please visit the client dashboard.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/client-dashboard')}
                      className="w-full"
                    >
                      Go to Client Dashboard
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate('/')}>
                Cancel
              </Button>
              <Button onClick={updateProfile} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
