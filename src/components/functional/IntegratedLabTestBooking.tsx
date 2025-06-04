import React, { useState } from 'react';
import { TestTube, Download, Calendar, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useLabTests } from '@/hooks/useLabTests.tsx';

const IntegratedLabTestBooking = () => {
  const [selectedTest, setSelectedTest] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  const { toast } = useToast();
  const { user } = useAuth();
  const { labTests, bookLabTest, downloadReport, scheduleFollowUp } = useLabTests();

  const availableTests = [
    { id: 'blood-count', name: 'Complete Blood Count (CBC)', price: 25, type: 'blood' },
    { id: 'lipid-panel', name: 'Lipid Panel', price: 35, type: 'blood' },
    { id: 'diabetes-screen', name: 'Diabetes Screening', price: 20, type: 'blood' },
    { id: 'thyroid-panel', name: 'Thyroid Function Panel', price: 45, type: 'blood' },
    { id: 'vitamin-d', name: 'Vitamin D Test', price: 30, type: 'blood' },
    { id: 'ecg', name: 'Electrocardiogram (ECG)', price: 40, type: 'cardiac' },
    { id: 'chest-xray', name: 'Chest X-Ray', price: 60, type: 'imaging' },
    { id: 'blood-pressure', name: 'Blood Pressure Monitoring', price: 15, type: 'vital' }
  ];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', 
    '14:00', '15:00', '16:00', '17:00'
  ];

  const handleBookTest = async () => {
    if (!selectedTest || !selectedDate || !selectedTime || !user) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const testData = availableTests.find(t => t.id === selectedTest);
    if (!testData) return;

    const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}:00`);

    const testBooking = {
      test_name: testData.name,
      test_type: testData.type,
      scheduled_date: scheduledDateTime.toISOString(),
      status: 'scheduled' as const,
      price: testData.price,
      follow_up_scheduled: false
    };

    const result = await bookLabTest(testBooking);
    if (result) {
      setSelectedTest('');
      setSelectedDate('');
      setSelectedTime('');
    }
  };

  const handleDownloadReport = async (test: any) => {
    if (test.report_url) {
      await downloadReport(test.report_url, test.test_name);
    } else {
      // Simulate report generation for demo
      const mockReportUrl = `data:text/plain;charset=utf-8,Lab Report for ${test.test_name}\n\nPatient: ${user?.email}\nDate: ${new Date(test.scheduled_date).toLocaleDateString()}\n\nResults: Normal values within acceptable range.\n\nThis is a demo report.`;
      const encodedUri = encodeURI(mockReportUrl);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${test.test_name}_report.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Demo Report Downloaded",
        description: "This is a demo report. In a real app, this would be the actual lab results.",
        variant: "default"
      });
    }
  };

  const handleScheduleFollowUp = async (testId: string) => {
    const followUpDate = new Date();
    followUpDate.setDate(followUpDate.getDate() + 14); // 2 weeks from now
    
    await scheduleFollowUp(testId, followUpDate.toISOString());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'scheduled': return 'text-blue-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const selectedTestData = availableTests.find(t => t.id === selectedTest);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Book Lab Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Select Test</label>
            <Select value={selectedTest} onValueChange={setSelectedTest}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a test" />
              </SelectTrigger>
              <SelectContent>
                {availableTests.map((test) => (
                  <SelectItem key={test.id} value={test.id}>
                    {test.name} - ${test.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTestData && (
            <div className="p-3 border rounded-lg bg-muted/50">
              <h4 className="font-medium">{selectedTestData.name}</h4>
              <p className="text-sm text-muted-foreground">
                Type: {selectedTestData.type} | Price: ${selectedTestData.price}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Preferred Date</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Preferred Time</label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleBookTest} 
            className="w-full"
            disabled={!user}
          >
            {!user ? 'Please log in to book test' : 'Book Test'}
          </Button>
        </CardContent>
      </Card>

      {user && labTests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Lab Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {labTests.map((test) => (
                <Card key={test.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{test.test_name}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(test.scheduled_date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(test.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <span className={`capitalize ${getStatusColor(test.status)}`}>
                            {test.status}
                          </span>
                        </div>
                        {test.price && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Price: ${test.price}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        {test.status === 'completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadReport(test)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Report
                          </Button>
                        )}
                        
                        {test.status === 'completed' && !test.follow_up_scheduled && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleScheduleFollowUp(test.id)}
                          >
                            <Calendar className="h-4 w-4 mr-1" />
                            Follow-up
                          </Button>
                        )}
                        
                        {test.follow_up_scheduled && (
                          <div className="flex items-center gap-1 text-sm text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            Follow-up scheduled
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IntegratedLabTestBooking;