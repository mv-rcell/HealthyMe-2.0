import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Phone, Video, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useAppointments } from '@/hooks/useAppointments';
import { useVideoCall } from '@/hooks/useVideoCall';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Specialist {
  id: string;
  full_name: string;
  specialist_type: string;
  bio: string;
  experience: string;
  profile_picture_url?: string;
}

const IntegratedSpecialistSearch = () => {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [filteredSpecialists, setFilteredSpecialists] = useState<Specialist[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const { createAppointment } = useAppointments();
  const { startVideoCall } = useVideoCall();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSpecialists();
  }, []);

  useEffect(() => {
    filterSpecialists();
  }, [specialists, searchTerm, specialtyFilter, locationFilter]);

  const fetchSpecialists = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'specialist')
        .not('specialist_type', 'is', null)
        .not('full_name', 'is', null);

      if (error) throw error;
      setSpecialists(data || []);
    } catch (error: any) {
      toast.error(`Failed to fetch specialists: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filterSpecialists = () => {
    let filtered = specialists;

    if (searchTerm) {
      filtered = filtered.filter(specialist => 
        specialist.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        specialist.specialist_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        specialist.bio?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (specialtyFilter && specialtyFilter !== 'all') {
      filtered = filtered.filter(specialist => 
        specialist.specialist_type === specialtyFilter
      );
    }

    setFilteredSpecialists(filtered);
  };

  const handleBookAppointment = async (specialistId: string) => {
    if (!user) {
      toast.error('Please log in to book an appointment');
      return;
    }

    try {
      const appointmentDate = new Date();
      appointmentDate.setDate(appointmentDate.getDate() + 1);
      appointmentDate.setHours(10, 0, 0, 0);

      await createAppointment({
        client_id: user.id,
        specialist_id: specialistId,
        service_type: 'consultation',
        appointment_date: appointmentDate.toISOString(),
        duration: 60,
        status: 'pending',
        notes: 'Booked through specialist search'
      });

      toast.success("Appointment Request Sent. The specialist will confirm your appointment soon.");

    } catch (error: any) {
      toast.error(`Failed to book appointment: ${error.message}`);
    }
  };

  const handleVideoCall = async (specialistId: string) => {
    if (!user) {
      toast.error("Login Required. Please log in to start a video call.");

      return;
    }
    
    await startVideoCall(0, specialistId);
  };

  const handleViewProfile = (specialistId: string) => {
    navigate(`/specialist-profile/${specialistId}`);
  };

  const specialties = [...new Set(specialists.map(s => s.specialist_type).filter(Boolean))];

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find Healthcare Specialists
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Input
                placeholder="Search by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Input
                placeholder="Location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading specialists...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpecialists.map((specialist) => (
                <Card key={specialist.id} className="hover-lift cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={specialist.profile_picture_url} />
                        <AvatarFallback className="text-lg">
                          {specialist.full_name?.split(' ').map(n => n[0]).join('') || 'SP'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{specialist.full_name}</h3>
                        <Badge variant="secondary" className="mb-2">
                          {specialist.specialist_type}
                        </Badge>
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          ))}
                          <span className="text-sm text-muted-foreground ml-1">(4.8)</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {specialist.bio || 'Experienced healthcare professional'}
                        </p>
                        <p className="text-xs text-muted-foreground mb-4">
                          {specialist.experience || '5+ years experience'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        onClick={() => handleBookAppointment(specialist.id)}
                        disabled={!user}
                        className="flex-1"
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        Book
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleVideoCall(specialist.id)}
                        disabled={!user}
                      >
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewProfile(specialist.id)}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && filteredSpecialists.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No specialists found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegratedSpecialistSearch;