import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAppointments } from '@/hooks/useAppointments';
import { useBookingRequests } from '@/hooks/useBookingRequests';
import { useClientProgress } from '@/hooks/useClientProgress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Calendar, FileText, Phone, MessageSquare, Edit } from 'lucide-react';
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

type DialogState = { type: 'message' | 'progress' | null; client: ClientData | null };

const SpecialistClients = () => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const { appointments } = useAppointments();
  const { bookingRequests } = useBookingRequests(user?.id);
  const { progressRecords, createProgressRecord } = useClientProgress(user?.id);

  const [clients, setClients] = useState<ClientData[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [dialogState, setDialogState] = useState<DialogState>({ type: null, client: null });
  const [progressForm, setProgressForm] = useState({
    issue_description: '',
    recommendations: '',
    progress_notes: '',
    follow_up_date: '',
    status: 'ongoing'
  });

  // Redirect if not specialist
  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'specialist')) {
      navigate('/auth');
    }
  }, [user, profile, loading, navigate]);

  // Debounced fetch
  const fetchClientData = useCallback(async () => {
    if (!user || (!appointments && !bookingRequests)) return;
    setLoadingClients(true);

    try {
      const specialistAppointments = appointments?.filter(a => a.specialist_id === user.id) || [];
      const specialistRequests = bookingRequests?.filter(r => r.specialist_id === user.id) || [];

      const clientIds = [...new Set([
        ...specialistAppointments.map(a => a.client_id),
        ...specialistRequests.map(r => r.client_id)
      ])];

      if (clientIds.length === 0) {
        setClients([]);
        return;
      }

      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, full_name, profile_picture_url, phone_number')
        .in('id', clientIds);

      if (error) throw error;

      const clientData: ClientData[] = profiles.map(profile => {
        const clientAppointments = specialistAppointments.filter(a => a.client_id === profile.id);
        const clientRequests = specialistRequests.filter(r => r.client_id === profile.id);

        const completed = clientAppointments.filter(a => a.status === 'completed');
        const future = clientAppointments.filter(a => new Date(a.appointment_date) > new Date());

        const lastAppointment = completed.sort((a, b) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime())[0];
        const nextAppointment = future.sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime())[0];

        const totalSpent = completed.reduce((sum, a) => sum + (a.price || 0), 0);

        const latestProgress = progressRecords
          .filter(p => p.client_id === profile.id)
          .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];

        return {
          id: profile.id,
          full_name: profile.full_name || 'Unknown Client',
          profile_picture_url: profile.profile_picture_url,
          phone_number: profile.phone_number,
          appointmentCount: clientAppointments.length + clientRequests.length,
          lastAppointment: lastAppointment?.appointment_date,
          nextAppointment: nextAppointment?.appointment_date,
          totalSpent,
          currentIssues: latestProgress?.issue_description,
          recommendations: latestProgress?.recommendations,
          progressStatus: latestProgress?.status
        };
      });

      clientData.sort((a, b) => {
        const aDate = a.lastAppointment || a.nextAppointment;
        const bDate = b.lastAppointment || b.nextAppointment;
        if (!aDate) return 1;
        if (!bDate) return -1;
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      });

      setClients(clientData);
    } catch (err) {
      console.error('Error fetching clients:', err);
    } finally {
      setLoadingClients(false);
    }
  }, [user, appointments, bookingRequests, progressRecords]);

  useEffect(() => {
    const timeout = setTimeout(fetchClientData, 250); // debounce
    return () => clearTimeout(timeout);
  }, [fetchClientData]);

  const openDialog = (type: 'message' | 'progress', client: ClientData) => {
    setDialogState({ type, client });
    if (type === 'progress') {
      setProgressForm({
        issue_description: '',
        recommendations: '',
        progress_notes: '',
        follow_up_date: '',
        status: 'ongoing'
      });
    }
  };

  const handleCreateProgress = async () => {
    if (!dialogState.client) return;
    await createProgressRecord({
      client_id: dialogState.client.id,
      ...progressForm
    });
    setDialogState({ type: null, client: null });
  };

  const currencyFormat = (amount: number) =>
    amount.toLocaleString('en-KE', { style: 'currency', currency: 'KES' });

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="container flex-grow mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Clients</h1>
            <p className="text-muted-foreground">Track your client relationships and progress</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/specialist-dashboard')}>Back to Dashboard</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card><CardContent className="p-6 flex gap-4 items-center">
            <Users className="h-10 w-10 text-blue-600" />
            <div><p className="text-2xl font-bold">{clients.length}</p><p>Total Clients</p></div>
          </CardContent></Card>

          <Card><CardContent className="p-6 flex gap-4 items-center">
            <Calendar className="h-10 w-10 text-green-600" />
            <div><p className="text-2xl font-bold">{clients.reduce((s, c) => s + c.appointmentCount, 0)}</p><p>Total Interactions</p></div>
          </CardContent></Card>

          <Card><CardContent className="p-6 flex gap-4 items-center">
            <FileText className="h-10 w-10 text-purple-600" />
            <div><p className="text-2xl font-bold">{currencyFormat(clients.reduce((s, c) => s + c.totalSpent, 0))}</p><p>Total Revenue</p></div>
          </CardContent></Card>
        </div>

        {/* Client list */}
        <Card>
          <CardHeader><CardTitle><Users className="h-5 w-5 mr-2 inline" /> Client Directory</CardTitle></CardHeader>
          <CardContent>
            {loadingClients ? (
              <p className="text-center py-8">Loading clients...</p>
            ) : clients.length === 0 ? (
              <p className="text-center py-8">No clients yet</p>
            ) : (
              clients.map(client => (
                <Card key={client.id} className="mb-4">
                  <CardContent className="p-6">
                    <div className="flex justify-between">
                      <div className="flex gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={client.profile_picture_url} />
                          <AvatarFallback>{client.full_name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{client.full_name}</h4>
                          <p className="text-sm">{client.appointmentCount} interaction{client.appointmentCount !== 1 && 's'}</p>
                          {client.phone_number && <p className="text-sm flex items-center gap-1"><Phone className="h-3 w-3" />{client.phone_number}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openDialog('message', client)}>
                          <MessageSquare className="h-3 w-3 mr-1" /> Message
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openDialog('progress', client)}>
                          <Edit className="h-3 w-3 mr-1" /> Progress
                        </Button>
                      </div>
                    </div>

                    {(client.currentIssues || client.recommendations) && (
                      <div className="bg-muted/50 rounded-lg p-4 mt-4">
                        {client.currentIssues && <p><strong>Current Issues:</strong> {client.currentIssues}</p>}
                        {client.recommendations && <p><strong>Recommendations:</strong> {client.recommendations}</p>}
                        {client.progressStatus && <Badge className="mt-2">{client.progressStatus}</Badge>}
                      </div>
                    )}

                    <div className="mt-4 flex gap-2">
                      {client.lastAppointment && <Badge variant="secondary">Last: {new Date(client.lastAppointment).toLocaleDateString()}</Badge>}
                      {client.nextAppointment && <Badge>Next: {new Date(client.nextAppointment).toLocaleDateString()}</Badge>}
                      {client.totalSpent > 0 && <Badge variant="outline">Revenue: {currencyFormat(client.totalSpent)}</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Message Dialog */}
      <Dialog open={dialogState.type === 'message'} onOpenChange={() => setDialogState({ type: null, client: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chat with {dialogState.client?.full_name}</DialogTitle>
          </DialogHeader>
          {dialogState.client && user && (
            <MessageThread currentUserId={user.id} recipientId={dialogState.client.id} recipientName={dialogState.client.full_name} />
          )}
        </DialogContent>
      </Dialog>

      {/* Progress Dialog */}
      <Dialog open={dialogState.type === 'progress'} onOpenChange={() => setDialogState({ type: null, client: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Progress for {dialogState.client?.full_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Current Issues</Label>
            <Textarea value={progressForm.issue_description} onChange={e => setProgressForm(p => ({ ...p, issue_description: e.target.value }))} />

            <Label>Recommendations</Label>
            <Textarea value={progressForm.recommendations} onChange={e => setProgressForm(p => ({ ...p, recommendations: e.target.value }))} />

            <Label>Progress Notes</Label>
            <Textarea value={progressForm.progress_notes} onChange={e => setProgressForm(p => ({ ...p, progress_notes: e.target.value }))} />

            <Label>Follow-up Date</Label>
            <Input type="date" value={progressForm.follow_up_date} onChange={e => setProgressForm(p => ({ ...p, follow_up_date: e.target.value }))} />

            <Button onClick={handleCreateProgress} className="w-full">Save Progress Update</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default SpecialistClients;
