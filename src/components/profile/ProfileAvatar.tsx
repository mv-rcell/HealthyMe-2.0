
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProfileAvatarProps {
  imagePreview: string | null;
  profilePicture?: string | null;
  fullName?: string | null;
  email?: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  imagePreview,
  profilePicture,
  fullName,
  email,
  handleImageChange
}) => {
  // Use imagePreview if available, otherwise use the existing profile picture
  const displayImage = imagePreview || profilePicture;

  return (
    <div className="flex flex-col items-center mb-6">
      <Avatar className="w-24 h-24 mb-4">
        <AvatarImage src={displayImage || ''} />
        <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
          {fullName?.charAt(0) || email?.charAt(0) || '?'}
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
  );
};

export default ProfileAvatar;