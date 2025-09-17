import React, { useState, useEffect } from 'react';
import { MapPin, Video, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useVideoCall } from '@/hooks/useVideoCall.tsx';
import { useBookingRequests } from '@/hooks/useBookingRequests';
import { supabase } from '@/integrations/supabase/client';

interface Specialist {
  id: string;
  full_name: string;
  specialist_type: string;
  bio: string;
  experience: string;
}

const IntegratedHomeCareBooking = () => {
  const [selectedService, setSelectedService] = useState('');
  const [selectedSpecialist, setSelectedSpecialist] = useState('');
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const { user } = useAuth();
  const { startVideoCall, activeSession } = useVideoCall();
  const { createBookingRequest } = useBookingRequests();

  const services = [
    { id: 'physiotherapy', name: 'Home Physiotherapy' },
    { id: 'nursing', name: 'Home Nursing Care' },
    { id: 'massage', name: 'Therapeutic Massage' },
    { id: 'counseling', name: 'Mental Health Counseling' }
  ];

  useEffect(() => {
    fetchSpecialists();
  }, []);

  const fetchSpecialists = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'specialist')
        .not('specialist_type', 'is', null);

      if (error) throw error;
      setSpecialists(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to fetch specialists: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedService || !selectedSpecialist || !user) {
      toast({
        title: 'Missing Information',
        description: 'Please select a service and specialist.',
        variant: 'destructive',
      });
      return;
    }

    // Default preferred time = 1 hour from now
    const preferredDate = new Date();
    preferredDate.setHours(preferredDate.getHours() + 1);

    const bookingRequestData = {
      client_id: user.id,
      specialist_id: selectedSpecialist,
      service_type: selectedService,
      preferred_date: preferredDate.toISOString(),
      duration: 60,
      notes: 'Requested via HomeCare page',
      status: 'pending' as const,
    };

    try {
      const request = await createBookingRequest(bookingRequestData);
      if (request) {
        toast({
          title: 'Booking Request Sent!',
          description: 'Your request has been submitted. The specialist will confirm shortly.',
          variant: 'default',
        });
        setSelectedService('');
        setSelectedSpecialist('');
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: `Could not create booking request: ${err.message}`,
        variant: 'destructive',
      });
    }
  };

  const handleVideoCall = async () => {
    if (!selectedSpecialist || !user) return;
    await startVideoCall(0, selectedSpecialist);
  };

  const selectedSpecialistData = specialists.find((s) => s.id === selectedSpecialist);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-100 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-100 rounded-full opacity-15 blur-2xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-100 rounded-full opacity-10 blur-xl"></div>
      </div>

      {/* Header */}
      <div className="relative bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Home Care Services
                </h1>
                <p className="text-gray-600 text-sm">Professional care in the comfort of your home</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative flex items-center justify-center min-h-[calc(100vh-120px)] px-6 py-12">
        <div className="w-full max-w-md">
          <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="relative">
              {/* Decorative gradient bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-t-lg"></div>
              
              <CardTitle className="flex items-center gap-2 pt-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                Home Care Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Service Selection */}
              <div>
                <label className="text-sm font-medium">Select Service</label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Specialist Selection */}
              <div>
                <label className="text-sm font-medium">Available Specialists</label>
                <Select value={selectedSpecialist} onValueChange={setSelectedSpecialist}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose specialist" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialists.map((specialist) => (
                      <SelectItem key={specialist.id} value={specialist.id}>
                        {specialist.full_name} - {specialist.specialist_type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Specialist Info */}
              {selectedSpecialistData && (
                <div className="p-3 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <div className="font-medium">{selectedSpecialistData.full_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedSpecialistData.specialist_type}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {selectedSpecialistData.experience}
                  </div>
                  <div className="text-xs mt-2">{selectedSpecialistData.bio}</div>
                </div>
              )}

              {/* Video Call Indicator */}
              {activeSession && (
                <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-700">
                    <div className="relative">
                      <Video className="h-4 w-4" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    <span className="text-sm font-medium">Video call active</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={handleBooking}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                  disabled={loading || !user}
                >
                  Book Home Visit
                </Button>
                <Button
                  onClick={handleVideoCall}
                  variant="outline"
                  size="icon"
                  className="shadow-md hover:shadow-lg transition-shadow border-blue-200 hover:bg-blue-50"
                  disabled={!selectedSpecialist || !user}
                >
                  <Video className="h-4 w-4 text-blue-600" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="shadow-md border-gray-200" 
                  disabled
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IntegratedHomeCareBooking;