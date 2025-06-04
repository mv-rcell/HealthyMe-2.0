import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, MapPin, Clock, Video, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useReviews } from '@/hooks/useReviews';
import { useVideoCall } from '@/hooks/useVideoCall';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

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
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [loading, setLoading] = useState(false);
  const [specialistRatings, setSpecialistRatings] = useState<{[key: string]: number}>({});
  
  const { toast } = useToast();
  const { user } = useAuth();
  const { getSpecialistRating } = useReviews();
  const { startVideoCall } = useVideoCall();
  const navigate = useNavigate();

  const specialties = [
    { value: 'all', label: 'All Specialties' },
    { value: 'Nutritionist', label: 'Nutritionist' },
    { value: 'Personal Trainer', label: 'Personal Trainer' },
    { value: 'Physical Therapist', label: 'Physical Therapist' },
    { value: 'Mental Health Therapist', label: 'Mental Health Therapist' },
    { value: 'Yoga Instructor', label: 'Yoga Instructor' },
    { value: 'Massage Therapist', label: 'Massage Therapist' },
    { value: 'Preventive Care Specialist', label: 'Preventive Care Specialist' },
    { value: 'Stress Management Coach', label: 'Stress Management Coach' },
    { value: 'Other', label: 'Other' }
  ];

  useEffect(() => {
    fetchSpecialists();
  }, []);

  useEffect(() => {
    filterSpecialists();
  }, [specialists, searchTerm, selectedSpecialty]);

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
      
      const specialistsData = data || [];
      setSpecialists(specialistsData);
      
      // Fetch ratings for each specialist
      const ratings: {[key: string]: number} = {};
      for (const specialist of specialistsData) {
        const rating = await getSpecialistRating(specialist.id);
        ratings[specialist.id] = rating;
      }
      setSpecialistRatings(ratings);
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to fetch specialists: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterSpecialists = () => {
    let filtered = specialists;

    if (searchTerm) {
      filtered = filtered.filter(specialist =>
        specialist.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        specialist.specialist_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        specialist.bio?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter(specialist =>
        specialist.specialist_type === selectedSpecialty
      );
    }

    setFilteredSpecialists(filtered);
  };

  const handleVideoCall = async (specialistId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to start a video call.",
        variant: "destructive"
      });
      return;
    }
    
    await startVideoCall(0, specialistId);
  };

  const handleViewProfile = (specialistId: string) => {
    navigate(`/specialist/${specialistId}`);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Find Specialists
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by name, specialty, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {specialties.map((specialty) => (
                <SelectItem key={specialty.value} value={specialty.value}>
                  {specialty.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading specialists...</div>
        ) : (
          <div className="grid gap-4">
            {filteredSpecialists.map((specialist) => (
              <Card key={specialist.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={specialist.profile_picture_url} />
                      <AvatarFallback>
                        {specialist.full_name?.split(' ').map(n => n[0]).join('') || 'SP'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{specialist.full_name}</h3>
                          <p className="text-muted-foreground">{specialist.specialist_type}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm">
                              {specialistRatings[specialist.id] ? specialistRatings[specialist.id].toFixed(1) : 'New'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVideoCall(specialist.id)}
                            disabled={!user}
                          >
                            <Video className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleViewProfile(specialist.id)}
                          >
                            View Profile
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {specialist.bio}
                      </p>
                      
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>Available for home visits</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{specialist.experience}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredSpecialists.length === 0 && !loading && (
              <div className="text-center py-8 text-muted-foreground">
                No specialists found matching your criteria.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IntegratedSpecialistSearch;