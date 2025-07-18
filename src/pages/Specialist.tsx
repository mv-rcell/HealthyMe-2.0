import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, ArrowLeft, Stethoscope, Heart, Brain, Eye, Scissors, Baby, Users, Video, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRealSpecialists } from "@/hooks/useRealSpecialists";
import { useZoomIntegration } from "@/hooks/useZoomIntegration";
import { useVideoCall } from "@/hooks/useVideoCall";
import { toast } from 'sonner';
import VirtualChat from "@/components/functional/VirtualChats.tsx";
import MessageThread from "@/components/messaging/MessageThread";
import RealTimeSpecialistCard from "@/components/functional/RealTimeSpecialistCard";

const specialtyCategories = [
  {
    id: "general-medicine",
    name: "General Medicine",
    description: "Primary care and family medicine",
    icon: Stethoscope,
    color: "bg-red-500"
  },
  {
    id: "surgery",
    name: "Surgery", 
    description: "General and specialized surgical procedures",
    icon: Scissors,
    color: "bg-blue-500"
  },
  {
    id: "neurology",
    name: "Neurology",
    description: "Brain and nervous system disorders",
    icon: Brain,
    color: "bg-purple-500"
  },
  {
    id: "mental-health",
    name: "Mental Health",
    description: "Psychiatric and psychological care",
    icon: Heart,
    color: "bg-green-500"
  },
  {
    id: "pediatrics",
    name: "Pediatrics",
    description: "Child and adolescent healthcare",
    icon: Baby,
    color: "bg-pink-500"
  },
  {
    id: "ophthalmology",
    name: "Ophthalmology",
    description: "Eye care and vision health",
    icon: Eye,
    color: "bg-indigo-500"
  },
  {
    id: "ent",
    name: "ENT Surgery",
    description: "Ear, nose, and throat specialists",
    icon: Users,
    color: "bg-orange-500"
  },
  {
    id: "dermatology",
    name: "Dermatology",
    description: "Skin, hair, and nail care",
    icon: Heart,
    color: "bg-teal-500"
  }
];

const Specialists = () => {
  const { user } = useAuth();
  const { specialists, loading } = useRealSpecialists();
  const { createZoomMeeting, loading: zoomLoading } = useZoomIntegration();
  const { startVideoCall, loading: videoLoading } = useVideoCall();
  
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || "");
  const [showCategoryList, setShowCategoryList] = useState(!categoryFromUrl);
  const [selectedSpecialist, setSelectedSpecialist] = useState<any>(null);
  const [communicationType, setCommunicationType] = useState<'chat' | 'message' | null>(null);
  
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
      setShowCategoryList(false);
    }
  }, [categoryFromUrl]);
  
  const filteredSpecialists = specialists.filter(specialist => {
    const matchesSearch = 
      !searchTerm || 
      specialist.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      specialist.specialist_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialist.bio?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
      specialist.specialist_type?.toLowerCase().includes(selectedCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowCategoryList(false);
  };

  const handleBackToCategories = () => {
    setSelectedCategory("");
    setShowCategoryList(true);
  };

  const currentCategory = specialtyCategories.find(cat => cat.id === selectedCategory);

  const startZoomCall = async (specialist: any) => {
    if (!user) {
      toast.error('Please log in to start a call');
      return;
    }

    const meeting = await createZoomMeeting(
      `Virtual Consultation with ${specialist.full_name}`,
      user.email || 'client@example.com'
    );
    
    if (meeting) {
      toast.success(`Zoom meeting created with ${specialist.full_name}!`);
    }
  };

  const startVideo = async (specialist: any) => {
    if (!user) {
      toast.error('Please log in to start a video call');
      return;
    }

    const appointmentId = Math.floor(Math.random() * 1000000);
    const session = await startVideoCall(appointmentId, specialist.id);
    if (session) {
      toast.success(`Video call started with ${specialist.full_name}!`);
    }
  };

  const openCommunication = (specialist: any, type: 'chat' | 'message') => {
    if (!user) {
      toast.error('Please log in to communicate');
      return;
    }
    setSelectedSpecialist(specialist);
    setCommunicationType(type);
  };

  const handleBookAppointment = (specialist: any) => {
    toast.info(`Booking appointment with ${specialist.full_name}...`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto">
          {showCategoryList ? (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Choose Specialty</h1>
                <p className="text-gray-600 text-sm">
                  Select a medical specialty to find qualified specialists
                </p>
              </div>
              
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search specialties..."
                  className="pl-10 bg-white border-gray-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {specialtyCategories
                  .filter(category => 
                    !searchTerm || 
                    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    category.description.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <motion.div
                        key={category.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="cursor-pointer"
                        onClick={() => handleCategorySelect(category.id)}
                      >
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col items-center text-center space-y-3 hover:shadow-md transition-shadow">
                          <div className={`${category.color} p-3 rounded-xl`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm">{category.name}</h3>
                            <p className="text-gray-500 text-xs mt-1">{category.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleBackToCategories} 
                  className="flex items-center gap-2 p-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {currentCategory?.name || 'All'} Specialists
                  </h1>
                  <p className="text-gray-600 text-sm">
                    {loading ? 'Loading...' : `${filteredSpecialists.length} specialists available`}
                  </p>
                </div>
              </div>
              
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search specialists..."
                  className="pl-10 bg-white border-gray-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredSpecialists.length > 0 ? (
                <div className="space-y-4">
                  {filteredSpecialists.map((specialist, index) => (
                    <motion.div
                      key={specialist.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                    >
                      <RealTimeSpecialistCard
                        specialist={specialist}
                        onStartMessage={(s) => openCommunication(s, 'message')}
                        onStartVideo={startVideo}
                        onStartZoom={startZoomCall}
                        onBookAppointment={handleBookAppointment}
                        loading={{
                          video: videoLoading,
                          zoom: zoomLoading
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-2">
                    <Stethoscope className="h-12 w-12 mx-auto" />
                  </div>
                  <p className="text-gray-500">
                    {specialists.length === 0 
                      ? "No specialists have registered yet" 
                      : "No specialists found"
                    }
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mt-3"
                    onClick={() => setSearchTerm("")}
                  >
                    Clear Search
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      {/* Communication Dialogs */}
      <Dialog open={!!selectedSpecialist && communicationType === 'chat'} onOpenChange={() => {
        setSelectedSpecialist(null);
        setCommunicationType(null);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Virtual Chat with {selectedSpecialist?.full_name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <VirtualChat />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedSpecialist && communicationType === 'message'} onOpenChange={() => {
        setSelectedSpecialist(null);
        setCommunicationType(null);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Message {selectedSpecialist?.full_name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {user && selectedSpecialist && (
              <MessageThread
                currentUserId={user.id}
                recipientId={selectedSpecialist.id}
                recipientName={selectedSpecialist.full_name}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Specialists;
