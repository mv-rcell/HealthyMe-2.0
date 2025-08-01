import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import MessageThread from '@/components/messaging/MessageThread';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Messages = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipientProfile, setRecipientProfile] = useState<{ full_name: string } | null>(null);

  useEffect(() => {
    if (userId) {
      // Fetch recipient profile to show their name
      const fetchRecipientProfile = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', userId)
            .single();
          
          if (!error && data) {
            setRecipientProfile(data);
          }
        } catch (error) {
          console.error('Error fetching recipient profile:', error);
        }
      };
      
      fetchRecipientProfile();
    }
  }, [userId]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6">
          <p>Please log in to view messages.</p>
          <Button onClick={() => navigate('/auth')} className="mt-4">
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6">
          <p>Invalid message thread.</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto p-4">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">
            {recipientProfile?.full_name ? `Messages with ${recipientProfile.full_name}` : 'Messages'}
          </h1>
        </div>

        <MessageThread
          currentUserId={user.id}
          recipientId={userId}
          recipientName={recipientProfile?.full_name || 'User'}
        />
      </div>
    </div>
  );
};

export default Messages;