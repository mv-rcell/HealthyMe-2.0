import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileCard from "@/components/ProfileCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { CategorySelector, categories } from "@/components/CategorySelector";

// Sample specialist data
const specialistsData = [
  {
    id: "1",
    name: "Dr. Sarah Wambui",
    title: "Mental Health Therapist",
    specialty: "Anxiety & Depression",
    rating: 4.9,
    description: "Specializing in cognitive behavioral therapy for anxiety, depression, and stress management with over 10 years of experience working with adults and adolescents.",
    imageUrl: "https://images.unsplash.com/photo-1678695972687-033fa0bdbac9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHBob3RvcyUyMG9mJTIwYmxhY2slMjBhbmQlMjBhc2lhbiUyMGRvY3RvcnMlMjBpbiUyMEtlbnlhfGVufDB8fDB8fHww",
    availability: "Available Mon-Fri",
    isSpecialist: true
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    title: "Physical Therapist",
    specialty: "Sports Injuries",
    rating: 4.8,
    description: "Expert in sports medicine and rehabilitation, helping athletes and active individuals recover from injuries and improve performance through personalized therapy.",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1470&auto=format&fit=crop",
    availability: "Available Tue-Sat",
    isSpecialist: true
  },
  {
    id: "3",
    name: "Dr. Lisa Omollo",
    title: "Nutritionist",
    specialty: "Weight Management",
    rating: 4.7,
    description: "Registered dietitian helping clients achieve sustainable weight management and improved health through personalized nutrition plans and lifestyle coaching.",
    imageUrl: "https://images.unsplash.com/photo-1677195063105-276fd4b95b21?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBob3RvcyUyMG9mJTIwYmxhY2slMjBmZW1hbGUlMjBkb2N0b3JzJTIwaW4lMjBLZW55YXxlbnwwfHwwfHx8MA%3D%3D",
    availability: "Available Mon-Thu",
    isSpecialist: true
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    title: "Psychologist",
    specialty: "Family Therapy",
    rating: 4.9,
    description: "Licensed psychologist with extensive experience in family therapy, relationship counseling, and fostering healthy communication patterns within families.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop",
    availability: "Available Wed-Sun",
    isSpecialist: true
  },
  {
    id: "5",
    name: "Dr. Amara Patel",
    title: "Preventive Care Specialist",
    specialty: "Holistic Health",
    rating: 4.6,
    description: "Board-certified in preventive medicine with a focus on holistic approaches to health maintenance, disease prevention, and overall wellness optimization.",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1398&auto=format&fit=crop",
    availability: "Available Mon-Fri",
    isSpecialist: true
  },
  {
    id: "6",
    name: "Dr. Robert Otieno",
    title: "Stress Management Coach",
    specialty: "Mindfulness",
    rating: 4.8,
    description: "Certified mindfulness instructor and stress management expert helping clients develop practical techniques for reducing stress and improving mental wellbeing.",
    imageUrl: "https://images.unsplash.com/photo-1666887360742-974c8fce8e6b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGhvdG9zJTIwb2YlMjBibGFjayUyME1hbGUlMjBkb2N0b3JzJTIwaW4lMjBLZW55YXxlbnwwfHwwfHx8MA%3D%3D",
    availability: "Available Tue-Sat",
    isSpecialist: true
  }
];

// Specialty filter options
const specialties = [
  "All Specialties",
  "Mental Health",
  "Physical Therapy",
  "Nutrition",
  "Family Therapy",
  "Preventive Care",
  "Stress Management"
];


const Specialists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  
  // Filter specialists based on search term and selected categories
  const filteredSpecialists = specialistsData.filter(specialist => {
    const matchesSearch = 
      specialist.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      specialist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialist.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
      specialist.title.toLowerCase().includes(categories.find(cat => cat.id === selectedCategory)?.name.toLowerCase() || "");
    
    const matchesSubcategory = !selectedSubcategory || 
      specialist.specialty.includes(selectedSubcategory);
    
    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedSubcategory("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Our Specialists</h1>
          <p className="text-muted-foreground mb-8">
            Connect with our qualified healthcare professionals specializing in physical and mental wellbeing.
          </p>
          
          {/* Search and filter section */}
          <div className="space-y-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or keywords..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <CategorySelector
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedSubcategory={selectedSubcategory}
              onSubcategoryChange={setSelectedSubcategory}
            />
          </div>
          
          {/* Specialists grid */}
          {filteredSpecialists.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpecialists.map((specialist) => (
                <ProfileCard 
                  key={specialist.id}
                  {...specialist}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">No specialists found matching your criteria.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Specialists;
