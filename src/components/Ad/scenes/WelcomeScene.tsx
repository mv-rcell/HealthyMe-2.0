import React from "react";
import { Hospital, Dumbbell, Apple } from "lucide-react";

const WelcomeScene = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center relative">
      <div className="absolute inset-0 flex items-center justify-around opacity-20 pointer-events-none">
        <img 
          src="/weight-8246973_1280.jpg" 
          alt="Gym Equipment"
          className="w-64 h-64 object-cover rounded-2xl rotate-6 blur-sm"
        />
        <img 
          src="/vegetable-pan-8027678_1280.jpg" 
          alt="Healthy Food"
          className="w-48 h-48 object-cover rounded-2xl -rotate-6 blur-sm"
        />
      </div>
      <div className="mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 animate-pulse-slow shadow-md">
        <Hospital className="h-10 w-10 text-[#1666ba] animate-float" />
      </div>
      <h1 className="text-4xl md:text-6xl font-bold mb-3 animate-fade-in">
        <span className="bg-gradient-to-r from-[#1666ba] to-[#3ba8e2] bg-clip-text text-transparent">
          HealthyMe
        </span>
      </h1>
      <p className="text-lg md:text-2xl text-gray-600 max-w-md mx-auto animate-fade-in" style={{ animationDelay: "300ms" }}>
        Where Efficiency Meets Excellence in Healthcare
      </p>
    </div>
  );
};

export default WelcomeScene;