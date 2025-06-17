
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAppointments } from '@/hooks/useAppointments';
import { useClientProgress } from '@/hooks/useClientProgress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Calendar, FileText, Phone, MessageSquare, Video, Plus, Edit } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import MessageThread from '@/components/messaging/MessageThread';

interface ClientData {
  id: string;
  full_name: string;
  profile_picture_url?: string;
  phone_number?: string;
  appointmentCount: number;
  lastAppointment?: string;
  nextAppointment?: string;
  totalSpent: number;
  currentIssues?: string;
  recommendations?: string;
  progressStatus?: string;
}

const SpecialistClients = () => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const { appointments } = useAppointments();
  const { progressRecords, createProgressRecord, updateProgressRecord } = useClientProgress(user?.id);
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [progressForm, setProgressForm] = useState({
    issue_description: '',
    recommendations: '',
    progress_notes: '',
    follow_up_date: '',
    status: 'ongoing'
  });
  
  // Redirect if not logged in or not a specialist
  React.useEffect(() => {
    if (!loading && (!user || profile?.role !== 'specialist')) {
      navigate('/auth');
    }
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    if (appointments && user) {
      fetchClientData();
    }
  }, [appointments, user, progressRecords]);

  const fetchClientData = async () => {
    if (!appointments || !user) return;
    
    setLoadingClients(true);
    try {
      const specialistAppointments = appointments.filter(apt => apt.specialist_id === user.id);
      const clientIds = [...new Set(specialistAppointments.map(apt => apt.client_id))];
      
      if (clientIds.length === 0) {
        setClients([]);
        return;
      }

      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, full_name, profile_picture_url, phone_number')
        .in('id', clientIds);

      if (error) throw error;

      const clientData: ClientData[] = profiles?.map(profile => {
        const clientAppointments = specialistAppointments.filter(apt => apt.client_id === profile.id);
        const completedAppointments = clientAppointments.filter(apt => apt.status === 'completed');
        const futureAppointments = clientAppointments.filter(apt => 
          new Date(apt.appointment_date) > new Date() && apt.status !== 'cancelled'
        );
        
        const lastAppointment = completedAppointments
          .sort((a, b) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime())[0];
        
        const nextAppointment = futureAppointments
          .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime())[0];

        const totalSpent = completedAppointments.reduce((sum, apt) => sum + (apt.price || 0), 0);
        
        // Get latest progress record for this client
        const latestProgress = progressRecords
          .filter(record => record.client_id === profile.id)
          .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];

        return {
          id: profile.id,
          full_name: profile.full_name || 'Unknown Client',
          profile_picture_url: profile.profile_picture_url,
          phone_number: profile.phone_number,
          appointmentCount: clientAppointments.length,
          lastAppointment: lastAppointment?.appointment_date,
          nextAppointment: nextAppointment?.appointment_date,
          totalSpent,
          currentIssues: latestProgress?.issue_description,
          recommendations: latestProgress?.recommendations,
          progressStatus: latestProgress?.status
        };
      }) || [];

      clientData.sort((a, b) => {
        const aDate = new Date(a.lastAppointment || a.nextAppointment || 0);
        const bDate = new Date(b.lastAppointment || b.nextAppointment || 0);
        return bDate.getTime() - aDate.getTime();
      });

      setClients(clientData);
    } catch (error) {
      console.error('Error fetching client data:', error);
    } finally {
      setLoadingClients(false);
    }
  };

  const handleCreateProgress = async () => {
    if (!selectedClient) return;
    
    await createProgressRecord({
      client_id: selectedClient.id,
      ...progressForm
    });
    
    setShowProgressDialog(false);
    setProgressForm({
      issue_description: '',
      recommendations: '',
      progress_notes: '',
      follow_up_date: '',
      status: 'ongoing'
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Clients</h1>
            <p className="text-muted-foreground">Track your client relationships and progress</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/specialist-dashboard')}>
            Back to Dashboard
          </Button>
        </div>

        {/* Client Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Users className="h-10 w-10 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{clients.length}</p>
                  <p className="text-sm text-muted-foreground">Total Clients</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Calendar className="h-10 w-10 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {clients.reduce((sum, client) => sum + client.appointmentCount, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Appointments</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <FileText className="h-10 w-10 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    ${clients.reduce((sum, client) => sum + client.totalSpent, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clients List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Users className="h-5 w-5" />
              Client Directory
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingClients ? (
              <div className="text-center py-8 text-muted-foreground">Loading clients...</div>
            ) : clients.length > 0 ? (
              <div className="space-y-6">
                {clients.map((client) => (
                  <Card key={client.id} className="border border-border">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={client.profile_picture_url} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {client.full_name?.charAt(0) || 'C'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-foreground text-lg">{client.full_name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {client.appointmentCount} appointment{client.appointmentCount !== 1 ? 's' : ''}
                            </p>
                            {client.phone_number && (
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {client.phone_number}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedClient(client)}
                              >
                                <MessageSquare className="h-3 w-3 mr-1" />
                                Message
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                              <DialogHeader>
                                <DialogTitle>Chat with {selectedClient?.full_name}</DialogTitle>
                              </DialogHeader>
                              {selectedClient && user && (
                                <MessageThread
                                  currentUserId={user.id}
                                  partnerId={selectedClient.id}
                                  partnerName={selectedClient.full_name}
                                  partnerAvatar={selectedClient.profile_picture_url}
                                />
                              )}
                            </DialogContent>
                          </Dialog>

                          <Dialog open={showProgressDialog} onOpenChange={setShowProgressDialog}>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedClient(client)}
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Progress
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Update Progress for {selectedClient?.full_name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="issue">Current Issues</Label>
                                  <Textarea
                                    id="issue"
                                    value={progressForm.issue_description}
                                    onChange={(e) => setProgressForm(prev => ({ ...prev, issue_description: e.target.value }))}
                                    placeholder="Describe current health issues or concerns..."
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="recommendations">Recommendations</Label>
                                  <Textarea
                                    id="recommendations"
                                    value={progressForm.recommendations}
                                    onChange={(e) => setProgressForm(prev => ({ ...prev, recommendations: e.target.value }))}
                                    placeholder="Treatment recommendations..."
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="notes">Progress Notes</Label>
                                  <Textarea
                                    id="notes"
                                    value={progressForm.progress_notes}
                                    onChange={(e) => setProgressForm(prev => ({ ...prev, progress_notes: e.target.value }))}
                                    placeholder="Progress notes and observations..."
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="followup">Follow-up Date</Label>
                                  <Input
                                    id="followup"
                                    type="date"
                                    value={progressForm.follow_up_date}
                                    onChange={(e) => setProgressForm(prev => ({ ...prev, follow_up_date: e.target.value }))}
                                  />
                                </div>
                                <Button onClick={handleCreateProgress} className="w-full">
                                  Save Progress Update
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>

                      {/* Client Progress Information */}
                      {(client.currentIssues || client.recommendations) && (
                        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                          {client.currentIssues && (
                            <div>
                              <h5 className="font-medium text-sm text-foreground">Current Issues:</h5>
                              <p className="text-sm text-muted-foreground">{client.currentIssues}</p>
                            </div>
                          )}
                          {client.recommendations && (
                            <div>
                              <h5 className="font-medium text-sm text-foreground">Recommendations:</h5>
                              <p className="text-sm text-muted-foreground">{client.recommendations}</p>
                            </div>
                          )}
                          {client.progressStatus && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Status:</span>
                              <Badge variant={client.progressStatus === 'completed' ? 'default' : 'secondary'}>
                                {client.progressStatus}
                              </Badge>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="mt-4 flex gap-4 text-sm">
                        {client.lastAppointment && (
                          <Badge variant="secondary">
                            Last: {new Date(client.lastAppointment).toLocaleDateString()}
                          </Badge>
                        )}
                        {client.nextAppointment && (
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            Next: {new Date(client.nextAppointment).toLocaleDateString()}
                          </Badge>
                        )}
                        {client.totalSpent > 0 && (
                          <Badge variant="outline">
                            Revenue: ${client.totalSpent}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No clients yet</p>
                <p className="text-sm">Clients will appear here once they book appointments with you</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default SpecialistClients;