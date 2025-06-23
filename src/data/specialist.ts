
export interface Specialist {
  id: string;
  name: string;
  title: string;
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
  category: string;
  subcategory: string;
  isSpecialist: boolean;
}

export const specialistsData: Specialist[] = [
  // General Surgery
  {
    id: "1", name: "Dr. Dan Kiptoon", specialty: "General Surgery", rating: 4.8, reviews: 125, location: "MH-DOC Clinic", availability: "Mon 1:30pm", imageUrl: "/placeholder.svg", experience: "15 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "2", name: "Dr. John Wamwaki", specialty: "General Surgery", rating: 4.9, reviews: 98, location: "MH-DOC Clinic", availability: "Mon 9:0am", imageUrl: "/placeholder.svg", experience: "12 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "3", name: "Dr. Nyaim Opar", specialty: "General Surgery", rating: 4.7, reviews: 76, location: "MH-DOC Clinic", availability: "Tue 9:0am", imageUrl: "/placeholder.svg", experience: "18 years", languages: ["English", "Arabic"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "4", name: "Dr. Kiongi Mwaura", specialty: "General Surgery", rating: 4.7, reviews: 76, location: "MH-DOC Clinic", availability: "Wed 9:0am", imageUrl: "/placeholder.svg", experience: "19 years", languages: ["English",], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "5", name: "Dr. Awadh Mohamed", specialty: "General Surgery", rating: 4.8, reviews: 74, location: "MH-DOC Clinic", availability: "Wed 2:0pm", imageUrl: "/placeholder.svg", experience: "20 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "6", name: "Dr. Aggrey Wafula", specialty: "General Surgery", rating: 4.5, reviews: 74, location: "MH-DOC Clinic", availability: "Thur 9:0am", imageUrl: "/placeholder.svg", experience: "21 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "7", name: "Dr. Seymour Sinari", specialty: "General Surgery", rating: 4.6, reviews: 75, location: "MH-DOC Clinic", availability: "Fri 9:0am", imageUrl: "/placeholder.svg", experience: "21 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "8", name: "Dr. Andrew Ndonga", specialty: "General Surgery", rating: 4.8, reviews: 77, location: "MH-DOC Clinic", availability: "Sat 9:0am", imageUrl: "/placeholder.svg", experience: "15 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },


  // General Medicine
  {
    id: "9", name: "Dr. Chakaya", specialty: "General Medicine", rating: 4.6, reviews: 143, location: "MH-DOC Clinic", availability: "Wed 9:0am", imageUrl: "/placeholder.svg", experience: "20 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "10", name: "Dr. E. Omoge", specialty: "General Medicine", rating: 4.8, reviews: 89, location: "MH-DOC Clinic", availability: "Wed 11:0am", imageUrl: "/placeholder.svg", experience: "14 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "11", name: "Dr. G. Achiya", specialty: "General Medicine", rating: 4.9, reviews: 89, location: "MH-DOC Clinic", availability: "Thur 2:0pm", imageUrl: "/placeholder.svg", experience: "15 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "12", name: "Dr. Mureithi", specialty: "General Medicine", rating: 5.0, reviews: 89, location: "MH-DOC Clinic", availability: "Fri 2:0pm", imageUrl: "/placeholder.svg", experience: "14 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },

  // Neurology
  {
    id: "13", name: "Prof. E. Amayo", specialty: "Neurology", rating: 4.9, reviews: 234, location: "MH-DOC Clinic", availability: "Wed 10:0am", imageUrl: "/placeholder.svg", experience: "25 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "14", name: "Dr. Kwasa", specialty: "Neurology", rating: 4.7, reviews: 156, location: "MH-DOC Clinic", availability: "Fri 9:0am", imageUrl: "/placeholder.svg", experience: "16 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "15", name: "Dr. P .Mativo", specialty: "Neurology", rating: 4.7, reviews: 156, location: "MH-DOC Clinic", availability: "Wed 9:0am", imageUrl: "/placeholder.svg", experience: "17 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },

  // Psychiatry
  {
    id: "16", name: "Dr. D.Waroru", specialty: "Psychiatry", rating: 4.8, reviews: 198, location: "MH-DOC Clinic", availability: "Thu 9:0am", imageUrl: "/placeholder.svg", experience: "19 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "17", name: "Dr. S. Hinga", specialty: "Psychiatry", rating: 4.6, reviews: 87, location: "MH-DOC Clinic", availability: "Sat 9:0am", imageUrl: "/placeholder.svg", experience: "13 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "18", name: "Dr. I. Kanyanya", specialty: "Psychiatry", rating: 4.6, reviews: 88, location: "MH-DOC Clinic", availability: "Wed 2:0pm", imageUrl: "/placeholder.svg", experience: "15 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },

  // ENT Surgery
  {
    id: "19", name: "Dr. Mureve", specialty: "ENT Surgery", rating: 4.7, reviews: 112, location: "MH-DOC Clinic", availability: "Mon 10:0am", imageUrl: "/placeholder.svg", experience: "17 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "20", name: "Dr. Omutsani", specialty: "ENT Surgery", rating: 4.8, reviews: 95, location: "MH-DOC Clinic", availability: "Tue 2:0pm", imageUrl: "/placeholder.svg", experience: "15 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "21", name: "Dr. Mugwe", specialty: "ENT Surgery", rating: 4.9, reviews: 99, location: "MH-DOC Clinic", availability: "Mon 10:0am", imageUrl: "/placeholder.svg", experience: "18 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "22", name: "Dr. G. Mberia", specialty: "ENT Surgery", rating: 4.9, reviews: 99, location: "MH-DOC Clinic", availability: "Wed 2:30pm", imageUrl: "/placeholder.svg", experience: "19 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "23", name: "Dr. B. Ongulo", specialty: "ENT Surgery", rating: 4.5, reviews: 96, location: "MH-DOC Clinic", availability: "Thur 9:0am", imageUrl: "/placeholder.svg", experience: "20 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "24", name: "Dr. Maria Muthoka", specialty: "ENT Surgery", rating: 4.8, reviews: 99, location: "MH-DOC Clinic", availability: "Thur 2:0pm", imageUrl: "/placeholder.svg", experience: "18 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "25", name: "Dr. Kabeu", specialty: "ENT Surgery", rating: 4.9, reviews: 98, location: "MH-DOC Clinic", availability: "Fri 9:0am", imageUrl: "/placeholder.svg", experience: "15 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },

  // Dermatology
  {
    id: "26", name: "Dr. Jacqueline Kavete", specialty: "Dermatology", rating: 4.9, reviews: 167, location: "MH-DOC Clinic", availability: "Fri 12:30pm", imageUrl: "/placeholder.svg", experience: "18 years", languages: ["English", "French"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "27", name: "Dr. P. Njuguna", specialty: "Dermatology", rating: 4.7, reviews: 134, location: "MH-DOC Clinic", availability: "Tue 2:0pm", imageUrl: "/placeholder.svg", experience: "14 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "28", name: "Dr. P. Njuguna", specialty: "Dermatology", rating: 4.7, reviews: 138, location: "MH-DOC Clinic", availability: "Sat 9:0am", imageUrl: "/placeholder.svg", experience: "14 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },

  // Ophthalmology
  {
    id: "29", name: "Dr. J. Msyoki", specialty: "Ophthalmology", rating: 4.8, reviews: 145, location: "MH-DOC Clinic", availability: "Tue 9:0am", imageUrl: "/placeholder.svg", experience: "16 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "30", name: "Dr. J. Nyamori", specialty: "Ophthalmology", rating: 4.6, reviews: 98, location: "MH-DOC Clinic", availability: "Thu 9:0am", imageUrl: "/placeholder.svg", experience: "12 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "31", name: "Dr. Owen", specialty: "Ophthalmology", rating: 4.7, reviews: 98, location: "MH-DOC Clinic", availability: "Fri 9:0am", imageUrl: "/placeholder.svg", experience: "13 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },

  // Neonatology
  {
    id: "32", name: "Dr. M. Waiyego", specialty: "Neonatology", rating: 4.9, reviews: 176, location: "MH-DOC Clinic", availability: "Fri 10:0am", imageUrl: "/placeholder.svg", experience: "22 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "33", name: "Dr. Kimuhu", specialty: "Neonatology", rating: 4.9, reviews: 176, location: "MH-DOC Clinic", availability: "Thur 11:0am", imageUrl: "/placeholder.svg", experience: "23 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "34", name: "Dr. Gachen", specialty: "Neonatology", rating: 4.7, reviews: 176, location: "MH-DOC Clinic", availability: "Fri 1:30pm", imageUrl: "/placeholder.svg", experience: "24 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },

  // Paediatrics
  {
    id: "35", name: "Dr. P. Muthiga", specialty: "Paediatrics", rating: 4.8, reviews: 203, location: "MH-DOC Clinic", availability: "Tue 9:0am", imageUrl: "/placeholder.svg", experience: "20 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "36", name: "Dr. D. Makewa", specialty: "Paediatrics", rating: 4.7, reviews: 189, location: "MH-DOC Clinic", availability: "Wed 10:0am", imageUrl: "/placeholder.svg", experience: "18 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "37", name: "Dr. Kimuhu", specialty: "Paediatrics", rating: 4.8, reviews: 190, location: "MH-DOC Clinic", availability: "Thur 8:0am", imageUrl: "/placeholder.svg", experience: "22 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "38", name: "Dr. S.Mugane", specialty: "Paediatrics", rating: 4.9, reviews: 190, location: "MH-DOC Clinic", availability: "Thur 9:0am", imageUrl: "/placeholder.svg", experience: "23 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "39", name: "Dr. Galgallo", specialty: "Paediatrics", rating: 4.9, reviews: 190, location: "MH-DOC Clinic", availability: "Fri 10:0am", imageUrl: "/placeholder.svg", experience: "24 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },

  // Gastroenterology
  {
    id: "40", name: "Dr. S. Onyango", specialty: "Gastroenterology", rating: 4.8, reviews: 142, location: "MH-DOC Clinic", availability: "Mon 9:0am", imageUrl: "/placeholder.svg", experience: "17 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "41", name: "Dr. H. Kioko", specialty: "Gastroenterology", rating: 4.6, reviews: 108, location: "MH-DOC Clinic", availability: "Wed 2:0pm", imageUrl: "/placeholder.svg", experience: "14 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "42", name: "Dr. Lodenyo", specialty: "Gastroenterology", rating: 4.8, reviews: 10, location: "MH-DOC Clinic", availability: "Thur 2:0pm", imageUrl: "/placeholder.svg", experience: "16 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "43", name: "Dr. Mutie", specialty: "Gastroenterology", rating: 4.9, reviews: 10, location: "MH-DOC Clinic", availability: "Fri 11:0am", imageUrl: "/placeholder.svg", experience: "18 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },

  // Pain Clinic
  {
    id: "44", name: "Dr. T. Mwiti", specialty: "Pain Management", rating: 4.7, reviews: 87, location: "MH-DOC Clinic", availability: "Sat 10:0am", imageUrl: "/placeholder.svg", experience: "15 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  
  // Urology
  {
    id: "45", name: "Dr. Willy Otele", specialty: "Urology", rating: 4.8, reviews: 156, location: "MH-DOC Clinic", availability: "Mon 11:0am", imageUrl: "/placeholder.svg", experience: "19 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "46", name: "Dr. Monda", specialty: "Urology", rating: 4.6, reviews: 123, location: "MH-DOC Clinic", availability: "Tue 2:0pm", imageUrl: "/placeholder.svg", experience: "16 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "47", name: "Dr. Waweru", specialty: "Urology", rating: 4.8, reviews: 125, location: "MH-DOC Clinic", availability: "Thur 2:0pm", imageUrl: "/placeholder.svg", experience: "17 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "48", name: "Dr. Owilla", specialty: "Urology", rating: 4.7, reviews: 125, location: "MH-DOC Clinic", availability: "Fri 9:0am", imageUrl: "/placeholder.svg", experience: "17 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "49", name: "Dr. Muigai Mararo", specialty: "Urology", rating: 4.9, reviews: 128, location: "MH-DOC Clinic", availability: "Sat 9:0am", imageUrl: "/placeholder.svg", experience: "20 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },

  // Haematology
  {
    id: "50", name: "Dr. d. Maina", specialty: "Pain Management", rating: 4.7, reviews: 87, location: "MH-DOC Clinic", availability: "Mon 2:0pm", imageUrl: "/placeholder.svg", experience: "18 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  
  // Paediatric Cardiac Clinic
  {
    id: "51", name: "Dr. N. Gachara", specialty: "Paediatric Cardiology", rating: 4.9, reviews: 145, location: "MH-DOC Clinic", availability: "Mon 9:0am", imageUrl: "/placeholder.svg", experience: "21 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "52", name: "Dr. L. Mutai", specialty: "Paediatric Cardiology", rating: 4.8, reviews: 132, location: "MH-DOC Clinic", availability: "Mon 9:0am", imageUrl: "/placeholder.svg", experience: "18 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "53", name: "Dr. C. Jowi", specialty: "Paediatric Cardiology", rating: 4.9, reviews: 135, location: "MH-DOC Clinic", availability: "Tue 11:0am", imageUrl: "/placeholder.svg", experience: "19 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "54", name: "Dr. G. Njihia", specialty: "Paediatric Cardiology", rating: 4.9, reviews: 132, location: "MH-DOC Clinic", availability: "Wed 12:0pm", imageUrl: "/placeholder.svg", experience: "22 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "55", name: "Dr. G. Aketch", specialty: "Paediatric Cardiology", rating: 4.8, reviews: 132, location: "MH-DOC Clinic", availability: "Thur 12:30pm", imageUrl: "/placeholder.svg", experience: "18 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
 
   // Adult Cardiology Clinic
   {
     id: "56", name: "Dr. Mwiraria", specialty: "Adult Cardiology", rating: 4.8, reviews: 142, location: "MH-DOC Clinic", availability: "Wed 8:0am", imageUrl: "/placeholder.svg", experience: "17 years", languages: ["English"], consultationFee: 40,
     subsequentvisits: 35,
     title: "",
     description: "",
     category: "",
     subcategory: "",
     isSpecialist: false
   },
   {
     id: "57", name: "Dr. Namasaka", specialty: "Adult Cardiology", rating: 4.6, reviews: 108, location: "MH-DOC Clinic", availability: "Thur 8:0am", imageUrl: "/placeholder.svg", experience: "14 years", languages: ["English"], consultationFee: 40,
     subsequentvisits: 35,
     title: "",
     description: "",
     category: "",
     subcategory: "",
     isSpecialist: false
   },
   {
     id: "58", name: "Dr. Nduiga", specialty: "Adult Cardiology", rating: 4.8, reviews: 10, location: "MH-DOC Clinic", availability: "Fri 8:0pm", imageUrl: "/placeholder.svg", experience: "16 years", languages: ["English"], consultationFee: 40,
     subsequentvisits: 35,
     title: "",
     description: "",
     category: "",
     subcategory: "",
     isSpecialist: false
   },
   {
     id: "59", name: "Dr. Mureithi Nyamu", specialty: "Adult Cardiology", rating: 4.9, reviews: 10, location: "MH-DOC Clinic", availability: "Fri 8:0am", imageUrl: "/placeholder.svg", experience: "18 years", languages: ["English"], consultationFee: 40,
     subsequentvisits: 35,
     title: "",
     description: "",
     category: "",
     subcategory: "",
     isSpecialist: false
   },
 
   // Paediatric Surgery
   {
     id: "60", name: "Dr. B. Waitara", specialty: "Paediatric Surgery", rating: 4.8, reviews: 142, location: "MH-DOC Clinic", availability: "Wed 8:0am", imageUrl: "/placeholder.svg", experience: "17 years", languages: ["English"], consultationFee: 40,
     subsequentvisits: 35,
     title: "",
     description: "",
     category: "",
     subcategory: "",
     isSpecialist: false
   },
   {
     id: "61", name: "Dr. Osawa", specialty: "Paediatric Surgery", rating: 4.6, reviews: 108, location: "MH-DOC Clinic", availability: "Thur 8:0am", imageUrl: "/placeholder.svg", experience: "14 years", languages: ["English"], consultationFee: 40,
     subsequentvisits: 35,
     title: "",
     description: "",
     category: "",
     subcategory: "",
     isSpecialist: false
   },
   {
     id: "62", name: "Dr. Kihiko", specialty: "Paediatric Surgery", rating: 4.8, reviews: 10, location: "MH-DOC Clinic", availability: "Fri 8:0pm", imageUrl: "/placeholder.svg", experience: "16 years", languages: ["English"], consultationFee: 40,
     subsequentvisits: 35,
     title: "",
     description: "",
     category: "",
     subcategory: "",
     isSpecialist: false
   },
   {
     id: "63", name: "Dr. J.Kamwetu", specialty: "Paediatric Surgery", rating: 4.9, reviews: 10, location: "MH-DOC Clinic", availability: "Fri 8:0am", imageUrl: "/placeholder.svg", experience: "18 years", languages: ["English"], consultationFee: 40,
     subsequentvisits: 35,
     title: "",
     description: "",
     category: "",
     subcategory: "",
     isSpecialist: false
   },
 

   // Paediatric Neurology
   {
     id: "64", name: "Dr. D. Makewa", specialty: "Paediatric Neurology", rating: 4.8, reviews: 142, location: "MH-DOC Clinic", availability: "Wed 10:0am", imageUrl: "/placeholder.svg", experience: "17 years", languages: ["English"], consultationFee: 40,
     subsequentvisits: 35,
     title: "",
     description: "",
     category: "",
     subcategory: "",
     isSpecialist: false
   },
   {
     id: "65", name: "Dr. P.B. Muthiga", specialty: "Paediatric Neurology", rating: 4.6, reviews: 108, location: "MH-DOC Clinic", availability: "Tue 9:0am", imageUrl: "/placeholder.svg", experience: "15 years", languages: ["English"], consultationFee: 40,
     subsequentvisits: 35,
     title: "",
     description: "",
     category: "",
     subcategory: "",
     isSpecialist: false
   },

    
  // Neuro-Surgery
  {
    id: "66", name: "Dr. Musau", specialty: "Neuro-Surgery", rating: 4.9, reviews: 89, location: "MH-DOC Clinic", availability: "Mon 10:0am", imageUrl: "/placeholder.svg", experience: "23 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "67", name: "Dr. Alex Njiru", specialty: "Neuro-Surgery", rating: 4.7, reviews: 90, location: "MH-DOC Clinic", availability: "Tue 8:0am", imageUrl: "/placeholder.svg", experience: "24 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "68", name: "Dr. Akuku/Dr. Wekesa", specialty: "Neuro-Surgery", rating: 4.9, reviews: 89, location: "MH-DOC Clinic", availability: "Thur 10:0am", imageUrl: "/placeholder.svg", experience: "21 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },

  // Maxillo-Facial Surgery
  {
    id: "69", name: "Dr. Odhiambo", specialty: "Maxillo-Facial Surgery", rating: 4.9, reviews: 89, location: "MH-DOC Clinic", availability: "Tue 11:0am", imageUrl: "/placeholder.svg", experience: "23 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "70", name: "Dr. Onyango J.F", specialty: "Maxillo-Facial Surgery", rating: 4.7, reviews: 90, location: "MH-DOC Clinic", availability: "Thur 2:0pm", imageUrl: "/placeholder.svg", experience: "24 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "71", name: "Dr. Mumenya", specialty: "Maxillo-Facial Surgery", rating: 4.9, reviews: 89, location: "MH-DOC Clinic", availability: "Fri 2:0pm", imageUrl: "/placeholder.svg", experience: "21 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },

  // Rheumatology
  {
    id: "72", name: "Dr. G. Oyoo", specialty: "Rheumatology", rating: 4.7, reviews: 98, location: "MH-DOC Clinic", availability: "Wed 9:30am", imageUrl: "/placeholder.svg", experience: "16 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  
  // Paediatric Nephrology
  {
    id: "73", name: "Dr. Galgallo", specialty: "Paediatric Nephrology", rating: 4.8, reviews: 167, location: "MH-DOC Clinic", availability: "Thur 11:0am", imageUrl: "/placeholder.svg", experience: "19 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  
  //Paed Endocrinologist
  {
    id: "74", name: "Dr. Paul Laigong", specialty: "Paed Endocrinologist", rating: 4.9, reviews: 89, location: "MH-DOC Clinic", availability: "Mon 9:0am", imageUrl: "/placeholder.svg", experience: "24 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  
  //Asthma Clinic
  {
    id: "75", name: "Dr. Chakaya", specialty: "Asthma", rating: 4.6, reviews: 88, location: "MH-DOC Clinic", availability: "Fridays 10:0am", imageUrl: "/placeholder.svg", experience: "22 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },

  //MTCC
  {
    id: "76", name: "Prof. Omonge", specialty: "MTCC", rating: 4.6, reviews: 88, location: "MH-DOC Clinic", availability: "Wednesdays 9:0am", imageUrl: "/placeholder.svg", experience: "23 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },

  //Cardiothoracic Surgery
  {
    id: "77", name: "Dr. Ruturi", specialty: "Cardiothoracic Surgery", rating: 4.8, reviews: 88, location: "MH-DOC Clinic", availability: "Mondays 8:0am", imageUrl: "/placeholder.svg", experience: "24 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "78", name: "Dr. Enoch Makori", specialty: "Cardiothoracic Surgery", rating: 4.9, reviews: 88, location: "MH-DOC Clinic", availability: "Fridays 11:0am", imageUrl: "/placeholder.svg", experience: "20 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "79", name: "Dr. Muhinga", specialty: "Cardiothoracic Surgery", rating: 4.7, reviews: 88, location: "MH-DOC Clinic", availability: "Fridays 1:0pm", imageUrl: "/placeholder.svg", experience: "17 years", languages: ["English", "Swahili"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },

  // Breast Clinic
  {
    id: "80", name: "Dr. Moki Mwendwa", specialty: "Breast Surgery", rating: 4.8, reviews: 134, location: "MH-DOC Clinic", availability: "Wed 8:0am", imageUrl: "/placeholder.svg", experience: "17 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },
  {
    id: "81", name: "Dr. Aggrey Wafula", specialty: "Breast Surgery", rating: 4.9, reviews: 138, location: "MH-DOC Clinic", availability: "Sat 9:0am", imageUrl: "/placeholder.svg", experience: "18 years", languages: ["English"], consultationFee: 40,
    subsequentvisits: 35,
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isSpecialist: false
  },]