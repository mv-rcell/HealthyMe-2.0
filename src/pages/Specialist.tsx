import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileCard from "@/components/ProfileCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { CategorySelector, categories } from "@/components/CategorySelector";
import { motion } from "framer-motion";
import { specialistsData } from "@/data/specialist.ts";

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
      specialist.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialist.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
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