
import React from 'react';
import RealTimeSpecialistSearch from '@/components/functional/RealTimeSpecialistSearch';
import BookingRequestsPanel from '@/components/functional/BookingRequestPanel';
import { useAuth } from '@/hooks/useAuth';

const IntegratedSpecialistSearch = () => {
  const { profile } = useAuth();

  return (
    <div className="space-y-6">
      <RealTimeSpecialistSearch />
    </div>
  );
};

export default IntegratedSpecialistSearch;