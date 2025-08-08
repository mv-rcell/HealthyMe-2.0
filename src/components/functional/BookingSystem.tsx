
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const BookingSystem = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedSpecialist, setSelectedSpecialist] = useState('');
  const [location, setLocation] = useState('');
  const { toast } = useToast();

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !selectedSpecialist) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to book your appointment.",
        status: "error"
      });
      return;
    }

    toast({
      title: "Booking Confirmed!",
      description: `Your appointment with ${selectedSpecialist} is booked for ${selectedDate} at ${selectedTime}.`,
      status: "success"
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Book Appointment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Select Date</label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">Select Time</label>
          <Select value={selectedTime} onValueChange={setSelectedTime}>
            <SelectTrigger>
              <SelectValue placeholder="Choose time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="09:00">9:00 AM</SelectItem>
              <SelectItem value="10:00">10:00 AM</SelectItem>
              <SelectItem value="11:00">11:00 AM</SelectItem>
              <SelectItem value="14:00">2:00 PM</SelectItem>
              <SelectItem value="15:00">3:00 PM</SelectItem>
              <SelectItem value="16:00">4:00 PM</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Specialist</label>
          <Select value={selectedSpecialist} onValueChange={setSelectedSpecialist}>
            <SelectTrigger>
              <SelectValue placeholder="Choose specialist" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dr. Sarah Johnson">Dr. Sarah Johnson - Physiotherapy</SelectItem>
              <SelectItem value="Dr. Mike Chen">Dr. Mike Chen - Nutrition</SelectItem>
              <SelectItem value="Dr. Emily Davis">Dr. Emily Davis - Mental Health</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Location (Optional)</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter location or select virtual"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Button onClick={handleBooking} className="w-full">
          Book Appointment
        </Button>
      </CardContent>
    </Card>
  );
};

export default BookingSystem;