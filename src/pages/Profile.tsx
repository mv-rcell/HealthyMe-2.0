import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (profile) {
      setFullName(profile.full_name || '');
      setPhoneNumber(profile.phone_number || '');
    }
  }, [user, loading, navigate, profile]);

  async function updateProfile() {
    try {
      setSaving(true);

      const updates = {
        id: user!.id,
        full_name: fullName,
        phone_number: phoneNumber,
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
            <CardContent className="space-y-4">
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

              {isSpecialist && (
                <div className="border-t pt-4 mt-6">
                  <h3 className="text-lg font-medium mb-4">Specialist Information</h3>
                  <div className="space-y-4">
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
                    <p className="text-sm text-muted-foreground">
                      To update your health information, please visit the client dashboard.
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
