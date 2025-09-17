import React, { useState } from 'react';
import RealTimeSpecialistSearch from '@/components/functional/RealTimeSpecialistSearch';
import IntegratedReviewsSystem from './IntegratedReviewsSystem';

interface Specialist {
  id: string;
  full_name: string | null;
  specialist_type: string | null;
  profile_picture_url?: string | null;
}

const SpecialistReviewsPage: React.FC = () => {
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);

  return (
    <div className="container mx-auto py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: Search */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Search Specialists</h2>
        <RealTimeSpecialistSearch onSelectSpecialist={setSelectedSpecialist} />
      </div>

      {/* Right: Reviews */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {selectedSpecialist ? `Reviews for ${selectedSpecialist.full_name}` : 'Specialist Reviews'}
        </h2>
        {selectedSpecialist ? (
          <IntegratedReviewsSystem specialistId={selectedSpecialist.id} />
        ) : (
          <p className="text-muted-foreground">
            Select a specialist to see their reviews and leave your feedback.
          </p>
        )}
      </div>
    </div>
  );
};

export default SpecialistReviewsPage;
