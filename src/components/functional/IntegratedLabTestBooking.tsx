
import { Calendar, FileText, Download, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useLabTests } from '@/hooks/useLabTests';
import { useState } from 'react';

const IntegratedLabTestBooking = () => {
  const [testType, setTestType] = useState('');
  const [testDate, setTestDate] = useState('');
  const [homeCollection, setHomeCollection] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const { labTests, bookLabTest, downloadReport, scheduleFollowUp } = useLabTests();

  const handleBookTest = async () => {
    if (!user) {
      toast.error('Please log in to book a test');
      return;
    }

    if (!testType || !testDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await bookLabTest({
        test_type: 'diagnostic',
        test_name: testType,
        scheduled_date: testDate,
        status: 'scheduled',
        price: getTestPrice(testType),
        results: null,
        report_url: null,
        follow_up_scheduled: false
      });
      
      // Reset form
      setTestType('');
      setTestDate('');
      setHomeCollection(false);
      
      toast.success('Lab test booked successfully!');
    } catch (error: any) {
      toast.error(`Failed to book test: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getTestPrice = (testName: string) => {
    const prices: { [key: string]: number } = {
      'Blood Test (Complete)': 50,
      'Urine Analysis': 25,
      'X-Ray': 75,
      'MRI Scan': 200,
      'CT Scan': 150,
      'ECG': 30,
      'Blood Sugar': 20,
      'Cholesterol Test': 35
    };
    return prices[testName] || 40;
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
            Book Lab Tests & Health Checkups
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
                  <SelectItem value="Blood Test (Complete)">Blood Test (Complete) - $50</SelectItem>
                  <SelectItem value="Urine Analysis">Urine Analysis - $25</SelectItem>
                  <SelectItem value="X-Ray">X-Ray - $75</SelectItem>
                  <SelectItem value="MRI Scan">MRI Scan - $200</SelectItem>
                  <SelectItem value="CT Scan">CT Scan - $150</SelectItem>
                  <SelectItem value="ECG">ECG - $30</SelectItem>
                  <SelectItem value="Blood Sugar">Blood Sugar - $20</SelectItem>
                  <SelectItem value="Cholesterol Test">Cholesterol Test - $35</SelectItem>
                </SelectContent>
              </Select>
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

          <Button onClick={handleBookTest} disabled={loading} className="w-full">
            <Calendar className="h-4 w-4 mr-2" />
            {loading ? 'Booking...' : 'Book Test'}
          </Button>
        </CardContent>
      </Card>

      {/* Your Lab Tests */}
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
                    <div>
                      <h4 className="font-medium text-foreground">{test.test_name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(test.scheduled_date).toLocaleDateString()} at{' '}
                        {new Date(test.scheduled_date).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
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

export default IntegratedLabTestBooking;