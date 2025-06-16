
import React from 'react';
import { useAppointments } from '@/hooks/useAppointments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { specialistsData } from '@/data/specialist';

const AppointmentHistory = () => {
  const { appointments, loading } = useAppointments();

  const getSpecialistInfo = (specialistId: string) => {
    return specialistsData.find(s => s.id === specialistId);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading appointments...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Appointment History</h2>
      
      {appointments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No appointments found. Book your first consultation!</p>
            <Button className="mt-4" onClick={() => window.location.href = '/book-consultation'}>
              Book Consultation
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appointment) => {
            const specialist = getSpecialistInfo(appointment.specialist_id);
            return (
              <Card key={appointment.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {specialist && (
                        <img
                          src={specialist.imageUrl}
                          alt={specialist.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {specialist?.name || 'Specialist'}
                        </h3>
                        <p className="text-primary font-medium">
                          {specialist?.specialty || appointment.service_type}
                        </p>
                        
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(appointment.appointment_date), 'MMM dd, yyyy')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {format(new Date(appointment.appointment_date), 'HH:mm')}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {appointment.duration} minutes
                          </div>
                        </div>
                        
                        {appointment.notes && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {appointment.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </Badge>
                      {appointment.price && (
                        <p className="text-lg font-semibold">KES {appointment.price}</p>
                      )}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {appointment.status === 'pending' && (
                          <Button variant="outline" size="sm">
                            Reschedule
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AppointmentHistory;