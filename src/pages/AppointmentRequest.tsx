import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, User, Stethoscope, MapPin, Brain } from 'lucide-react';
import { format } from 'date-fns';
import { useAIRecommendations } from '@/hooks/useAIRecommendations';
import { useAppointments } from '@/hooks/useAppointments';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { specialistsData } from '@/data/specialist';

const BookConsultation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createAppointment } = useAppointments();
  const { recommendSpecialist, loading: aiLoading } = useAIRecommendations();
  
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    symptoms: '',
    duration: '',
    severity: '',
    consultationType: '',
    preferredTime: '',
    specialistId: '',
    urgency: 'routine',
    additionalNotes: ''
  });
  const [aiRecommendation, setAiRecommendation] = useState('');

  const consultationTypes = [
    { value: 'general', label: 'General Consultation' },
    { value: 'follow-up', label: 'Follow-up Visit' },
    { value: 'specialist', label: 'Specialist Consultation' },
    { value: 'emergency', label: 'Urgent Consultation' }
  ];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const handleSymptomAnalysis = async () => {
    if (!formData.symptoms) {
      toast.error('Please describe your symptoms first');
      return;
    }

    const recommendation = await recommendSpecialist(formData.symptoms);
    setAiRecommendation(recommendation);
    setStep(2);
  };

  const handleBookAppointment = async () => {
    if (!user) {
      toast.error('Please login to book an appointment');
      navigate('/auth');
      return;
    }

    if (!date || !formData.preferredTime || !formData.specialistId) {
      toast.error('Please fill in all required fields');
      return;
    }

    const selectedSpecialist = specialistsData.find(s => s.id === formData.specialistId);
    
    const appointmentData = {
      client_id: user.id,
      specialist_id: formData.specialistId,
      service_type: formData.consultationType,
      appointment_date: new Date(date.setHours(parseInt(formData.preferredTime.split(':')[0]), parseInt(formData.preferredTime.split(':')[1]))).toISOString(),
      duration: 60,
      status: formData.status as "pending" | "cancelled" | "completed" | "confirmed",
      notes: `Symptoms: ${formData.symptoms}. Duration: ${formData.duration}. Severity: ${formData.severity}. Additional notes: ${formData.additionalNotes}`,
      price: selectedSpecialist?.consultationFee || 0
    };

    const result = await createAppointment(appointmentData);
    
    if (result) {
      toast.success('Consultation booked successfully!');
      navigate('/client-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Book Consultation</h1>
          <p className="text-muted-foreground mb-8">
            Get personalized medical advice from our qualified specialists
          </p>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-primary text-white' : 'bg-muted'}`}>1</div>
              <div className="w-16 h-1 bg-muted"></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-primary text-white' : 'bg-muted'}`}>2</div>
              <div className="w-16 h-1 bg-muted"></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-primary text-white' : 'bg-muted'}`}>3</div>
            </div>
          </div>

          {/* Step 1: Symptom Description */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Describe Your Symptoms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">What symptoms are you experiencing? *</label>
                  <Textarea
                    placeholder="Please describe your symptoms in detail..."
                    value={formData.symptoms}
                    onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">How long have you had these symptoms?</label>
                    <Select value={formData.duration} onValueChange={(value) => setFormData({...formData, duration: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="less-than-day">Less than a day</SelectItem>
                        <SelectItem value="few-days">Few days</SelectItem>
                        <SelectItem value="week">About a week</SelectItem>
                        <SelectItem value="weeks">Several weeks</SelectItem>
                        <SelectItem value="month">About a month</SelectItem>
                        <SelectItem value="months">Several months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">How would you rate the severity?</label>
                    <Select value={formData.severity} onValueChange={(value) => setFormData({...formData, severity: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mild">Mild - Doesn't interfere with daily activities</SelectItem>
                        <SelectItem value="moderate">Moderate - Sometimes interferes with activities</SelectItem>
                        <SelectItem value="severe">Severe - Significantly impacts daily life</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Type of Consultation</label>
                  <Select value={formData.consultationType} onValueChange={(value) => setFormData({...formData, consultationType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select consultation type" />
                    </SelectTrigger>
                    <SelectContent>
                      {consultationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSymptomAnalysis} disabled={aiLoading} className="w-full">
                  <Brain className="h-4 w-4 mr-2" />
                  {aiLoading ? 'Analyzing...' : 'Get AI Specialist Recommendation'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: AI Recommendation & Specialist Selection */}
          {step === 2 && (
            <div className="space-y-6">
              {aiRecommendation && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      AI Specialist Recommendation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap">{aiRecommendation}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Select Specialist
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {specialistsData.slice(0, 6).map((specialist) => (
                      <div
                        key={specialist.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          formData.specialistId === specialist.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setFormData({...formData, specialistId: specialist.id})}
                      >
                        <div className="flex items-center gap-4">
                          <img 
                            src={specialist.imageUrl} 
                            alt={specialist.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{specialist.name}</h3>
                            <p className="text-sm text-primary">{specialist.specialty}</p>
                            <p className="text-sm text-muted-foreground">{specialist.experience} experience</p>
                            <p className="text-sm font-medium">KES {specialist.consultationFee}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4 mt-6">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button 
                      onClick={() => setStep(3)} 
                      disabled={!formData.specialistId}
                      className="flex-1"
                    >
                      Continue to Scheduling
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Date & Time Selection */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Schedule Your Appointment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Date</label>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border"
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Preferred Time</label>
                      <div className="grid grid-cols-2 gap-2">
                        {timeSlots.map((time) => (
                          <Button
                            key={time}
                            variant={formData.preferredTime === time ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFormData({...formData, preferredTime: time})}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Additional Notes (Optional)</label>
                      <Textarea
                        placeholder="Any additional information you'd like to share..."
                        value={formData.additionalNotes}
                        onChange={(e) => setFormData({...formData, additionalNotes: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button onClick={handleBookAppointment} className="flex-1">
                    Book Consultation
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookConsultation;