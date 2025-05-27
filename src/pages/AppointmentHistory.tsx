import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const AppointmentHistory = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    type: '',
    specialty: '',
    search: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchAppointments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching appointments:', error);
    } else {
      setAppointments(data);
      setFilteredAppointments(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user?.id) {
      fetchAppointments();
    }
  }, [user]);

  const applyFilters = () => {
    let filtered = appointments;
    if (filter.type) {
      filtered = filtered.filter(app => app.appointment_type === filter.type);
    }
    if (filter.specialty) {
      filtered = filtered.filter(app => app.specialty === filter.specialty);
    }
    if (filter.search) {
      filtered = filtered.filter(app =>
        app.consultation_reason?.toLowerCase().includes(filter.search.toLowerCase()) ||
        app.doctor?.toLowerCase().includes(filter.search.toLowerCase())
      );
    }
    setFilteredAppointments(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    applyFilters();
  }, [filter]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAppointments = filteredAppointments.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Appointment History</CardTitle>
        </CardHeader>
        <CardContent>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <Input
              placeholder="Search doctor or reason..."
              value={filter.search}
              onChange={e => setFilter({ ...filter, search: e.target.value })}
            />
            <Select onValueChange={val => setFilter({ ...filter, type: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in-person">In-Person</SelectItem>
                <SelectItem value="tele">Tele</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={val => setFilter({ ...filter, specialty: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cardiology">Cardiology</SelectItem>
                <SelectItem value="dermatology">Dermatology</SelectItem>
                <SelectItem value="neurology">Neurology</SelectItem>
                <SelectItem value="orthopedics">Orthopedics</SelectItem>
                <SelectItem value="pediatrics">Pediatrics</SelectItem>
                <SelectItem value="psychiatry">Psychiatry</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={applyFilters}>Apply Filters</Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : currentAppointments.length === 0 ? (
            <p className="text-center text-muted-foreground">No appointment history available.</p>
          ) : (
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        {new Date(appointment.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="capitalize">
                        {appointment.appointment_type === 'tele' ? 'Tele' : 'In-Person'}
                      </TableCell>
                      <TableCell className="capitalize">{appointment.specialty}</TableCell>
                      <TableCell>{appointment.doctor || 'N/A'}</TableCell>
                      <TableCell>{appointment.consultation_reason || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex justify-between items-center pt-6">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentHistory;
