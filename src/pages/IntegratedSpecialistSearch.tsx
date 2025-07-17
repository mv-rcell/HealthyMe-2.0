import React from 'react';
import RealTimeSpecialistSearch from '@/components/functional/RealTimeSpecialistSearch.tsx';

const SpecialistSearchPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Healthcare Specialists
          </h1>
          <p className="text-gray-600">
            Search and connect with qualified healthcare professionals in your area
          </p>
        </header>
        
        <main>
          <RealTimeSpecialistSearch />
        </main>
      </div>
    </div>
  );
};

export default SpecialistSearchPage;