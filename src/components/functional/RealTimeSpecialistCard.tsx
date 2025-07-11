
import React from 'react';
import { Star, MapPin, Clock, Users, Video, MessageSquare, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RealSpecialist } from '@/hooks/useRealSpecialists.tsx';

interface RealTimeSpecialistCardProps {
  specialist: RealSpecialist;
  onStartChat: (specialist: RealSpecialist) => void;
  onStartMessage: (specialist: RealSpecialist) => void;
  onStartVideo: (specialist: RealSpecialist) => void;
  onStartZoom: (specialist: RealSpecialist) => void;
  onBookAppointment: (specialist: RealSpecialist) => void;
  loading?: {
    video?: boolean;
    zoom?: boolean;
  };
}

const RealTimeSpecialistCard: React.FC<RealTimeSpecialistCardProps> = ({
  specialist,
  onStartChat,
  onStartMessage,
  onStartVideo,
  onStartZoom,
  onBookAppointment,
  loading = {}
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className="relative">
            {specialist.profile_picture_url ? (
              <img
                src={specialist.profile_picture_url}
                alt={specialist.full_name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {specialist.full_name?.charAt(0) || 'S'}
              </div>
            )}
            {specialist.is_online && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm truncate">{specialist.full_name}</h3>
                <p className="text-primary text-xs font-medium">{specialist.specialist_type}</p>
              </div>
              <Badge variant={specialist.is_online ? "default" : "secondary"} className="text-xs">
                {specialist.is_online ? 'Online' : 'Offline'}
              </Badge>
            </div>
            
            {specialist.bio && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{specialist.bio}</p>
            )}
            
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              {specialist.experience && (
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {specialist.experience}
                </span>
              )}
              {specialist.consultation_fee && (
                <span>KES {specialist.consultation_fee}</span>
              )}
            </div>
            
            <Separator className="my-2" />
            
            <div className="flex gap-1 flex-wrap">
              <Button size="sm" onClick={() => onBookAppointment(specialist)} className="text-xs px-2 py-1">
                Book
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onStartChat(specialist)}
                className="text-xs px-2 py-1"
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Chat
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onStartMessage(specialist)}
                className="text-xs px-2 py-1"
              >
                Message
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onStartVideo(specialist)}
                disabled={loading.video}
                className="text-xs px-2 py-1"
              >
                <Video className="h-3 w-3 mr-1" />
                {loading.video ? '...' : 'Video'}
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onStartZoom(specialist)}
                disabled={loading.zoom}
                className="text-xs px-2 py-1"
              >
                <Phone className="h-3 w-3 mr-1" />
                {loading.zoom ? '...' : 'Zoom'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeSpecialistCard;
