import React, { useState, useEffect } from 'react';
import { Calendar, FileText, Download, Clock, CheckCircle, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useLabTests } from '@/hooks/useLabTests';
import { useRealSpecialists } from '@/hooks/useRealSpecialists';
import { supabase } from '@/integrations/supabase/client';

interface TestSpecialty {
  testName: string;
  requiredSpecialty: string;
  price: number;
}

const testSpecialtyMapping: TestSpecialty[] = [
  { testName: 'Blood Test (Complete)', requiredSpecialty: 'general_practitioner', price: 50 },
  { testName: 'Urine Analysis', requiredSpecialty: 'general_practitioner', price: 25 },
  { testName: 'X-Ray', requiredSpecialty: 'radiologist', price: 75 },
  { testName: 'MRI Scan', requiredSpecialty: 'radiologist', price: 200 },
  { testName: 'CT Scan', requiredSpecialty: 'radiologist', price: 150 },
  { testName: 'ECG', requiredSpecialty: 'cardiologist', price: 30 },
  { testName: 'Blood Sugar', requiredSpecialty: 'general_practitioner', price: 20 },
  { testName: 'Cholesterol Test', requiredSpecialty: 'general_practitioner', price: 35 },
  { testName: 'Thyroid Function', requiredSpecialty: 'endocrinologist', price: 120 },
  { testName: 'Liver Function Test', requiredSpecialty: 'hepatologist', price: 90 }
];

const LabTestWithSpecialist = () => {
  const [testType, setTestType] = useState('');
  const [selectedSpecialist, setSelectedSpecialist] = useState('');
  const [testDate, setTestDate] = useState('');
  const [homeCollection, setHomeCollection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableSpecialists, setAvailableSpecialists] = useState<any[]>([]);
  
  const { user } = useAuth();
  const { labTests, bookLabTest, downloadReport, scheduleFollowUp } = useLabTests();
  const { specialists } = useRealSpecialists();

  // Filter specialists based on selected test type
  useEffect(() => {
    if (testType) {
      const testMapping = testSpecialtyMapping.find(t => t.testName === testType);
      if (testMapping) {
        const filteredSpecialists = specialists.filter(specialist => 
          specialist.specialist_type === testMapping.requiredSpecialty && 
          specialist.is_active
        );
        setAvailableSpecialists(filteredSpecialists);
        setSelectedSpecialist(''); // Reset specialist selection
      }
    }
  }, [testType, specialists]);

  const handleBookTest = async () => {
    if (!user) {
      toast.error('Please log in to book a test');
      return;
    }

    if (!testType || !testDate || !selectedSpecialist) {
      toast.error('Please fill in all required fields including specialist selection');
      return;
    }

    setLoading(true);
    try {
      const testMapping = testSpecialtyMapping.find(t => t.testName === testType);
      const specialist = specialists.find(s => s.id === selectedSpecialist);
      
      // Create the lab test
      await bookLabTest({
        test_type: 'diagnostic',
        test_name: testType,
        scheduled_date: testDate,
        status: 'scheduled',
        price: testMapping?.price || 50,
        results: null,
        report_url: null,
        follow_up_scheduled: false,
        specialist_id: selectedSpecialist,
        specialist_name: specialist?.full_name || '',
        home_collection: homeCollection
      });

      // Create a booking request for the specialist notification
      const { data: bookingRequest, error: bookingError } = await supabase
        .from('booking_requests')
        .insert({
          client_id: user.id,
          specialist_id: selectedSpecialist,
          service_type: `Lab Test: ${testType}`,
          preferred_date: testDate,
          duration: 60,
          notes: `${homeCollection ? 'Home collection requested. ' : ''}Lab test booking for ${testType}. Price: $${testMapping?.price || 50}`,
          status: 'pending'
        })
        .select()
        .single();

      if (bookingError) {
        console.error('Failed to create booking request:', bookingError);
      }
      
      // Reset form
      setTestType('');
      setSelectedSpecialist('');
      setTestDate('');
      setHomeCollection(false);
      
      toast.success(`Lab test booked with ${specialist?.full_name || 'specialist'}! The specialist will be notified.`);
    } catch (error: any) {
      toast.error(`Failed to book test: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const handleDownloadReport = (reportUrl: string | null, testName: string) => {
    if (reportUrl) {
      downloadReport(reportUrl, testName);
    } else {
      // Simulate report download for demo
      const blob = new Blob(['Sample Test Report Content'], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      downloadReport(url, testName);
      URL.revokeObjectURL(url);
    }
  };

  const handleScheduleFollowUp = async (testId: string) => {
    const followUpDate = new Date();
    followUpDate.setDate(followUpDate.getDate() + 7);
    await scheduleFollowUp(testId, followUpDate.toISOString());
  };

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Book Lab Tests with Qualified Specialists
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Test Type</label>
              <Select value={testType} onValueChange={setTestType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  {testSpecialtyMapping.map((test) => (
                    <SelectItem key={test.testName} value={test.testName}>
                      {test.testName} - ${test.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Qualified Specialist</label>
              <Select 
                value={selectedSpecialist} 
                onValueChange={setSelectedSpecialist}
                disabled={!testType}
              >
                <SelectTrigger>
                  <SelectValue placeholder={testType ? "Select specialist" : "Select test type first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableSpecialists.map((specialist) => (
                    <SelectItem key={specialist.id} value={specialist.id}>
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{specialist.full_name}</div>
                          <div className="text-xs text-muted-foreground">
                            {specialist.experience} • ${specialist.consultation_fee || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {testType && availableSpecialists.length === 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  No qualified specialists available for this test type
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Preferred Date & Time</label>
            <Input
              type="datetime-local"
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="homeCollection" 
              checked={homeCollection}
              onCheckedChange={(checked) => setHomeCollection(checked === true)}
            />
            <label htmlFor="homeCollection" className="text-sm">
              Home sample collection (+$10)
            </label>
          </div>

          <Button 
            onClick={handleBookTest} 
            disabled={loading || !testType || !selectedSpecialist} 
            className="w-full"
          >
            <Calendar className="h-4 w-4 mr-2" />
            {loading ? 'Booking...' : 'Book Test with Specialist'}
          </Button>
        </CardContent>
      </Card>

      {/* Your Lab Tests with Real-time Updates */}
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Your Lab Tests</CardTitle>
        </CardHeader>
        <CardContent>
          {labTests.length > 0 ? (
            <div className="space-y-4">
              {labTests.map((test) => (
                <div key={test.id} className="border border-border rounded-lg p-4 bg-card">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{test.test_name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(test.scheduled_date).toLocaleDateString()} at{' '}
                        {new Date(test.scheduled_date).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                      {test.specialist_name && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <UserCheck className="h-3 w-3" />
                          Specialist: {test.specialist_name}
                        </div>
                      )}
                      {test.price && (
                        <p className="text-sm text-muted-foreground">Price: ${test.price}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(test.status)}>
                        {test.status}
                      </Badge>
                      {test.status === 'completed' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleDownloadReport(test.report_url, test.test_name)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download Report
                        </Button>
                      )}
                      {test.status === 'completed' && !test.follow_up_scheduled && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleScheduleFollowUp(test.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Schedule Follow-up
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No lab tests booked yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LabTestWithSpecialist;