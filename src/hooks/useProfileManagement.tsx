
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import { useState } from 'react';
import { useEffect } from 'react';


export const useProfileManagement = () => {
  const { user, profile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Update local state when profile data changes
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhoneNumber(profile.phone_number || '');
      setBio(profile.bio || '');
      // Clear image preview when profile loads to show the existing profile picture
      setImagePreview(null);
    }
  }, [profile]);

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
        
        // Check if the bucket exists, create it if it doesn't
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
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updates, { onConflict: 'id' });

      if (error) {
        throw error;
      }

      // Clear the image file and preview after successful upload
      setImageFile(null);
      setImagePreview(null);

      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(`Error updating profile: ${error.message}`);
    } finally {
      setSaving(false);
    }
  }

  return {
    fullName,
    setFullName,
    phoneNumber,
    setPhoneNumber,
    bio,
    setBio,
    saving,
    imageFile,
    imagePreview,
    handleImageChange,
    updateProfile
  };
};
