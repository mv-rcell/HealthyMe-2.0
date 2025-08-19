import React, { useEffect, useState } from 'react';
import { Search, Star, MapPin, Clock, Users, Brain, Stethoscope, Video, MessageSquare, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useRealSpecialists } from '@/hooks/useRealSpecialists';
import { useZoomIntegration } from '@/hooks/useZoomIntegration';
import { useVideoCall } from '@/hooks/useVideoCall';
import { toast } from 'sonner';
import VirtualChat from './VirtualChats';
import MessageThread from '../messaging/MessageThread';
import RealTimeSpecialistCard from './RealTimeSpecialistCard';
import { supabase } from '@/integrations/supabase/client';

const RealTimeSpecialistSearch = () => {
  const { user } = useAuth();
  const { specialists, loading } = useRealSpecialists();
  const { createZoomMeeting, loading: zoomLoading } = useZoomIntegration(user?.id || '');  const { startVideoCall, loading: videoLoading } = useVideoCall();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedSpecialist, setSelectedSpecialist] = useState<any>(null);
  const [communicationType, setCommunicationType] = useState<'chat' | 'message' | null>(null);

  const specialties = Array.from(new Set(specialists.map(s => s.specialist_type).filter(Boolean))).sort();

  const filteredSpecialists = specialists.filter(specialist => {
    const matchesSearch = !searchTerm || 
      specialist.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialist.specialist_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialist.bio?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = !selectedSpecialty || specialist.specialist_type === selectedSpecialty;
    
    return matchesSearch && matchesSpecialty;
  });

  console.log('All specialists:', specialists);
console.log('Search term:', searchTerm);
console.log('Selected specialty:', selectedSpecialty);


 const startZoomCall = async (specialist: any) => {
  if (!user) {
    toast.error('Please log in to start a call');
    return;
  }

  const meeting = await createZoomMeeting(
    `Consultation with ${specialist.full_name}`,
    user.email || 'client@example.com'
  );

  if (meeting && meeting.join_url) {
    toast.success(`Redirecting to Zoom meeting with ${specialist.full_name}...`);
    window.open(meeting.join_url, '_blank'); // Open Zoom in a new tab
  } else {
    toast.error('Failed to start Zoom meeting');
  }
};


  const startVideo = async (specialist: any) => {
    if (!user) {
      toast.error('Please log in to start a video call');
      return;
    }

    // Create a temporary appointment for the video call
    const appointmentId = Math.floor(Math.random() * 1000000);
    
    const session = await startVideoCall(appointmentId, specialist.id);
    if (session) {
      toast.success(`Video call started with ${specialist.full_name}!`);
    }
  };

  const openCommunication = (specialist: any, type: 'chat' | 'message') => {
    if (!user) {
      toast.error('Please log in to communicate');
      return;
    }
    
    setSelectedSpecialist(specialist);
    setCommunicationType(type);
  };

 
  

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search specialists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Button variant="outline" className="md:w-auto">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      {specialties.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
          {specialties.map((specialty) => (
            <Button
              key={specialty}
              variant={selectedSpecialty === specialty ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSpecialty(selectedSpecialty === specialty ? '' : specialty)}
              className="text-xs justify-start"
            >
              {specialty}
            </Button>
          ))}
        </div>
      )}

      <div className="text-sm text-muted-foreground mb-4">
        Showing {filteredSpecialists.length} of {specialists.length} specialists
      </div>

      <div className="grid gap-4">
        {filteredSpecialists.map((specialist) => (
          <RealTimeSpecialistCard
            key={specialist.id}
            specialist={{
              ...specialist,
              subsequent_visits_fee: specialist.subsequent_visits_fee || 0
            }}
            onStartMessage={() => openCommunication(specialist, 'message')}
            onStartVideo={() => startVideo(specialist)}
            onStartZoom={() => startZoomCall(specialist)}
            loading={{
              video: videoLoading,
              zoom: zoomLoading
            }}
          />
        ))}
      </div>
      
      {filteredSpecialists.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {specialists.length === 0 
            ? "No specialists have registered yet." 
            : "No specialists found matching your criteria. Try adjusting your search."
          }
        </div>
      )}

      {/* Communication Dialogs */}
      <Dialog open={!!selectedSpecialist && communicationType === 'chat'} onOpenChange={() => {
        setSelectedSpecialist(null);
        setCommunicationType(null);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Virtual Chat with {selectedSpecialist?.full_name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <VirtualChat />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedSpecialist && communicationType === 'message'} onOpenChange={() => {
        setSelectedSpecialist(null);
        setCommunicationType(null);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Message {selectedSpecialist?.full_name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {user && selectedSpecialist && (
              <MessageThread
                currentUserId={user.id}
                recipientId={selectedSpecialist.id}
                recipientName={selectedSpecialist.full_name}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export function useIncomingCalls() {
  useEffect(() => {
    const channel = supabase
      .channel("calls-listener")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "calls" },
        (payload) => {
          const call = payload.new;
          const userId = supabase.auth.getUser().then(({ data }) => {
            if (call.recipient_id === data.user?.id) {
              toast(`📞 Incoming call: ${call.topic}`, {
                action: {
                  label: "Join Zoom",
                  onClick: () => window.open(call.join_url, "_blank"),
                },
              });
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}


export default RealTimeSpecialistSearch;
