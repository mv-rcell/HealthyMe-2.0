import React from "react";
import { UsersRound, ShieldCheck, Hospital, Egg, Bean } from "lucide-react";

const ComprehensiveCareScene = () => {
  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className="absolute inset-0 flex items-center justify-around opacity-20 pointer-events-none">
       
        <img 
          src="/health-8168788_1280.jpg" 
          alt="Healthy Lifestyle"
          className="w-48 h-48 object-cover rounded-2xl -rotate-6 blur-sm"
        />
      </div>
      <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-center animate-fade-in">
        Comprehensive Care, Advanced Technology
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div
          className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-md hover-lift"
          style={{ animationDelay: "200ms" }}
        >
          <UsersRound className="h-12 w-12 text-[#1666ba] mb-4" />
          <h3 className="text-xl font-semibold mb-2">Specialist Consultations</h3>
          <p className="text-gray-600 text-center">Access leading experts across every field</p>
        </div>
        <div
          className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-md hover-lift"
          style={{ animationDelay: "400ms" }}
        >
          <ShieldCheck className="h-12 w-12 text-[#1666ba] mb-4" />
          <h3 className="text-xl font-semibold mb-2">Patient Safety First</h3>
          <p className="text-gray-600 text-center">World-class safety protocols for peace of mind</p>
        </div>
        <div
          className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-md hover-lift"
          style={{ animationDelay: "600ms" }}
        >
          <Hospital className="h-12 w-12 text-[#1666ba] mb-4" />
          <h3 className="text-xl font-semibold mb-2">State-of-the-Art Facilities</h3>
          <p className="text-gray-600 text-center">Modern equipment and caring environments</p>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveCareScene;