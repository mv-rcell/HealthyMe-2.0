// Updated IntegratedLabTestBooking with lab test data from the uploaded images
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
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const { labTests, bookLabTest, downloadReport, scheduleFollowUp } = useLabTests();

  const categorizedLabTestOptions = {
    "Haematology": [
      "Haemogram/FBC/CBC", "ESR", "Haemoglobin", "Peripheral Blood Film", "WBC+DIFF",
      "Platelet Count", "Direct Coombs Test", "Haematocrit (PCV)", "Indirect Coombs Test",
      "Reticulocytes", "Haemolytics Screen", "Sickling Test", "Bone Marrow Cytology",
      "QBC(HB,WBC,PLT&MPS)", "Malaria Parasite/Antigen", "Hb Electrophoresis", "CD4",
      "Blood Grouping"
    ],
    "Coagulation": [
      "INR/PTI", "Thrombin Time", "APTT", "Fibrinogen", "Clotting Time",
      "Bleeding Time", "D Dimer", "Full Coagulation Profile"
    ],
    "Serology": [
      "HIV 1 & 2", "VDRL", "IgE", "TPHA", "Anti CCP"
    ],
    "Molecular Biology": [
      "HIV Viral Load", "HIV Resistant Test", "Confirmatory HIV PCR", "HEP B Viral Load",
      "TB PCR/HAIN", "Chlamydia PCR", "Gene Expert"
    ],
    "Microbiology": [
      "Blood Culture", "Stool Culture", "Stool Analysis", "Urine Analysis",
      "Urine Culture/Sensitivity", "Stool Salmonella Antigen", "Serum CRAG",
      "H.Pylori Stool Antigen", "Microscopy HVS", "Rota Adeno Stool Antigen",
      "Occult Blood Test", "Body Fluid C/S", "ZN Smear", "Semen Analysis",
      "Gram Stain", "HVS C/S", "Quantiferon TB Gold", "TB Culture", "Sputum Culture",
      "Tracheal Aspirate Culture", "Swab C/S", "Urethral Swab Microscopy", "Urethral Swab Culture",
      "Nasal Swab (MRSA)", "Urine PDT", "KOH", "Cryptosporidium"
    ],
    "Biochemistry - Diabetes": [
      "Random Glucose", "Fasting Glucose", "OGTT", "Osulivan Test", "HbA1c",
      "Microalbumin Random", "Post Pradial Glucose", "Lactate"
    ],
    "Biochemistry - Renal/Electrolytes/Bone": [
      "U/E/C", "Vitamin D (25 OH)", "Magnesium", "Potassium Only", "Estimated GFR (eGFR)",
      "Bicarbonate", "Creatinine Clearance", "Uric Acid", "Calcium", "Phosphate",
      "Alkaline Phosphatase", "Osmolality - Blood/Urine", "Electrolytes", "Creatinine"
    ],
    "Biochemistry - Other Chemistry": [
      "Procalcitonin", "High Sensitive CRP", "Homocystine", "Serum Iron",
      "T-Iron Binding Capacity", "Ferritin", "Urinary Metanephrines",
      "Beta 2 Microglobulin", "Urinary Catecholamines", "VMA", "Bence Jones Protein"
    ],
    "Cardiac Risk": [
      "Lipid Profile", "Apolipoprotein A", "Apolipoprotein B", "Cardiac Enzymes",
      "Cardiac Triage Screen", "BNP", "Cholesterol"
    ],
    "Tumour Markers": [
      "PSA", "5 HIAA", "CEA", "CA 19-9", "Ca125", "AFP", "CA 15-3"
    ],
    "Pharmacology": [
      "Drugs of Abuse Profile", "Amikacin", "Carbamazepine (Tegretol)", "Cyclosporin",
      "Digoxin", "Epilim (Valproic Acid)", "Phenytoin (Epanutin)", "Toxicology Screen"
    ]
  };

  const getTestPrice = (testName: string) => {
    const prices: { [key: string]: number } = {
      'ANA': 60, 'Vitamin B12': 45, 'TSH': 30, 'Cholesterol': 35, 'Bilirubin': 25, 'Prolactin': 40
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

  const handleBookTest = async () => {
    if (!user) {
      toast.error('Please log in to book a test');
      return;
    }

    if (!testType || !testDate || !age || !gender || !phoneNumber) {
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
        price: getTestPrice(testType) + (homeCollection ? 10 : 0),
        results: null,
        report_url: null,
        follow_up_scheduled: false,
        age,
        gender,
        phone_number: phoneNumber
      });

      setTestType('');
      setTestDate('');
      setHomeCollection(false);
      setAge('');
      setGender('');
      setPhoneNumber('');

      toast.success('Lab test booked successfully!');
    } catch (error: any) {
      toast.error(`Failed to book test: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = (reportUrl: string | null, testName: string) => {
    if (reportUrl) {
      downloadReport(reportUrl, testName);
    } else {
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
                  {Object.entries(categorizedLabTestOptions).map(([category, tests]) => (
                    <div key={category}>
                      <p className="px-2 py-1 text-xs font-semibold text-muted-foreground">{category}</p>
                      {tests.map((test) => (
                        <SelectItem key={test} value={test}>{test}</SelectItem>
                      ))}
                    </div>
                  ))}
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

            <div>
              <label className="block text-sm font-medium mb-2">Age</label>
              <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Enter age" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Gender</label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <Input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Enter phone number" />
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
                        {new Date(test.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <p className="text-sm text-muted-foreground">Price: ${test.price}</p>
                      <p className="text-sm mt-1">Age: {test.age || 'N/A'}</p>
                      <p className="text-sm">Gender: {test.gender || 'N/A'}</p>
                      <p className="text-sm">Phone: {test.phone_number || 'N/A'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(test.status)}>
                        {test.status}
                      </Badge>
                      {test.status === 'completed' && (
                        <Button size="sm" onClick={() => handleDownloadReport(test.report_url, test.test_name)}>
                          <Download className="h-4 w-4 mr-1" />
                          Download Report
                        </Button>
                      )}
                      {test.status === 'completed' && !test.follow_up_scheduled && (
                        <Button size="sm" variant="outline" onClick={() => handleScheduleFollowUp(test.id)}>
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
