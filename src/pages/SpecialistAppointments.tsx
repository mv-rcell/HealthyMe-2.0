import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAppointments } from '@/hooks/useAppointments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock, FileText } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';

interface ClientProfile {
  id: string;
  full_name: string;
  profile_picture_url?: string;
  phone_number?: string;
}

interface Appointment {
  id: number;
  client_id: string;
  specialist_id: string;
  service_type: string;
  appointment_date: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  }
};

const AppointmentCard = ({
  appointment,
  client,
  onStatusUpdate,
}: {
  appointment: Appointment;
  client?: ClientProfile;
  onStatusUpdate: (id: number, status: string) => void;
}) => {
  const date = new Date(appointment.appointment_date);
  return (
    <div className="border border-border rounded-lg p-4 bg-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={client?.profile_picture_url} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {client?.full_name?.charAt(0) || 'C'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium text-foreground">{client?.full_name || 'Client'}</h4>
            <p className="text-sm text-muted-foreground">{appointment.service_type}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              {date.toLocaleDateString()} at{' '}
              {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
          {appointment.status === 'pending' && (
            <>
              <Button size="sm" onClick={() => onStatusUpdate(appointment.id, 'confirmed')} className="bg-green-600 hover:bg-green-700">
                Confirm
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onStatusUpdate(appointment.id, 'cancelled')}>
                Cancel
              </Button>
            </>
          )}
          {appointment.status === 'confirmed' && (
            <Button size="sm" onClick={() => onStatusUpdate(appointment.id, 'completed')} className="bg-blue-600 hover:bg-blue-700">
              Mark Complete
            </Button>
          )}
        </div>
      </div>
      {appointment.notes && (
        <div className="mt-3 p-3 bg-muted rounded-md">
          <p className="text-sm text-muted-foreground">
            <FileText className="h-3 w-3 inline mr-1" />
            Notes: {appointment.notes}
          </p>
        </div>
      )}
    </div>
  );
};

const SpecialistAppointments = () => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const { appointments, updateAppointmentStatus } = useAppointments();
  const [clientProfiles, setClientProfiles] = useState<Record<string, ClientProfile>>({});

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'specialist')) {
      navigate('/auth');
    }
  }, [user, profile, loading, navigate]);

  const specialistAppointments = useMemo(
    () => appointments?.filter(apt => apt.specialist_id === user?.id) || [],
    [appointments, user?.id]
  );

  useEffect(() => {
    const clientIds = [...new Set(specialistAppointments.map(apt => apt.client_id))];
    const missingIds = clientIds.filter(id => !clientProfiles[id]);
    if (missingIds.length === 0) return;

    (async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, profile_picture_url, phone_number')
        .in('id', missingIds);

      if (error) {
        console.error('Error fetching client profiles:', error);
        return;
      }
      setClientProfiles(prev => ({ ...prev, ...Object.fromEntries(data.map(p => [p.id, p])) }));
    })();
  }, [specialistAppointments, clientProfiles]);

  const now = new Date();
  const upcomingAppointments = specialistAppointments.filter(apt =>
    new Date(apt.appointment_date) > now && apt.status !== 'cancelled'
  );
  const pastAppointments = specialistAppointments.filter(apt =>
    new Date(apt.appointment_date) <= now || apt.status === 'completed'
  );

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Appointments</h1>
            <p className="text-muted-foreground">Manage your client appointments</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/specialist-dashboard')}>
            Back to Dashboard
          </Button>
        </div>

        {/* Upcoming Appointments */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <CalendarIcon className="h-5 w-5" />
              Upcoming Appointments ({upcomingAppointments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map(apt => (
                  <AppointmentCard
                    key={apt.id}
                    appointment={apt}
                    client={clientProfiles[apt.client_id]}
                    onStatusUpdate={updateAppointmentStatus}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No upcoming appointments</p>
            )}
          </CardContent>
        </Card>

        {/* Past Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <FileText className="h-5 w-5" />
              Past Appointments ({pastAppointments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pastAppointments.length > 0 ? (
              <div className="space-y-4">
                {pastAppointments.slice(0, 10).map(apt => (
                  <AppointmentCard
                    key={apt.id}
                    appointment={apt}
                    client={clientProfiles[apt.client_id]}
                    onStatusUpdate={updateAppointmentStatus}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No past appointments</p>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default SpecialistAppointments;
