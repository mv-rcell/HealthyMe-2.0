// The goal is to apply the styling and structure from the second file to the functionality and content of the first file
// without changing the data or logic of either.

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search, Star, MapPin, Clock, Users, Brain, Stethoscope } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAIRecommendations } from '@/hooks/useAIRecommendations';
import { toast } from 'sonner';
import { specialistsData } from '@/data/specialist.ts';
import { motion } from 'framer-motion';

const IntegratedSpecialistSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);

  const { generateRecommendation, loading: aiLoading } = useAIRecommendations();

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Search */}
          <div className="flex items-center relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search specialists or specialties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-gray-200"
            />
          </div>

          {/* Specialty Filter Buttons */}
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
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

          {/* AI Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-blue-600" />
              <h2 className="font-semibold text-gray-900 text-sm">AI-Powered Recommendations</h2>
            </div>

            <Input
              placeholder="e.g., chest pain, headaches, skin issues..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="mb-4"
            />

            <Button 
              onClick={getAIRecommendations}
              disabled={aiLoading}
              className="w-full text-xs"
            >
              <Stethoscope className="h-4 w-4 mr-2" />
              {aiLoading ? 'Analyzing...' : 'Get AI Recommendations'}
            </Button>

            {aiRecommendations.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border text-sm text-muted-foreground whitespace-pre-wrap">
                {aiRecommendations.map((rec, index) => (
                  <div key={index}>{rec}</div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Specialist Count */}
          <div className="text-xs text-gray-500">
            Showing {filteredSpecialists.length} of {specialistsData.length} specialists
          </div>

          {/* Specialist List */}
          {filteredSpecialists.length > 0 ? (
            <div className="space-y-4">
              {filteredSpecialists.map((specialist, index) => (
                <motion.div
                  key={specialist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * index }}
                >
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <div className="flex gap-3">
                      <img
                        src={specialist.imageUrl}
                        alt={specialist.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm">{specialist.name}</h3>
                        <p className="text-blue-600 text-xs font-medium">{specialist.specialty}</p>
                        <p className="text-gray-500 text-xs mt-1 line-clamp-2">{specialist.description}</p>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>⭐ {specialist.rating}</span>
                            <span>KES {specialist.consultationFee}</span>
                          </div>
                          <Button size="sm" className="text-xs px-3 py-1">
                            Book Appointment
                          </Button>
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
              <p className="text-gray-500">No specialists found matching your criteria.</p>
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
      </main>

      <Footer />
    </div>
  );
};

export default IntegratedSpecialistSearch;

