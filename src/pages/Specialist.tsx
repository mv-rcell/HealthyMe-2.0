import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileCard from "@/components/ProfileCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, ArrowLeft, Stethoscope, Heart, Brain, Eye, Scissors, Baby, Users, Video, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { specialistsData } from "@/data/specialist";
import { useSearchParams } from "react-router-dom";
import { useZoomIntegration } from "@/hooks/useZoomIntegration";
import { toast } from 'sonner';
import VirtualChat from "@/pages/VirtualChat.tsx";

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
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || "");
  const [showCategoryList, setShowCategoryList] = useState(!categoryFromUrl);
  const [selectedSpecialist, setSelectedSpecialist] = useState<any>(null);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  
  const { loading: zoomLoading, createZoomMeeting } = useZoomIntegration();
  
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
      setShowCategoryList(false);
    }
  }, [categoryFromUrl]);
  
  const filteredSpecialists = specialistsData.filter(specialist => {
    const matchesSearch = 
      !searchTerm || 
      specialist.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      specialist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialist.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialist.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || specialist.category === selectedCategory;
    
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
                    {currentCategory?.name} Specialists
                  </h1>
                  <p className="text-gray-600 text-sm">{filteredSpecialists.length} specialists available</p>
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
              
              {filteredSpecialists.length > 0 ? (
                <div className="space-y-4">
                  {filteredSpecialists.map((specialist, index) => (
                    <motion.div
                      key={specialist.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                    >
                      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <div className="flex gap-3">
                          <img
                            src={specialist.imageUrl}
                            alt={specialist.name}
                            className="w-16 h-16 rounded-xl object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-sm">{specialist.name}</h3>
                            <p className="text-blue-600 text-xs font-medium">{specialist.specialty}</p>
                            <p className="text-gray-500 text-xs mt-1 line-clamp-2">{specialist.description}</p>
                            
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>⭐ {specialist.rating}</span>
                                <span>KES {specialist.consultationFee}</span>
                              </div>
                              <div className="flex gap-1">
                                <Button size="sm" className="text-xs px-2 py-1">
                                  Book
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-xs px-2 py-1"
                                  onClick={() => startVirtualConsultation(specialist)}
                                >
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  Chat
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-xs px-2 py-1"
                                  onClick={() => initiateZoomCall(specialist)}
                                  disabled={zoomLoading}
                                >
                                  <Video className="h-3 w-3 mr-1" />
                                  {zoomLoading ? '...' : 'Call'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-2">
                    <Stethoscope className="h-12 w-12 mx-auto" />
                  </div>
                  <p className="text-gray-500">No specialists found</p>
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
      
      <Footer />
    </div>
  );
};

export default Specialists;
