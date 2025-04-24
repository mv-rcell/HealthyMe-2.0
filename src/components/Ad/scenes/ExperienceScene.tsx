
import React from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ExperienceScene = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center text-center relative">
      <div className="absolute inset-0 flex items-center justify-around opacity-20 pointer-events-none">
        <img 
          src="/images/wellness-center.jpg" 
          alt="Wellness Center"
          className="w-64 h-64 object-cover rounded-2xl rotate-6 blur-sm"
        />
        <img 
          src="/images/healthy-meal.jpg" 
          alt="Healthy Meal"
          className="w-48 h-48 object-cover rounded-2xl -rotate-6 blur-sm"
        />
      </div>
      <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in">
        <span className="bg-gradient-to-r from-[#1666ba] to-[#3ba8e2] bg-clip-text text-transparent">
          Experience the Difference
        </span>
      </h2>
      <p className="text-lg md:text-2xl text-gray-700 max-w-lg mx-auto mb-8 animate-fade-in" style={{ animationDelay: "300ms" }}>
        HealthyMe  Partner for Lifelong Health and Wellbeing
      </p>
      <Button
        size="lg"
        className="animate-bounce button-glow text-white flex items-center gap-2 bg-[#1666ba] hover:bg-[#145caf]"
        style={{ animationDelay: "600ms" }}
        onClick={() => navigate("/")}
      >
        <Play className="h-5 w-5" />
        Book Your Visit
      </Button>
    </div>
  );
};

export default ExperienceScene;