import React, { useState } from 'react';
import { Search, Star, MapPin, Clock, Users, Brain, Stethoscope, Video, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAIRecommendations } from '@/hooks/useAIRecommendations';
import { useZoomIntegration } from '@/hooks/useZoomIntegration';
import { toast } from 'sonner';
import { specialistsData } from '@/data/specialist.ts';
import VirtualChat from './VirtualChat';

const IntegratedSpecialistSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const [selectedSpecialist, setSelectedSpecialist] = useState<any>(null);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  
  const { generateRecommendation, loading: aiLoading } = useAIRecommendations();
  const { loading: zoomLoading, createZoomMeeting } = useZoomIntegration();

  // Extract unique specialties from the specialist list
  const specialties = Array.from(new Set(specialistsData.map(s => s.specialty))).sort();

  const filteredSpecialists = specialistsData.filter(specialist => {
    const matchesSearch = specialist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         specialist.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || specialist.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const getAIRecommendations = async () => {
    if (!symptoms.trim()) {
      toast.error('Please describe your symptoms to get AI recommendations');
      return;
    }

    const recommendation = await generateRecommendation({
      type: 'specialist',
      data: { symptoms }
    });

    if (recommendation) {
      setAiRecommendations([recommendation]);
      toast.success('AI recommendations generated successfully!');
    }
  };

  const startVirtualConsultation = (specialist: any) => {
    setSelectedSpecialist(specialist);
    setIsConsultationOpen(true);
  };

  const initiateZoomCall = async (specialist: any) => {
    const meeting = await createZoomMeeting(
      `Virtual Consultation with ${specialist.name}`,
      'patient@example.com'
    );
    
    if (meeting) {
      toast.success(`Zoom meeting created with ${specialist.name}!`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search specialists or specialties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Button variant="outline" className="md:w-auto">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
        {specialties.map((specialty) => (
          <Button
            key={specialty}
            variant={selectedSpecialty === specialty ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedSpecialty(selectedSpecialty === specialty ? '' : specialty)}
            className="text-xs justify-start"
          >
            {specialty}
          </Button>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            AI-Powered Specialist Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Describe your symptoms or health concerns:</label>
            <Input
              placeholder="e.g., chest pain, headaches, skin issues..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button 
            onClick={getAIRecommendations}
            disabled={aiLoading}
            className="w-full"
          >
            <Stethoscope className="h-4 w-4 mr-2" />
            {aiLoading ? 'Analyzing...' : 'Get AI Recommendations'}
          </Button>
          
          {aiRecommendations.length > 0 && (
            <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <h4 className="font-medium mb-2">AI Recommendations:</h4>
              {aiRecommendations.map((rec, index) => (
                <div key={index} className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {rec}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground mb-4">
        Showing {filteredSpecialists.length} of {specialistsData.length} specialists
      </div>

      <div className="grid gap-4">
        {filteredSpecialists.map((specialist) => (
          <Card key={specialist.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <img
                  src={specialist.imageUrl}
                  alt={specialist.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto md:mx-0"
                />
                
                <div className="flex-1 space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{specialist.name}</h3>
                      <p className="text-primary font-medium">{specialist.specialty}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{specialist.rating}</span>
                        <span className="text-muted-foreground">({specialist.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {specialist.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {specialist.availability}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {specialist.experience} experience
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{specialist.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {specialist.languages.map((language) => (
                      <Badge key={language} variant="secondary">
                        {language}
                      </Badge>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Consultation fee: </span>
                      <span className="font-semibold">KES {specialist.consultationFee}</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                      <Button size="sm">
                        Book Appointment
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => startVirtualConsultation(specialist)}
                        className="flex items-center gap-1"
                      >
                        <MessageSquare className="h-3 w-3" />
                        Virtual Chat
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => initiateZoomCall(specialist)}
                        disabled={zoomLoading}
                        className="flex items-center gap-1"
                      >
                        <Video className="h-3 w-3" />
                        {zoomLoading ? 'Creating...' : 'Zoom Call'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredSpecialists.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No specialists found matching your criteria. Try adjusting your search.
        </div>
      )}

      {/* Virtual Consultation Dialog */}
      <Dialog open={isConsultationOpen} onOpenChange={setIsConsultationOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Virtual Consultation with {selectedSpecialist?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <VirtualChat />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IntegratedSpecialistSearch;