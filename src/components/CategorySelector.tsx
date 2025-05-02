
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const categories = [
  { 
    id: "mental-health", 
    name: "Mental Health", 
    subcategories: ["Anxiety", "Depression", "Stress Management", "Family Therapy"],
    description: "Our mental health specialists provide compassionate care for a range of psychological needs, helping you achieve balanced emotional wellbeing through evidence-based therapeutic approaches.",
    image: "https://images.unsplash.com/photo-1573497019418-b400bb3ab074?q=80&w=1470&auto=format&fit=crop"
  },
  { 
    id: "physical-therapy", 
    name: "Physical Therapy", 
    subcategories: ["Sports Injuries", "Rehabilitation", "Pain Management"],
    description: "Our physical therapists are experts in movement science, helping you recover from injuries, manage chronic pain, and improve your mobility through personalized treatment programs.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1470&auto=format&fit=crop"
  },
  { 
    id: "nutrition", 
    name: "Nutrition", 
    subcategories: ["Weight Management", "Sports Nutrition", "Diet Planning"],
    description: "Our nutrition specialists create personalized diet and wellness plans based on scientific evidence, helping you achieve optimal health through proper nutrition and sustainable eating habits.",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1470&auto=format&fit=crop"
  },
  { 
    id: "preventive-care", 
    name: "Preventive Care", 
    subcategories: ["Health Maintenance", "Disease Prevention", "Wellness"],
    description: "Our preventive care specialists focus on proactive health measures to help you avoid illness and maintain optimal health through regular screenings, lifestyle guidance, and early intervention.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1470&auto=format&fit=crop"
  },
  { 
    id: "holistic-health", 
    name: "Holistic Health", 
    subcategories: ["Mindfulness", "Alternative Medicine", "Natural Healing"],
    description: "Our holistic health practitioners take an integrated approach to wellness, addressing the physical, mental, and spiritual aspects of health through both conventional and complementary techniques.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1520&auto=format&fit=crop"
  }
];

interface CategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedSubcategory: string;
  onSubcategoryChange: (subcategory: string) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onCategoryChange,
  selectedSubcategory,
  onSubcategoryChange
}) => {
  const currentCategory = categories.find(cat => cat.id === selectedCategory);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {currentCategory && (
        <div className="flex-1">
          <Select value={selectedSubcategory} onValueChange={onSubcategoryChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a specialization" />
            </SelectTrigger>
            <SelectContent>
              {currentCategory.subcategories.map((sub) => (
                <SelectItem key={sub} value={sub}>
                  {sub}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};