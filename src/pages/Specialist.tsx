import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileCard from "@/components/ProfileCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { CategorySelector, categories } from "@/components/CategorySelector";
import { motion } from "framer-motion";


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
    category: "mental-health",
    subcategory: "Anxiety",
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
    category: "physical-therapy",
    subcategory: "Sports Injuries",
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
    category: "nutrition",
    subcategory: "Weight Management",
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
    category: "mental-health",
    subcategory: "Family Therapy",
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
    category: "preventive-care",
    subcategory: "Wellness",
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
    category: "holistic-health",
    subcategory: "Mindfulness",
    isSpecialist: true
  },
  {
    id: "7",
    name: "Dr. Elena Vasquez",
    title: "Nutritional Consultant",
    specialty: "Sports Nutrition",
    rating: 4.9,
    description: "Sports nutrition expert specializing in performance optimization through evidence-based dietary strategies for athletes of all levels.",
    imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=1287&auto=format&fit=crop",
    availability: "Available Mon-Thu",
    category: "nutrition",
    subcategory: "Sports Nutrition",
    isSpecialist: true
  },
  {
    id: "8",
    name: "Dr. Thomas Lee",
    title: "Diet Planner",
    specialty: "Diet Planning",
    rating: 4.7,
    description: "Specialized in creating personalized diet plans that are sustainable, balanced and tailored to individual health goals and dietary requirements.",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1287&auto=format&fit=crop",
    availability: "Available Wed-Sun",
    category: "nutrition",
    subcategory: "Diet Planning",
    isSpecialist: true
  }
];

// Sample nutrition content
const nutritionContent = {
  title: "Nutrition & Diet",
  description: "Proper nutrition is the foundation of good health and wellbeing. Our nutrition specialists develop personalized diet plans tailored to your unique health needs, preferences, and goals.",
  keyPoints: [
    "Evidence-based nutritional guidance",
    "Personalized meal planning",
    "Weight management strategies",
    "Sports performance nutrition",
    "Dietary strategies for health conditions"
  ],
  healthyFoods: [
    { name: "Leafy Greens", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=1480&auto=format&fit=crop", benefits: "Rich in vitamins, minerals and fiber" },
    { name: "Lean Proteins", image: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?q=80&w=1530&auto=format&fit=crop", benefits: "Essential for muscle repair and growth" },
    { name: "Whole Grains", image: "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?q=80&w=1369&auto=format&fit=crop", benefits: "Provide sustained energy and fiber" },
    { name: "Berries", image: "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?q=80&w=1396&auto=format&fit=crop", benefits: "Packed with antioxidants" }
  ]
};


const Specialists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [showCategoryContent, setShowCategoryContent] = useState(false);
  
  // Reset subcategory when category changes
  useEffect(() => {
    setSelectedSubcategory("");
    // Show category content when a category is selected
    setShowCategoryContent(!!selectedCategory);
  }, [selectedCategory]);
  
  // Filter specialists based on search term and selected categories
  const filteredSpecialists = specialistsData.filter(specialist => {
    const matchesSearch = 
    !searchTerm || 
      specialist.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      specialist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialist.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    
      const matchesCategory = !selectedCategory || specialist.category === selectedCategory;

      const matchesSubcategory = !selectedSubcategory || specialist.subcategory === selectedSubcategory;

    
    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedSubcategory("");
    setShowCategoryContent(false);

  };

  // Get current category data
  const currentCategory = categories.find(cat => cat.id === selectedCategory);


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

          {/* Category Content Display */}
          {showCategoryContent && currentCategory && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10 bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="md:flex">
                <div className="md:flex-shrink-0">
                  <img 
                    className="h-48 w-full object-cover md:h-full md:w-48" 
                    src={currentCategory.image} 
                    alt={currentCategory.name} 
                  />
                </div>
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-800">{currentCategory.name}</h2>
                  <p className="mt-2 text-gray-600">{currentCategory.description}</p>
                  
                  {currentCategory.id === "nutrition" && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-800">Healthy Food Choices</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {nutritionContent.healthyFoods.map((food, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="bg-gray-50 rounded-lg p-3 text-center shadow-sm"
                          >
                            <img src={food.image} alt={food.name} className="w-full h-24 object-cover rounded-md mb-2" />
                            <h4 className="font-medium text-gray-800">{food.name}</h4>
                            <p className="text-xs text-gray-600">{food.benefits}</p>
                          </motion.div>
                        ))}
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-800">Our Approach</h3>
                        <ul className="mt-2 space-y-1">
                          {nutritionContent.keyPoints.map((point, index) => (
                            <motion.li 
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                              className="flex items-center"
                            >
                              <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                              <span className="text-gray-700">{point}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {/* Similar detailed content for other categories could be added here */}

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold">Our {currentCategory.name} Specialists</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Meet our team of highly qualified {currentCategory.name.toLowerCase()} specialists ready to help you achieve your health goals.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Specialists grid */}
          {filteredSpecialists.length > 0 ? (
           <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.5, delay: 0.2 }}
           className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
         >
           {filteredSpecialists.map((specialist, index) => (
             <motion.div
                key={specialist.id}
                initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <ProfileCard 
                    {...specialist}
                  />
                </motion.div>
                
                
              ))}
            </motion.div>
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