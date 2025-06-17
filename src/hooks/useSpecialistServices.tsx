import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SpecialistService {
  id: string;
  specialist_id: string;
  service_name: string;
  description?: string;
  duration: number;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useSpecialistServices = (specialistId?: string) => {
  const [services, setServices] = useState<SpecialistService[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchServices = async () => {
    if (!specialistId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('specialist_services')
        .select('*')
        .eq('specialist_id', specialistId)
        .order('service_name');

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const createService = async (service: Omit<SpecialistService, 'id' | 'specialist_id' | 'created_at' | 'updated_at'>) => {
    if (!specialistId) return;

    try {
      const { error } = await supabase
        .from('specialist_services')
        .insert({
          ...service,
          specialist_id: specialistId
        });

      if (error) throw error;
      toast.success('Service created successfully');
      fetchServices();
    } catch (error) {
      console.error('Error creating service:', error);
      toast.error('Failed to create service');
    }
  };

  const updateService = async (serviceId: string, updates: Partial<SpecialistService>) => {
    try {
      const { error } = await supabase
        .from('specialist_services')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', serviceId);

      if (error) throw error;
      toast.success('Service updated successfully');
      fetchServices();
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Failed to update service');
    }
  };

  useEffect(() => {
    fetchServices();
  }, [specialistId]);

  return {
    services,
    loading,
    createService,
    updateService,
    refetch: fetchServices
  };
};
