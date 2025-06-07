import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Specialist {
  id: string;
  full_name: string;
  specialist_type: string;
  bio: string;
  experience: string;
  profile_picture_url?: string;
}

const Specialist = () => {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

    fetchSpecialists();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Our Specialists</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading specialists...</div>
          ) : specialists.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No specialists found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {specialists.map((specialist) => (
                <Card key={specialist.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={specialist.profile_picture_url} />
                        <AvatarFallback>
                          {specialist.full_name
                            ?.split(' ')
                            .map((n) => n[0])
                            .join('') || 'SP'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{specialist.full_name}</h3>
                        <Badge variant="secondary" className="mt-1">
                          {specialist.specialist_type}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
                      {specialist.bio || 'Experienced healthcare professional.'}
                    </p>
                    <p className="text-xs text-gray-500">{specialist.experience || '5+ years experience'}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Specialist;
