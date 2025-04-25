import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const categories = [
  { id: "mental-health", name: "Mental Health", subcategories: ["Anxiety", "Depression", "Stress Management", "Family Therapy"] },
  { id: "physical-therapy", name: "Physical Therapy", subcategories: ["Sports Injuries", "Rehabilitation", "Pain Management"] },
  { id: "nutrition", name: "Nutrition", subcategories: ["Weight Management", "Sports Nutrition", "Diet Planning"] },
  { id: "preventive-care", name: "Preventive Care", subcategories: ["Health Maintenance", "Disease Prevention", "Wellness"] },
  { id: "holistic-health", name: "Holistic Health", subcategories: ["Mindfulness", "Alternative Medicine", "Natural Healing"] }
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