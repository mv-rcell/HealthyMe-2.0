import React from "react";
import { ShieldCheck, Heart, CalendarDays, Award, Salad, Carrot } from "lucide-react";

const TrustedCareScene = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center relative">
      <div className="absolute inset-0 flex items-center justify-around opacity-20 pointer-events-none">
        <img 
          src="public/dumbell-5237133_1280.jpg" 
          alt="Fitness Training"
          className="w-64 h-64 object-cover rounded-2xl rotate-3 blur-sm"
        />
        <img 
          src="public/woman-5591780_1280.jpg"
          alt="Nutrition Consultation"
          className="w-48 h-48 object-cover rounded-2xl -rotate-3 blur-sm"
        />
      </div>
      <h2 className="text-3xl md:text-4xl font-semibold mb-6 animate-fade-in">
        Trusted Care for Every Generation
      </h2>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: "300ms" }}>
        <div className="flex flex-col items-center bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md">
          <div className="text-[#1666ba] mb-2">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <p className="text-gray-700">International Healthcare Standards</p>
        </div>
        <div className="flex flex-col items-center bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md">
          <div className="text-[#1666ba] mb-2">
            <Heart className="h-6 w-6" />
          </div>
          <p className="text-gray-700">Compassionate, Person-Centered Approach</p>
        </div>
        <div className="flex flex-col items-center bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md">
          <div className="text-[#1666ba] mb-2">
            <CalendarDays className="h-6 w-6" />
          </div>
          <p className="text-gray-700">Accessible, Timely Appointments</p>
        </div>
        <div className="flex flex-col items-center bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md">
          <div className="text-[#1666ba] mb-2">
            <Award className="h-6 w-6" />
          </div>
          <p className="text-gray-700">Award-Winning Medical Team</p>
        </div>
      </div>
    </div>
  );
};

export default TrustedCareScene;