import React, { useState } from 'react';
import { Calendar, FileText, Download, Clock, CheckCircle, User, Phone, CreditCard } from 'lucide-react';

const LabTestBookingPage = () => {
  const [testType, setTestType] = useState('');
  const [testDate, setTestDate] = useState('');
  const [homeCollection, setHomeCollection] = useState(false);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock lab tests data
  const labTests = [
    {
      id: '1',
      test_name: 'Blood Glucose',
      scheduled_date: '2024-01-20T10:00:00',
      status: 'completed',
      price: 35,
      age: '32',
      gender: 'Male',
      phone_number: '+1 (555) 123-4567',
      report_url: null,
      follow_up_scheduled: false
    },
    {
      id: '2',
      test_name: 'Lipid Profile',
      scheduled_date: '2024-01-25T14:30:00',
      status: 'scheduled',
      price: 65,
      age: '32',
      gender: 'Male',
      phone_number: '+1 (555) 123-4567',
      report_url: null,
      follow_up_scheduled: false
    }
  ];

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

  const getTestPrice = (testName) => {
    const prices = {
      'ANA': 60, 'Vitamin B12': 45, 'TSH': 30, 'Cholesterol': 35, 'Bilirubin': 25, 'Prolactin': 40
    };
    return prices[testName] || 40;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBookTest = async () => {
    if (!testType || !testDate || !age || !gender || !phoneNumber) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setTestType('');
      setTestDate('');
      setHomeCollection(false);
      setAge('');
      setGender('');
      setPhoneNumber('');
      setLoading(false);
      alert('Lab test booked successfully!');
    }, 1500);
  };

  const handleDownloadReport = (reportUrl, testName) => {
    const blob = new Blob(['Sample Test Report Content'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${testName}_report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleScheduleFollowUp = async (testId) => {
    alert('Follow-up scheduled for next week');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lab Test Booking</h1>
          <p className="text-lg text-gray-600">Schedule your lab tests and manage your health checkups</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tests</p>
                <p className="text-2xl font-bold text-gray-900">{labTests.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {labTests.filter(test => test.status === 'completed').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">
                  {labTests.filter(test => test.status === 'scheduled').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Book Test Form */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="px-6 py-5 border-b">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Book Lab Tests & Health Checkups
            </h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Test Type</label>
                <select
                  value={testType}
                  onChange={(e) => setTestType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select test type</option>
                  {Object.entries(categorizedLabTestOptions).map(([category, tests]) => (
                    <optgroup key={category} label={category}>
                      {tests.map((test) => (
                        <option key={test} value={test}>{test}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date & Time</label>
                <input
                  type="datetime-local"
                  value={testDate}
                  onChange={(e) => setTestDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter age"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="homeCollection"
                checked={homeCollection}
                onChange={(e) => setHomeCollection(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="homeCollection" className="text-sm text-gray-700">
                Home sample collection (+$10)
              </label>
            </div>

            <button
              onClick={handleBookTest}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Calendar className="h-5 w-5" />
              {loading ? 'Booking...' : 'Book Test'}
            </button>
          </div>
        </div>

        {/* Lab Tests List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-5 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Your Lab Tests</h2>
          </div>
          
          <div className="p-6">
            {labTests.length > 0 ? (
              <div className="space-y-4">
                {labTests.map((test) => (
                  <div key={test.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-medium text-gray-900">{test.test_name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                            {test.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>
                              {new Date(test.scheduled_date).toLocaleDateString()} at{' '}
                              {new Date(test.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            <span>Price: ${test.price}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>Age: {test.age || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>Gender: {test.gender || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2 md:col-span-2">
                            <Phone className="h-4 w-4" />
                            <span>Phone: {test.phone_number || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {test.status === 'completed' && (
                          <button
                            onClick={() => handleDownloadReport(test.report_url, test.test_name)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                          >
                            <Download className="h-4 w-4" />
                            Download Report
                          </button>
                        )}
                        {test.status === 'completed' && !test.follow_up_scheduled && (
                          <button
                            onClick={() => handleScheduleFollowUp(test.id)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Schedule Follow-up
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-600 mb-2">No lab tests booked yet</p>
                <p className="text-gray-500">Book your first test to get started with your health checkups</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabTestBookingPage;