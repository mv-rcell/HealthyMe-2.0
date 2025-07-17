import React, { useState, useEffect } from 'react';
import { MapPin, Clock, User, Star, Video, Phone, Shield, Award, CheckCircle, Calendar, DollarSign, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useAppointments } from '@/hooks/useAppointments.tsx';
import { useVideoCall } from '@/hooks/useVideoCall.tsx';
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
  const { createAppointment } = useAppointments();
  const { startVideoCall, activeSession } = useVideoCall();

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
        title: "Error",
        description: `Failed to fetch specialists: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedService || !selectedSpecialist || !user) {
      toast({
        title: "Missing Information",
        description: "Please select a service and specialist.",
        variant: "destructive"
      });
      return;
    }

    const appointmentDate = new Date();
    appointmentDate.setHours(appointmentDate.getHours() + 1);

    const appointmentData = {
      client_id: user.id,
      specialist_id: selectedSpecialist,
      service_type: selectedService,
      appointment_date: appointmentDate.toISOString(),
      duration: 60,
      status: 'pending' as const,
      price: 50.00
    };

    const appointment = await createAppointment(appointmentData);
    if (appointment) {
      toast({
        title: "Home Visit Booked!",
        description: "Your specialist will be with you soon.",
        variant: "default"
      });
    }
  };

  const handleVideoCall = async () => {
    if (!selectedSpecialist || !user) return;
    
    await startVideoCall(0, selectedSpecialist);
  };

  const selectedSpecialistData = specialists.find(s => s.id === selectedSpecialist);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Home Care Services
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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

        {selectedSpecialistData && (
          <div className="p-3 border rounded-lg">
            <div className="font-medium">{selectedSpecialistData.full_name}</div>
            <div className="text-sm text-muted-foreground">{selectedSpecialistData.specialist_type}</div>
            <div className="text-xs text-muted-foreground mt-1">{selectedSpecialistData.experience}</div>
            <div className="text-xs mt-2">{selectedSpecialistData.bio}</div>
          </div>
        )}

        {activeSession && (
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 text-green-700">
              <Video className="h-4 w-4" />
              <span className="text-sm font-medium">Video call active</span>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={handleBooking} className="flex-1" disabled={loading || !user}>
            Book Home Visit
          </Button>
          <Button 
            onClick={handleVideoCall} 
            variant="outline" 
            size="icon"
            disabled={!selectedSpecialist || !user}
          >
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" disabled>
            <Phone className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Page Component
const HomeCareBookingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
               
              </div>
            </div>
            <nav className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Services</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Specialists</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">About</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Quality Healthcare
              <span className="text-blue-600"> at Your Doorstep</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional home care services with certified specialists. Book in-person visits or connect via video call for convenient, quality healthcare.
            </p>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Certified Specialists</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">10k+</div>
              <div className="text-gray-600">Happy Patients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Booking Component */}
          <div className="lg:col-span-1">
            <IntegratedHomeCareBooking />
          </div>

          {/* Features and Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Why Choose Our Home Care Services?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Licensed Professionals</h4>
                      <p className="text-sm text-gray-600">All our specialists are certified and experienced</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Flexible Scheduling</h4>
                      <p className="text-sm text-gray-600">Book appointments that fit your schedule</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Safe & Secure</h4>
                      <p className="text-sm text-gray-600">All visits follow strict safety protocols</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Video Consultations</h4>
                      <p className="text-sm text-gray-600">Connect instantly via secure video calls</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Types */}
            <Card>
              <CardHeader>
                <CardTitle>Our Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Home Physiotherapy</h4>
                    <p className="text-sm text-gray-600">Rehabilitation and mobility support in your home</p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Starting at $50/session
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Home Nursing Care</h4>
                    <p className="text-sm text-gray-600">Professional nursing care and medication management</p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Starting at $60/session
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Therapeutic Massage</h4>
                    <p className="text-sm text-gray-600">Relaxation and pain relief through massage therapy</p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Starting at $45/session
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Mental Health Counseling</h4>
                    <p className="text-sm text-gray-600">Support for mental wellness and emotional health</p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Starting at $70/session
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Choose Your Service</h4>
                      <p className="text-sm text-gray-600">Select the type of care you need from our range of services</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Select a Specialist</h4>
                      <p className="text-sm text-gray-600">Choose from our network of qualified healthcare professionals</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Book Your Appointment</h4>
                      <p className="text-sm text-gray-600">Schedule a home visit or start a video consultation immediately</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                
              </div>
              <p className="text-gray-400">Bringing quality healthcare to your doorstep with professional, caring service.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Physiotherapy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Nursing Care</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Massage Therapy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Mental Health</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Emergency</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Insurance</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2 text-gray-400">
                <p>📞 24/7 Helpline: (555) 123-4567</p>
                <p>📧 support@healthyme.com</p>
                <p>📍 123 HealthyMe Ave, City, State 12345</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 HealthyMe. All rights reserved. Licensed Healthcare Provider.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeCareBookingPage;