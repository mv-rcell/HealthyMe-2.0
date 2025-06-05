
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, UserIcon, SettingsIcon, FileTextIcon, TestTubeIcon } from 'lucide-react';
import HealthRecordsTab from '@/components/functional/HealthRecordsTab';
import { useAppointments } from '@/hooks/useAppointments';
import { useLabTests } from '@/hooks/useLabTests';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const { appointments } = useAppointments();
  const { labTests } = useLabTests();
  
  // Redirect if not logged in or not a client
  React.useEffect(() => {
    if (!loading && (!user || profile?.role !== 'client')) {
      navigate('/auth');
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const upcomingAppointments = appointments?.filter(apt => 
    new Date(apt.appointment_date) > new Date() && apt.status !== 'cancelled'
  ).slice(0, 3) || [];

  const recentLabTests = labTests?.slice(0, 3) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-2">My Health Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome back, {profile?.full_name}!</p>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="health-records">Health Records</TabsTrigger>
            <TabsTrigger value="lab-tests">Lab Tests</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Next: {upcomingAppointments[0] ? 
                      new Date(upcomingAppointments[0].appointment_date).toLocaleDateString() : 
                      'None scheduled'
                    }
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Health Records</CardTitle>
                  <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{profile ? '5+' : '0'}</div>
                  <p className="text-xs text-muted-foreground">
                    Digital health history
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Lab Tests</CardTitle>
                  <TestTubeIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{recentLabTests.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Recent tests scheduled
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingAppointments.length > 0 ? (
                    <div className="space-y-3">
                      {upcomingAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex justify-between items-center p-3 border rounded">
                          <div>
                            <p className="font-medium">{appointment.service_type}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(appointment.appointment_date).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {appointment.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No upcoming appointments</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" onClick={() => navigate('/specialists')}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Book New Appointment
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/profile')}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    Update Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileTextIcon className="mr-2 h-4 w-4" />
                    View Health Records
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="mt-6 space-y-6">
          <Card>
              <CardHeader>
                <CardTitle>My Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {appointments?.length > 0 ? (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{appointment.service_type}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(appointment.appointment_date).toLocaleDateString()} at{' '}
                              {new Date(appointment.appointment_date).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                            {appointment.notes && (
                              <p className="text-sm mt-1">{appointment.notes}</p>
                            )}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No appointments found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health-records" className="mt-6 space-y-6">
            <HealthRecordsTab />
          </TabsContent>

          <TabsContent value="lab-tests" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Lab Tests</CardTitle>
              </CardHeader>
              <CardContent>
                {labTests?.length > 0 ? (
                  <div className="space-y-4">
                    {labTests.map((test) => (
                      <div key={test.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{test.test_name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Scheduled: {new Date(test.scheduled_date).toLocaleDateString()}
                            </p>
                            {test.price && (
                              <p className="text-sm mt-1">Price: ${test.price}</p>
                            )}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            test.status === 'completed' ? 'bg-green-100 text-green-800' :
                            test.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {test.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TestTubeIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No lab tests scheduled</p>
                    <Button className="mt-4" onClick={() => navigate('/')}>
                      Book Lab Test
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={() => navigate('/profile')}>
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button variant="outline" onClick={() => navigate('/payments')}>
                  Payment Methods
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default ClientDashboard;