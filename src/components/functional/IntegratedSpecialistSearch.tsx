
import React, { useState } from 'react';
import { Search, Star, MapPin, Clock, Users, Brain, Stethoscope } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAIRecommendations } from '@/hooks/useAIRecommendations';
import { toast } from 'sonner';

interface Specialist {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  location: string;
  availability: string;
  image: string;
  experience: string;
  languages: string[];
  consultationFee: number;
  subsequentvisits:number;
  schedule?: string;
}


// Comprehensive specialist list based on the medical directory
const medicalSpecialists: Specialist[] = [
  // General Surgery
  {
    id: 1, name: "Dr. Dan Kiptoon", specialty: "General Surgery", rating: 4.8, reviews: 125, location: "MH-DOC Clinic", availability: "Mon 1:30pm", image: "/placeholder.svg", experience: "15 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 2, name: "Dr. John Wamwaki", specialty: "General Surgery", rating: 4.9, reviews: 98, location: "MH-DOC Clinic", availability: "Mon 9:0am", image: "/placeholder.svg", experience: "12 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 3, name: "Dr. Nyaim Opar", specialty: "General Surgery", rating: 4.7, reviews: 76, location: "MH-DOC Clinic", availability: "Tue 9:0am", image: "/placeholder.svg", experience: "18 years", languages: ["English", "Arabic"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 4, name: "Dr. Kiongi Mwaura", specialty: "General Surgery", rating: 4.7, reviews: 76, location: "MH-DOC Clinic", availability: "Wed 9:0am", image: "/placeholder.svg", experience: "19 years", languages: ["English",], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 5, name: "Dr. Awadh Mohamed", specialty: "General Surgery", rating: 4.8, reviews: 74, location: "MH-DOC Clinic", availability: "Wed 2:0pm", image: "/placeholder.svg", experience: "20 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 6, name: "Dr. Aggrey Wafula", specialty: "General Surgery", rating: 4.5, reviews: 74, location: "MH-DOC Clinic", availability: "Thur 9:0am", image: "/placeholder.svg", experience: "21 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 7, name: "Dr. Seymour Sinari", specialty: "General Surgery", rating: 4.6, reviews: 75, location: "MH-DOC Clinic", availability: "Fri 9:0am", image: "/placeholder.svg", experience: "21 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 8, name: "Dr. Andrew Ndonga", specialty: "General Surgery", rating: 4.8, reviews: 77, location: "MH-DOC Clinic", availability: "Sat 9:0am", image: "/placeholder.svg", experience: "15 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35
  },


  // General Medicine
  {
    id: 9, name: "Dr. Chakaya", specialty: "General Medicine", rating: 4.6, reviews: 143, location: "MH-DOC Clinic", availability: "Wed 9:0am", image: "/placeholder.svg", experience: "20 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 10, name: "Dr. E. Omoge", specialty: "General Medicine", rating: 4.8, reviews: 89, location: "MH-DOC Clinic", availability: "Wed 11:0am", image: "/placeholder.svg", experience: "14 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 11, name: "Dr. G. Achiya", specialty: "General Medicine", rating: 4.9, reviews: 89, location: "MH-DOC Clinic", availability: "Thur 2:0pm", image: "/placeholder.svg", experience: "15 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 12, name: "Dr. Mureithi", specialty: "General Medicine", rating: 5.0, reviews: 89, location: "MH-DOC Clinic", availability: "Fri 2:0pm", image: "/placeholder.svg", experience: "14 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },

  // Neurology
  {
    id: 13, name: "Prof. E. Amayo", specialty: "Neurology", rating: 4.9, reviews: 234, location: "MH-DOC Clinic", availability: "Wed 10:0am", image: "/placeholder.svg", experience: "25 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 14, name: "Dr. Kwasa", specialty: "Neurology", rating: 4.7, reviews: 156, location: "MH-DOC Clinic", availability: "Fri 9:0am", image: "/placeholder.svg", experience: "16 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 15, name: "Dr. P .Mativo", specialty: "Neurology", rating: 4.7, reviews: 156, location: "MH-DOC Clinic", availability: "Wed 9:0am", image: "/placeholder.svg", experience: "17 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35
  },

  // Psychiatry
  {
    id: 16, name: "Dr. D.Waroru", specialty: "Psychiatry", rating: 4.8, reviews: 198, location: "MH-DOC Clinic", availability: "Thu 9:0am", image: "/placeholder.svg", experience: "19 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 17, name: "Dr. S. Hinga", specialty: "Psychiatry", rating: 4.6, reviews: 87, location: "MH-DOC Clinic", availability: "Sat 9:0am", image: "/placeholder.svg", experience: "13 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 18, name: "Dr. I. Kanyanya", specialty: "Psychiatry", rating: 4.6, reviews: 88, location: "MH-DOC Clinic", availability: "Wed 2:0pm", image: "/placeholder.svg", experience: "15 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35
  },

  // ENT Surgery
  {
    id: 19, name: "Dr. Mureve", specialty: "ENT Surgery", rating: 4.7, reviews: 112, location: "MH-DOC Clinic", availability: "Mon 10:0am", image: "/placeholder.svg", experience: "17 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 20, name: "Dr. Omutsani", specialty: "ENT Surgery", rating: 4.8, reviews: 95, location: "MH-DOC Clinic", availability: "Tue 2:0pm", image: "/placeholder.svg", experience: "15 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 21, name: "Dr. Mugwe", specialty: "ENT Surgery", rating: 4.9, reviews: 99, location: "MH-DOC Clinic", availability: "Mon 10:0am", image: "/placeholder.svg", experience: "18 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 22, name: "Dr. G. Mberia", specialty: "ENT Surgery", rating: 4.9, reviews: 99, location: "MH-DOC Clinic", availability: "Wed 2:30pm", image: "/placeholder.svg", experience: "19 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 23, name: "Dr. B. Ongulo", specialty: "ENT Surgery", rating: 4.5, reviews: 96, location: "MH-DOC Clinic", availability: "Thur 9:0am", image: "/placeholder.svg", experience: "20 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 24, name: "Dr. Maria Muthoka", specialty: "ENT Surgery", rating: 4.8, reviews: 99, location: "MH-DOC Clinic", availability: "Thur 2:0pm", image: "/placeholder.svg", experience: "18 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 25, name: "Dr. Kabeu", specialty: "ENT Surgery", rating: 4.9, reviews: 98, location: "MH-DOC Clinic", availability: "Fri 9:0am", image: "/placeholder.svg", experience: "15 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35
  },

  // Dermatology
  {
    id: 26, name: "Dr. Jacqueline Kavete", specialty: "Dermatology", rating: 4.9, reviews: 167, location: "MH-DOC Clinic", availability: "Fri 12:30pm", image: "/placeholder.svg", experience: "18 years", languages: ["English", "French"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 27, name: "Dr. P. Njuguna", specialty: "Dermatology", rating: 4.7, reviews: 134, location: "MH-DOC Clinic", availability: "Tue 2:0pm", image: "/placeholder.svg", experience: "14 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 28, name: "Dr. P. Njuguna", specialty: "Dermatology", rating: 4.7, reviews: 138, location: "MH-DOC Clinic", availability: "Sat 9:0am", image: "/placeholder.svg", experience: "14 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },

  // Ophthalmology
  {
    id: 29, name: "Dr. J. Msyoki", specialty: "Ophthalmology", rating: 4.8, reviews: 145, location: "MH-DOC Clinic", availability: "Tue 9:0am", image: "/placeholder.svg", experience: "16 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 30, name: "Dr. J. Nyamori", specialty: "Ophthalmology", rating: 4.6, reviews: 98, location: "MH-DOC Clinic", availability: "Thu 9:0am", image: "/placeholder.svg", experience: "12 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 31, name: "Dr. Owen", specialty: "Ophthalmology", rating: 4.7, reviews: 98, location: "MH-DOC Clinic", availability: "Fri 9:0am", image: "/placeholder.svg", experience: "13 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },

  // Neonatology
  {
    id: 32, name: "Dr. M. Waiyego", specialty: "Neonatology", rating: 4.9, reviews: 176, location: "MH-DOC Clinic", availability: "Fri 10:0am", image: "/placeholder.svg", experience: "22 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 33, name: "Dr. Kimuhu", specialty: "Neonatology", rating: 4.9, reviews: 176, location: "MH-DOC Clinic", availability: "Thur 11:0am", image: "/placeholder.svg", experience: "23 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 34, name: "Dr. Gachen", specialty: "Neonatology", rating: 4.7, reviews: 176, location: "MH-DOC Clinic", availability: "Fri 1:30pm", image: "/placeholder.svg", experience: "24 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35
  },

  // Paediatrics
  {
    id: 35, name: "Dr. P. Muthiga", specialty: "Paediatrics", rating: 4.8, reviews: 203, location: "MH-DOC Clinic", availability: "Tue 9:0am", image: "/placeholder.svg", experience: "20 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 36, name: "Dr. D. Makewa", specialty: "Paediatrics", rating: 4.7, reviews: 189, location: "MH-DOC Clinic", availability: "Wed 10:0am", image: "/placeholder.svg", experience: "18 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 37, name: "Dr. Kimuhu", specialty: "Paediatrics", rating: 4.8, reviews: 190, location: "MH-DOC Clinic", availability: "Thur 8:0am", image: "/placeholder.svg", experience: "22 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 38, name: "Dr. S.Mugane", specialty: "Paediatrics", rating: 4.9, reviews: 190, location: "MH-DOC Clinic", availability: "Thur 9:0am", image: "/placeholder.svg", experience: "23 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 39, name: "Dr. Galgallo", specialty: "Paediatrics", rating: 4.9, reviews: 190, location: "MH-DOC Clinic", availability: "Fri 10:0am", image: "/placeholder.svg", experience: "24 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35
  },

  // Gastroenterology
  {
    id: 40, name: "Dr. S. Onyango", specialty: "Gastroenterology", rating: 4.8, reviews: 142, location: "MH-DOC Clinic", availability: "Mon 9:0am", image: "/placeholder.svg", experience: "17 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 41, name: "Dr. H. Kioko", specialty: "Gastroenterology", rating: 4.6, reviews: 108, location: "MH-DOC Clinic", availability: "Wed 2:0pm", image: "/placeholder.svg", experience: "14 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 42, name: "Dr. Lodenyo", specialty: "Gastroenterology", rating: 4.8, reviews: 10, location: "MH-DOC Clinic", availability: "Thur 2:0pm", image: "/placeholder.svg", experience: "16 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 43, name: "Dr. Mutie", specialty: "Gastroenterology", rating: 4.9, reviews: 10, location: "MH-DOC Clinic", availability: "Fri 11:0am", image: "/placeholder.svg", experience: "18 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },

  // Pain Clinic
  {
    id: 44, name: "Dr. T. Mwiti", specialty: "Pain Management", rating: 4.7, reviews: 87, location: "MH-DOC Clinic", availability: "Sat 10:0am", image: "/placeholder.svg", experience: "15 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
  
  // Urology
  {
    id: 45, name: "Dr. Willy Otele", specialty: "Urology", rating: 4.8, reviews: 156, location: "MH-DOC Clinic", availability: "Mon 11:0am", image: "/placeholder.svg", experience: "19 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 46, name: "Dr. Monda", specialty: "Urology", rating: 4.6, reviews: 123, location: "MH-DOC Clinic", availability: "Tue 2:0pm", image: "/placeholder.svg", experience: "16 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 47, name: "Dr. Waweru", specialty: "Urology", rating: 4.8, reviews: 125, location: "MH-DOC Clinic", availability: "Thur 2:0pm", image: "/placeholder.svg", experience: "17 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 48, name: "Dr. Owilla", specialty: "Urology", rating: 4.7, reviews: 125, location: "MH-DOC Clinic", availability: "Fri 9:0am", image: "/placeholder.svg", experience: "17 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 49, name: "Dr. Muigai Mararo", specialty: "Urology", rating: 4.9, reviews: 128, location: "MH-DOC Clinic", availability: "Sat 9:0am", image: "/placeholder.svg", experience: "20 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35
  },

  // Haematology
  {
    id: 50, name: "Dr. d. Maina", specialty: "Pain Management", rating: 4.7, reviews: 87, location: "MH-DOC Clinic", availability: "Mon 2:0pm", image: "/placeholder.svg", experience: "18 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
  
  // Paediatric Cardiac Clinic
  {
    id: 51, name: "Dr. N. Gachara", specialty: "Paediatric Cardiology", rating: 4.9, reviews: 145, location: "MH-DOC Clinic", availability: "Mon 9:0am", image: "/placeholder.svg", experience: "21 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 52, name: "Dr. L. Mutai", specialty: "Paediatric Cardiology", rating: 4.8, reviews: 132, location: "MH-DOC Clinic", availability: "Mon 9:0am", image: "/placeholder.svg", experience: "18 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 53, name: "Dr. C. Jowi", specialty: "Paediatric Cardiology", rating: 4.9, reviews: 135, location: "MH-DOC Clinic", availability: "Tue 11:0am", image: "/placeholder.svg", experience: "19 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 54, name: "Dr. G. Njihia", specialty: "Paediatric Cardiology", rating: 4.9, reviews: 132, location: "MH-DOC Clinic", availability: "Wed 12:0pm", image: "/placeholder.svg", experience: "22 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 55, name: "Dr. G. Aketch", specialty: "Paediatric Cardiology", rating: 4.8, reviews: 132, location: "MH-DOC Clinic", availability: "Thur 12:30pm", image: "/placeholder.svg", experience: "18 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
 
   // Adult Cardiology Clinic
   {
     id: 56, name: "Dr. Mwiraria", specialty: "Adult Cardiology", rating: 4.8, reviews: 142, location: "MH-DOC Clinic", availability: "Wed 8:0am", image: "/placeholder.svg", experience: "17 years", languages: ["English"], consultationFee: 40,
     subsequentvisits: 35
   },
   {
     id: 57, name: "Dr. Namasaka", specialty: "Adult Cardiology", rating: 4.6, reviews: 108, location: "MH-DOC Clinic", availability: "Thur 8:0am", image: "/placeholder.svg", experience: "14 years", languages: ["English"], consultationFee: 40,
     subsequentvisits: 35
   },
   {
     id: 57, name: "Dr. Nduiga", specialty: "Adult Cardiology", rating: 4.8, reviews: 10, location: "MH-DOC Clinic", availability: "Fri 8:0pm", image: "/placeholder.svg", experience: "16 years", languages: ["English"], consultationFee: 40,
     subsequentvisits: 35
   },
   {
     id: 59, name: "Dr. Mureithi Nyamu", specialty: "Adult Cardiology", rating: 4.9, reviews: 10, location: "MH-DOC Clinic", availability: "Fri 8:0am", image: "/placeholder.svg", experience: "18 years", languages: ["English"], consultationFee: 40,
     subsequentvisits: 35
   },
 
   // Paediatric Surgery
   {
     id: 60, name: "Dr. B. Waitara", specialty: "Paediatric Surgery", rating: 4.8, reviews: 142, location: "MH-DOC Clinic", availability: "Wed 8:0am", image: "/placeholder.svg", experience: "17 years", languages: ["English"], consultationFee: 40,
     subsequentvisits: 35
   },
   {
     id: 61, name: "Dr. Osawa", specialty: "Paediatric Surgery", rating: 4.6, reviews: 108, location: "MH-DOC Clinic", availability: "Thur 8:0am", image: "/placeholder.svg", experience: "14 years", languages: ["English"], consultationFee: 40,
     subsequentvisits: 35
   },
   {
     id: 62, name: "Dr. Kihiko", specialty: "Paediatric Surgery", rating: 4.8, reviews: 10, location: "MH-DOC Clinic", availability: "Fri 8:0pm", image: "/placeholder.svg", experience: "16 years", languages: ["English"], consultationFee: 40,
     subsequentvisits: 35
   },
   {
     id: 63, name: "Dr. J.Kamwetu", specialty: "Paediatric Surgery", rating: 4.9, reviews: 10, location: "MH-DOC Clinic", availability: "Fri 8:0am", image: "/placeholder.svg", experience: "18 years", languages: ["English"], consultationFee: 40,
     subsequentvisits: 35
   },
 

   // Paediatric Neurology
   {
     id: 64, name: "Dr. D. Makewa", specialty: "Paediatric Neurology", rating: 4.8, reviews: 142, location: "MH-DOC Clinic", availability: "Wed 10:0am", image: "/placeholder.svg", experience: "17 years", languages: ["English"], consultationFee: 40,
     subsequentvisits: 35
   },
   {
     id: 65, name: "Dr. P.B. Muthiga", specialty: "Paediatric Neurology", rating: 4.6, reviews: 108, location: "MH-DOC Clinic", availability: "Tue 9:0am", image: "/placeholder.svg", experience: "15 years", languages: ["English"], consultationFee: 40,
     subsequentvisits: 35
   },

    
  // Neuro-Surgery
  {
    id: 66, name: "Dr. Musau", specialty: "Neuro-Surgery", rating: 4.9, reviews: 89, location: "MH-DOC Clinic", availability: "Mon 10:0am", image: "/placeholder.svg", experience: "23 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 67, name: "Dr. Alex Njiru", specialty: "Neuro-Surgery", rating: 4.7, reviews: 90, location: "MH-DOC Clinic", availability: "Tue 8:0am", image: "/placeholder.svg", experience: "24 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 68, name: "Dr. Akuku/Dr. Wekesa", specialty: "Neuro-Surgery", rating: 4.9, reviews: 89, location: "MH-DOC Clinic", availability: "Thur 10:0am", image: "/placeholder.svg", experience: "21 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },

  // Maxillo-Facial Surgery
  {
    id: 69, name: "Dr. Odhiambo", specialty: "Maxillo-Facial Surgery", rating: 4.9, reviews: 89, location: "MH-DOC Clinic", availability: "Tue 11:0am", image: "/placeholder.svg", experience: "23 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 70, name: "Dr. Onyango J.F", specialty: "Maxillo-Facial Surgery", rating: 4.7, reviews: 90, location: "MH-DOC Clinic", availability: "Thur 2:0pm", image: "/placeholder.svg", experience: "24 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 71, name: "Dr. Mumenya", specialty: "Maxillo-Facial Surgery", rating: 4.9, reviews: 89, location: "MH-DOC Clinic", availability: "Fri 2:0pm", image: "/placeholder.svg", experience: "21 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },

  // Rheumatology
  {
    id: 72, name: "Dr. G. Oyoo", specialty: "Rheumatology", rating: 4.7, reviews: 98, location: "MH-DOC Clinic", availability: "Wed 9:30am", image: "/placeholder.svg", experience: "16 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
  
  // Paediatric Nephrology
  {
    id: 73, name: "Dr. Galgallo", specialty: "Paediatric Nephrology", rating: 4.8, reviews: 167, location: "MH-DOC Clinic", availability: "Thur 11:0am", image: "/placeholder.svg", experience: "19 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
  
  //Paed Endocrinologist
  {
    id: 74, name: "Dr. Paul Laigong", specialty: "Paed Endocrinologist", rating: 4.9, reviews: 89, location: "MH-DOC Clinic", availability: "Mon 9:0am", image: "/placeholder.svg", experience: "24 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35
  },
  
  //Asthma Clinic
  {
    id: 75, name: "Dr. Chakaya", specialty: "Asthma", rating: 4.6, reviews: 88, location: "MH-DOC Clinic", availability: "Fridays 10:0am", image: "/placeholder.svg", experience: "22 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35
  },

  //MTCC
  {
    id: 76, name: "Prof. Omonge", specialty: "MTCC", rating: 4.6, reviews: 88, location: "MH-DOC Clinic", availability: "Wednesdays 9:0am", image: "/placeholder.svg", experience: "23 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35
  },

  //Cardiothoracic Surgery
  {
    id: 77, name: "Dr. Ruturi", specialty: "Cardiothoracic Surgery", rating: 4.8, reviews: 88, location: "MH-DOC Clinic", availability: "Mondays 8:0am", image: "/placeholder.svg", experience: "24 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 78, name: "Dr. Enoch Makori", specialty: "Cardiothoracic Surgery", rating: 4.9, reviews: 88, location: "MH-DOC Clinic", availability: "Fridays 11:0am", image: "/placeholder.svg", experience: "20 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 79, name: "Dr. Muhinga", specialty: "Cardiothoracic Surgery", rating: 4.7, reviews: 88, location: "MH-DOC Clinic", availability: "Fridays 1:0pm", image: "/placeholder.svg", experience: "17 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35
  },

  // Breast Clinic
  {
    id: 80, name: "Dr. Moki Mwendwa", specialty: "Breast Surgery", rating: 4.8, reviews: 134, location: "MH-DOC Clinic", availability: "Wed 8:0am", image: "/placeholder.svg", experience: "17 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  },
  {
    id: 81, name: "Dr. Aggrey Wafula", specialty: "Breast Surgery", rating: 4.9, reviews: 138, location: "MH-DOC Clinic", availability: "Sat 9:0am", image: "/placeholder.svg", experience: "18 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35
  }

];

const IntegratedSpecialistSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  
  const { generateRecommendation, loading: aiLoading } = useAIRecommendations();

  // Extract unique specialties from the specialist list
  const specialties = Array.from(new Set(medicalSpecialists.map(s => s.specialty))).sort();

  const filteredSpecialists = medicalSpecialists.filter(specialist => {
    const matchesSearch = specialist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         specialist.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || specialist.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const getAIRecommendations = async () => {
    if (!symptoms.trim()) {
      toast.error('Please describe your symptoms to get AI recommendations');
      return;
    }

    const recommendation = await generateRecommendation({
      type: 'specialist',
      data: { symptoms }
    });

    if (recommendation) {
      setAiRecommendations([recommendation]);
      toast.success('AI recommendations generated successfully!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search specialists or specialties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Button variant="outline" className="md:w-auto">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
        {specialties.map((specialty) => (
          <Button
            key={specialty}
            variant={selectedSpecialty === specialty ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedSpecialty(selectedSpecialty === specialty ? '' : specialty)}
            className="text-xs justify-start"
          >
            {specialty}
          </Button>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-60" />
            AI-Powered Specialist Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Describe your symptoms or health concerns:</label>
            <Input
              placeholder="e.g., chest pain, headaches, skin issues..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button 
            onClick={getAIRecommendations}
            disabled={aiLoading}
            className="w-full"
          >
            <Stethoscope className="h-4 w-4 mr-2" />
            {aiLoading ? 'Analyzing...' : 'Get AI Recommendations'}
          </Button>
          
          {aiRecommendations.length > 0 && (
            <div className="mt-4 p-4 bg-white dark:bg-gray-80 rounded-lg border">
              <h4 className="font-medium mb-2">AI Recommendations:</h4>
              {aiRecommendations.map((rec, index) => (
                <div key={index} className="text-sm text-muted-foreground">
                  {rec}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground mb-4">
        Showing {filteredSpecialists.length} of {medicalSpecialists.length} specialists
      </div>

      <div className="grid gap-4">
        {filteredSpecialists.map((specialist) => (
          <Card key={specialist.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <img
                  src={specialist.image}
                  alt={specialist.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto md:mx-0"
                />
                
                <div className="flex-1 space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{specialist.name}</h3>
                      <p className="text-primary font-medium">{specialist.specialty}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-40 text-yellow-40" />
                        <span className="font-medium">{specialist.rating}</span>
                        <span className="text-muted-foreground">({specialist.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {specialist.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {specialist.availability}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {specialist.experience} experience
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {specialist.languages.map((language) => (
                      <Badge key={language} variant="secondary">
                        {language}
                      </Badge>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Consultation fee: </span>
                      <span className="font-semibold">$ {specialist.consultationFee}</span>
                      <Separator />
                      <span className="text-muted-foreground">Subsequent Visits: </span>
                      <span className="font-semibold">$ {specialist.subsequentvisits}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                      <Button size="sm">
                        Book Appointment
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredSpecialists.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No specialists found matching your criteria. Try adjusting your search.
        </div>
      )}
    </div>
  );
};

export default IntegratedSpecialistSearch;