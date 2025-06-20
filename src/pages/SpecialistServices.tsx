import React, { useState } from 'react';
import { Plus, Edit, Clock, DollarSign, TestTube, Stethoscope, Activity, Menu, X, Trash2, Eye, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

const SpecialistServicesDemo = () => {
  const [showServiceDialog, setShowServiceDialog] = useState(false);
  const [showLabTestDialog, setShowLabTestDialog] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [selectedLabTest, setSelectedLabTest] = useState(null);
  const [services, setServices] = useState([
    {
      id: 1,
      service_name: "Comprehensive Nutrition Assessment",
      description: "Complete dietary analysis with personalized meal planning and supplement recommendations",
      duration: 90,
      price: 150,
      is_active: true
    },
    {
      id: 2,
      service_name: "Follow-up Consultation",
      description: "Progress review and plan adjustments",
      duration: 45,
      price: 75,
      is_active: true
    },
    {
      id: 3,
      service_name: "Group Nutrition Workshop",
      description: "Educational workshop for small groups",
      duration: 120,
      price: 200,
      is_active: false
    }
  ]);

  const [serviceForm, setServiceForm] = useState({
    service_name: '',
    description: '',
    duration: 60,
    price: 0,
    is_active: true
  });

  const [notifications, setNotifications] = useState([]);

  const specialtyLabTests = [
    { 
      id: 1,
      name: 'Comprehensive Metabolic Panel', 
      price: 120, 
      description: 'Blood glucose, electrolytes, kidney function',
      category: 'Basic Health',
      preparation: 'Fasting required for 8-12 hours',
      turnaround: '1-2 business days'
    },
    { 
      id: 2,
      name: 'Lipid Profile', 
      price: 80, 
      description: 'Cholesterol and triglyceride levels',
      category: 'Cardiovascular',
      preparation: 'Fasting required for 9-12 hours',
      turnaround: '1-2 business days'
    },
    { 
      id: 3,
      name: 'Vitamin D Level', 
      price: 90, 
      description: 'Vitamin D deficiency screening',
      category: 'Nutritional',
      preparation: 'No special preparation required',
      turnaround: '2-3 business days'
    },
    { 
      id: 4,
      name: 'Food Allergy Panel', 
      price: 200, 
      description: 'Common food allergen testing',
      category: 'Allergy',
      preparation: 'No antihistamines 7 days before test',
      turnaround: '3-5 business days'
    },
    { 
      id: 5,
      name: 'Thyroid Function Test', 
      price: 150, 
      description: 'TSH, T3, T4 levels',
      category: 'Endocrine',
      preparation: 'Morning collection preferred',
      turnaround: '1-2 business days'
    }
  ];

  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const handleCreateService = () => {
    if (!serviceForm.service_name.trim()) {
      addNotification('Service name is required', 'error');
      return;
    }
    if (serviceForm.duration < 1) {
      addNotification('Duration must be at least 1 minute', 'error');
      return;
    }
    if (serviceForm.price < 0) {
      addNotification('Price cannot be negative', 'error');
      return;
    }

    const newService = {
      id: Date.now(),
      ...serviceForm
    };
    setServices(prev => [...prev, newService]);
    setShowServiceDialog(false);
    resetForm();
    addNotification('Service created successfully!');
  };

  const handleUpdateService = () => {
    if (!serviceForm.service_name.trim()) {
      addNotification('Service name is required', 'error');
      return;
    }

    setServices(prev => prev.map(service => 
      service.id === editingService.id 
        ? { ...service, ...serviceForm }
        : service
    ));
    setShowServiceDialog(false);
    setEditingService(null);
    resetForm();
    addNotification('Service updated successfully!');
  };

  const handleDeleteService = (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(prev => prev.filter(service => service.id !== serviceId));
      addNotification('Service deleted successfully!');
    }
  };

  const toggleServiceStatus = (serviceId) => {
    setServices(prev => prev.map(service => 
      service.id === serviceId 
        ? { ...service, is_active: !service.is_active }
        : service
    ));
    const service = services.find(s => s.id === serviceId);
    addNotification(`Service ${service.is_active ? 'deactivated' : 'activated'} successfully!`);
  };

  const resetForm = () => {
    setServiceForm({
      service_name: '',
      description: '',
      duration: 60,
      price: 0,
      is_active: true
    });
  };

  const openEditDialog = (service) => {
    setEditingService(service);
    setServiceForm({
      service_name: service.service_name,
      description: service.description || '',
      duration: service.duration,
      price: service.price,
      is_active: service.is_active
    });
    setShowServiceDialog(true);
  };

  const openAddServiceDialog = () => {
    setEditingService(null);
    resetForm();
    setShowServiceDialog(true);
  };

  const handleRecommendLabTest = (test) => {
    addNotification(`${test.name} recommended to client successfully!`);
  };

  const handleViewLabTestDetails = (test) => {
    setSelectedLabTest(test);
    setShowLabTestDialog(true);
  };

  const Badge = ({ children, variant = 'default', className = '' }) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    const variants = {
      default: 'bg-blue-100 text-blue-800',
      secondary: 'bg-gray-100 text-gray-800',
      outline: 'bg-white border border-gray-300 text-gray-700',
      success: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`${baseClasses} ${variants[variant]} ${className}`}>
        {children}
      </span>
    );
  };

  const Button = ({ children, variant = 'default', size = 'default', onClick, className = '', disabled = false, ...props }) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    const variants = {
      default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-blue-500',
      destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
    };
    const sizes = {
      default: 'px-4 py-2 text-sm',
      sm: 'px-3 py-1.5 text-xs'
    };
    
    return (
      <button
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        onClick={onClick}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  };

  const Card = ({ children, className = '' }) => (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {children}
    </div>
  );

  const CardHeader = ({ children }) => (
    <div className="px-6 py-4 border-b border-gray-200">
      {children}
    </div>
  );

  const CardTitle = ({ children, className = '' }) => (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  );

  const CardContent = ({ children, className = '' }) => (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );

  // Calculate statistics
  const activeServices = services.filter(s => s.is_active);
  const totalValue = services.reduce((sum, service) => sum + service.price, 0);
  const avgDuration = services.length > 0 
    ? Math.round(services.reduce((sum, service) => sum + service.duration, 0) / services.length) 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`flex items-center p-3 rounded-lg shadow-lg ${
              notification.type === 'error' 
                ? 'bg-red-50 border border-red-200' 
                : 'bg-green-50 border border-green-200'
            }`}
          >
            {notification.type === 'error' ? (
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            )}
            <span className={`text-sm ${
              notification.type === 'error' ? 'text-red-800' : 'text-green-800'
            }`}>
              {notification.message}
            </span>
          </div>
        ))}
      </div>

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-blue-600">HealthPlatform</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Dr. Sarah Johnson</span>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">SJ</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Services</h1>
            <p className="text-gray-600">Manage your services, pricing, and lab tests</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={openAddServiceDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
            <Button  onClick variant="outline">
              Back to Dashboard
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                My Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              {services.length > 0 ? (
                <div className="space-y-4">
                  {services.map((service) => (
                    <Card key={service.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{service.service_name}</h4>
                            {service.description && (
                              <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={service.is_active ? 'success' : 'secondary'}>
                              {service.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {service.duration} min
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            ${service.price}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEditDialog(service)}>
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => toggleServiceStatus(service.id)}
                          >
                            {service.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleDeleteService(service.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Stethoscope className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No services yet</p>
                  <p className="text-sm">Create your first service to start accepting bookings</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Lab Tests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Recommended Lab Tests
                <Badge variant="secondary" className="ml-2">
                  Nutritionist
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {specialtyLabTests.map((test) => (
                  <Card key={test.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{test.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{test.description}</p>
                          <Badge variant="outline" className="mt-2">
                            {test.category}
                          </Badge>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          ${test.price}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRecommendLabTest(test)}
                        >
                          <UserPlus className="h-3 w-3 mr-1" />
                          Recommend
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleViewLabTestDetails(test)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Activity className="h-10 w-10 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{activeServices.length}</p>
                  <p className="text-sm text-gray-600">Active Services</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <DollarSign className="h-10 w-10 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">${totalValue}</p>
                  <p className="text-sm text-gray-600">Total Service Value</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Clock className="h-10 w-10 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{avgDuration} min</p>
                  <p className="text-sm text-gray-600">Avg. Duration</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Service Dialog Modal */}
      {showServiceDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {editingService ? 'Edit Service' : 'Create New Service'}
              </h2>
              <button 
                onClick={() => setShowServiceDialog(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                <input
                  type="text"
                  value={serviceForm.service_name}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, service_name: e.target.value }))}
                  placeholder="e.g., Nutrition Consultation"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your service..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={serviceForm.duration}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={serviceForm.is_active}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active</label>
              </div>
              <Button 
                onClick={editingService ? handleUpdateService : handleCreateService}
                className="w-full"
              >
                {editingService ? 'Update Service' : 'Create Service'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Lab Test Details Modal */}
      {showLabTestDialog && selectedLabTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Lab Test Details</h2>
              <button 
                onClick={() => setShowLabTestDialog(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 text-lg">{selectedLabTest.name}</h3>
                <Badge variant="outline" className="mt-1">{selectedLabTest.category}</Badge>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Description</h4>
                <p className="text-gray-600">{selectedLabTest.description}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Preparation Instructions</h4>
                <p className="text-gray-600">{selectedLabTest.preparation}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Turnaround Time</h4>
                <p className="text-gray-600">{selectedLabTest.turnaround}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Price</h4>
                <p className="text-2xl font-bold text-gray-900">${selectedLabTest.price}</p>
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={() => {
                    handleRecommendLabTest(selectedLabTest);
                    setShowLabTestDialog(false);
                  }}
                  className="flex-1"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Recommend to Client
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowLabTestDialog(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 HealthPlatform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SpecialistServicesDemo;