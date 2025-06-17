
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSpecialistServices } from '@/hooks/useSpecialistServices';
import { useHealthAI } from '@/hooks/useHealthAI';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Clock, DollarSign, TestTube, Stethoscope, Activity } from 'lucide-react';

const SpecialistServices = () => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const { services, createService, updateService } = useSpecialistServices(user?.id);
  const { loading: aiLoading } = useHealthAI();
  const [showServiceDialog, setShowServiceDialog] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [serviceForm, setServiceForm] = useState({
    service_name: '',
    description: '',
    duration: 60,
    price: 0,
    is_active: true
  });

  // Redirect if not logged in or not a specialist
  React.useEffect(() => {
    if (!loading && (!user || profile?.role !== 'specialist')) {
      navigate('/auth');
    }
  }, [user, profile, loading, navigate]);

  // Lab tests based on specialist type
  const getSpecialtyLabTests = (specialistType: string) => {
    const labTestsMap: {[key: string]: Array<{name: string, price: number, description: string}>} = {
      'nutritionist': [
        { name: 'Comprehensive Metabolic Panel', price: 120, description: 'Blood glucose, electrolytes, kidney function' },
        { name: 'Lipid Profile', price: 80, description: 'Cholesterol and triglyceride levels' },
        { name: 'Vitamin D Level', price: 90, description: 'Vitamin D deficiency screening' },
        { name: 'Food Allergy Panel', price: 200, description: 'Common food allergen testing' },
        { name: 'Thyroid Function Test', price: 150, description: 'TSH, T3, T4 levels' }
      ],
      'fitness_trainer': [
        { name: 'Complete Blood Count', price: 75, description: 'Overall health and fitness assessment' },
        { name: 'Testosterone Level', price: 100, description: 'Hormone levels for fitness optimization' },
        { name: 'Cortisol Level', price: 85, description: 'Stress hormone assessment' },
        { name: 'Lactate Threshold Test', price: 180, description: 'Athletic performance evaluation' },
        { name: 'Body Composition Analysis', price: 120, description: 'Muscle mass and body fat percentage' }
      ],
      'mental_health': [
        { name: 'Neurotransmitter Panel', price: 250, description: 'Brain chemistry analysis' },
        { name: 'Cortisol Rhythm Test', price: 160, description: 'Stress response evaluation' },
        { name: 'Vitamin B12 & Folate', price: 70, description: 'Mood-related vitamin levels' },
        { name: 'Thyroid Panel', price: 140, description: 'Thyroid impact on mental health' }
      ],
      'general_practitioner': [
        { name: 'Annual Physical Panel', price: 200, description: 'Complete health screening' },
        { name: 'Diabetes Screening', price: 60, description: 'HbA1c and glucose testing' },
        { name: 'Heart Health Panel', price: 180, description: 'Cardiac risk assessment' },
        { name: 'Cancer Screening Panel', price: 300, description: 'Early detection screening' },
        { name: 'Infectious Disease Panel', price: 150, description: 'Common infection screening' }
      ]
    };

    return labTestsMap[specialistType] || [
      { name: 'Basic Health Panel', price: 100, description: 'Standard health screening' },
      { name: 'Comprehensive Wellness Check', price: 180, description: 'Complete wellness assessment' }
    ];
  };

  const handleCreateService = async () => {
    await createService(serviceForm);
    setShowServiceDialog(false);
    resetForm();
  };

  const handleUpdateService = async () => {
    if (editingService) {
      await updateService(editingService.id, serviceForm);
      setShowServiceDialog(false);
      setEditingService(null);
      resetForm();
    }
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

  const openEditDialog = (service: any) => {
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

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const specialtyLabTests = getSpecialtyLabTests(profile?.specialist_type || '');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Services</h1>
            <p className="text-muted-foreground">Manage your services, pricing, and lab tests</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={showServiceDialog} onOpenChange={setShowServiceDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingService(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingService ? 'Edit Service' : 'Create New Service'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="service_name">Service Name</Label>
                    <Input
                      id="service_name"
                      value={serviceForm.service_name}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, service_name: e.target.value }))}
                      placeholder="e.g., Nutrition Consultation"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={serviceForm.description}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your service..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={serviceForm.duration}
                        onChange={(e) => setServiceForm(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={serviceForm.price}
                        onChange={(e) => setServiceForm(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={serviceForm.is_active}
                      onCheckedChange={(checked) => setServiceForm(prev => ({ ...prev, is_active: checked }))}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                  <Button 
                    onClick={editingService ? handleUpdateService : handleCreateService}
                    className="w-full"
                  >
                    {editingService ? 'Update Service' : 'Create Service'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={() => navigate('/specialist-dashboard')}>
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
                    <Card key={service.id} className="border border-border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">{service.service_name}</h4>
                            {service.description && (
                              <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={service.is_active ? 'default' : 'secondary'}>
                              {service.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                            <Button size="sm" variant="outline" onClick={() => openEditDialog(service)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {service.duration} min
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            ${service.price}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Stethoscope className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
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
                  {profile?.specialist_type?.replace('_', ' ') || 'General'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {specialtyLabTests.map((test, index) => (
                  <Card key={index} className="border border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{test.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{test.description}</p>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          ${test.price}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Button size="sm" variant="outline">
                          Recommend to Client
                        </Button>
                        <Button size="sm" variant="ghost">
                          View Details
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
                  <p className="text-2xl font-bold text-foreground">{services.filter(s => s.is_active).length}</p>
                  <p className="text-sm text-muted-foreground">Active Services</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <DollarSign className="h-10 w-10 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    ${services.reduce((sum, service) => sum + service.price, 0).toFixed(0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Service Value</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Clock className="h-10 w-10 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {services.length > 0 ? Math.round(services.reduce((sum, service) => sum + service.duration, 0) / services.length) : 0} min
                  </p>
                  <p className="text-sm text-muted-foreground">Avg. Duration</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SpecialistServices;