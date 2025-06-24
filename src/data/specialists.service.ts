// specialists.service.ts
import { supabase } from '@/integrations/supabase/client';

export interface SpecialistData {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  location: string;
  availability: string;
  imageUrl: string;
  experience: string;
  languages: string[];
  consultationFee: number;
  subsequentvisits: number;
  description: string;
  isOnline: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export class SpecialistsService {
  static async addSpecialist(specialistData: {
    specialist_id: string;
    name: string;
    specialty: string;
    location: string;
    availability: string;
    image_url?: string;
    experience: string;
    languages: string[];
    consultation_fee: number;
    subsequent_visits_fee?: number;
    description: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('specialists_directory')
        .upsert([{
          specialist_id: specialistData.specialist_id,
          name: specialistData.name,
          specialty: specialistData.specialty,
          rating: 5.0,
          reviews: 0,
          location: specialistData.location,
          availability: specialistData.availability,
          image_url: specialistData.image_url || '/placeholder.svg',
          experience: specialistData.experience,
          languages: specialistData.languages,
          consultation_fee: specialistData.consultation_fee,
          subsequent_visits_fee: specialistData.subsequent_visits_fee || specialistData.consultation_fee,
          description: specialistData.description,
          is_online: false,
          is_active: true,
          updated_at: new Date().toISOString()
        }], {
          onConflict: 'specialist_id'
        });

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Error adding specialist:', error);
      return { success: false, error: error.message };
    }
  }

  static async getAllSpecialists(): Promise<SpecialistData[]> {
    try {
      const { data: specialists, error } = await supabase
        .from('specialists_directory')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;

      return specialists.map(specialist => ({
        id: specialist.specialist_id,
        name: specialist.name,
        specialty: specialist.specialty,
        rating: specialist.rating,
        reviews: specialist.reviews,
        location: specialist.location,
        availability: specialist.availability,
        imageUrl: specialist.image_url,
        experience: specialist.experience,
        languages: specialist.languages,
        consultationFee: specialist.consultation_fee,
        subsequentvisits: specialist.subsequent_visits_fee,
        description: specialist.description,
        isOnline: specialist.is_online,
        isActive: specialist.is_active,
        createdAt: specialist.created_at,
        updatedAt: specialist.updated_at
      }));
    } catch (error) {
      console.error('Error fetching specialists:', error);
      return [];
    }
  }

  static async getSpecialistsBySpecialty(specialty: string): Promise<SpecialistData[]> {
    try {
      const { data: specialists, error } = await supabase
        .from('specialists_directory')
        .select('*')
        .eq('specialty', specialty)
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (error) throw error;

      return specialists.map(specialist => ({
        id: specialist.specialist_id,
        name: specialist.name,
        specialty: specialist.specialty,
        rating: specialist.rating,
        reviews: specialist.reviews,
        location: specialist.location,
        availability: specialist.availability,
        imageUrl: specialist.image_url,
        experience: specialist.experience,
        languages: specialist.languages,
        consultationFee: specialist.consultation_fee,
        subsequentvisits: specialist.subsequent_visits_fee,
        description: specialist.description,
        isOnline: specialist.is_online,
        isActive: specialist.is_active,
        createdAt: specialist.created_at,
        updatedAt: specialist.updated_at
      }));
    } catch (error) {
      console.error('Error fetching specialists by specialty:', error);
      return [];
    }
  }

  static async updateOnlineStatus(specialistId: string, isOnline: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('specialists_directory')
        .update({ is_online: isOnline })
        .eq('specialist_id', specialistId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating online status:', error);
      return false;
    }
  }

  static async generateSpecialistsFileContent(): Promise<string> {
    try {
      const specialists = await this.getAllSpecialists();

      const specialistsArray = specialists.map((specialist) => {
        const escapedDescription = specialist.description
          .replace(/"/g, '\\"')
          .replace(/\n/g, '\\n');

        return `  {
    id: "${specialist.id}",
    name: "${specialist.name}",
    specialty: "${specialist.specialty}",
    rating: ${specialist.rating},
    reviews: ${specialist.reviews},
    location: "${specialist.location}",
    availability: "${specialist.availability}",
    imageUrl: "${specialist.imageUrl}",
    experience: "${specialist.experience}",
    languages: ${JSON.stringify(specialist.languages)},
    consultationFee: ${specialist.consultationFee},
    subsequentvisits: ${specialist.subsequentvisits},
    title: "",
    description: "${escapedDescription}",
    category: "",
    subcategory: "",
    isSpecialist: true
  }`;
      });

      return `export const specialists = [\n${specialistsArray.join(",\n")}\n];`;
    } catch (error) {
      console.error("Error generating specialists file content:", error);
      return "// Failed to generate specialists data.";
    }
  }
}
