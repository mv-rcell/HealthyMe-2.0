import React from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CalendarRange, MapPin, MessageSquare, Star, Clock, ArrowLeft, Phone, Mail, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Sample specialist data - in a real app, this would come from an API or database
const specialistsData = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    title: "Mental Health Therapist",
    specialty: "Anxiety & Depression",
    rating: 4.9,
    description: "Specializing in cognitive behavioral therapy for anxiety, depression, and stress management with over 10 years of experience working with adults and adolescents.",
    detailedBio: "Dr. Sarah Johnson is a licensed mental health therapist with extensive training in cognitive behavioral therapy (CBT), mindfulness-based stress reduction, and trauma-informed care. After completing her doctorate at Stanford University, she worked in various clinical settings before establishing her private practice focused on helping clients manage anxiety and depression through evidence-based approaches. Dr. Johnson believes in a holistic approach to mental wellness that addresses both immediate symptoms and underlying causes.",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1374&auto=format&fit=crop",
    location: "Los Angeles, CA",
    availability: "Available Mon-Fri, 9AM-5PM",
    education: [
      "Ph.D. in Clinical Psychology, Stanford University",
      "M.A. in Counseling Psychology, UCLA",
      "B.A. in Psychology, UC Berkeley"
    ],
    languages: ["English", "Spanish"],
    specializations: ["Anxiety Disorders", "Depression", "Trauma Recovery", "Stress Management", "Work-Life Balance"],
    experience: "12 years",
    contactInfo: {
      email: "sarah.johnson@healthyme.com",
      phone: "(555) 123-4567"
    },
    isSpecialist: true
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    title: "Physical Therapist",
    specialty: "Sports Injuries",
    rating: 4.8,
    description: "Expert in sports medicine and rehabilitation, helping athletes and active individuals recover from injuries and improve performance through personalized therapy.",
    detailedBio: "Dr. Michael Chen is a board-certified physical therapist specializing in sports medicine and rehabilitation. With an extensive background working with professional athletes and weekend warriors alike, he brings a comprehensive approach to injury recovery and prevention. His treatment philosophy combines manual therapy techniques with personalized exercise programs designed to restore function, reduce pain, and enhance performance. Dr. Chen regularly participates in continuing education to stay current with the latest advancements in physical therapy practices.",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1470&auto=format&fit=crop",
    location: "San Francisco, CA",
    availability: "Available Tue-Sat, 8AM-6PM",
    education: [
      "Doctor of Physical Therapy, University of California San Francisco",
      "B.S. in Kinesiology, Stanford University",
      "Certified Strength and Conditioning Specialist"
    ],
    languages: ["English", "Mandarin"],
    specializations: ["Sports Injuries", "Post-surgical Rehabilitation", "Biomechanical Analysis", "Athletic Performance", "Injury Prevention"],
    experience: "8 years",
    contactInfo: {
      email: "michael.chen@healthyme.com",
      phone: "(555) 234-5678"
    },
    isSpecialist: true
  },
  {
    id: "3",
    name: "Dr. Lisa Rodriguez",
    title: "Nutritionist",
    specialty: "Weight Management",
    rating: 4.7,
    description: "Registered dietitian helping clients achieve sustainable weight management and improved health through personalized nutrition plans and lifestyle coaching.",
    detailedBio: "Dr. Lisa Rodriguez is a registered dietitian nutritionist with specialized training in weight management and medical nutrition therapy. Her approach integrates evidence-based nutritional science with behavioral coaching to help clients establish sustainable eating habits. Dr. Rodriguez believes that nutrition is highly individual, and she works closely with each client to develop personalized plans that align with their health goals, preferences, and lifestyle. She is passionate about dispelling nutrition myths and empowering clients with practical knowledge about food and wellness.",
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1470&auto=format&fit=crop",
    location: "Chicago, IL",
    availability: "Available Mon-Thu, 9AM-7PM",
    education: [
      "Ph.D. in Nutritional Sciences, Cornell University",
      "M.S. in Dietetics, University of Illinois",
      "B.S. in Nutrition, Michigan State University"
    ],
    languages: ["English", "Spanish"],
    specializations: ["Weight Management", "Medical Nutrition Therapy", "Digestive Health", "Sports Nutrition", "Plant-based Diets"],
    experience: "10 years",
    contactInfo: {
      email: "lisa.rodriguez@healthyme.com",
      phone: "(555) 345-6789"
    },
    isSpecialist: true
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    title: "Psychologist",
    specialty: "Family Therapy",
    rating: 4.9,
    description: "Licensed psychologist with extensive experience in family therapy, relationship counseling, and fostering healthy communication patterns within families.",
    detailedBio: "Dr. James Wilson is a licensed clinical psychologist specializing in family systems therapy. With over 15 years of experience working with families, couples, and individuals, he has developed expertise in addressing relational dynamics and communication patterns that contribute to discord and distress. Dr. Wilson takes a strengths-based approach to therapy, helping families identify and leverage their internal resources while developing new skills to navigate challenges more effectively. His therapeutic style is warm, engaged, and collaborative, creating a safe space for all family members to feel heard and understood.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop",
    location: "Denver, CO",
    availability: "Available Wed-Sun, 10AM-8PM",
    education: [
      "Psy.D. in Clinical Psychology, University of Denver",
      "M.A. in Family Systems Therapy, Colorado State University",
      "B.A. in Psychology, University of Colorado"
    ],
    languages: ["English"],
    specializations: ["Family Therapy", "Marital Counseling", "Parent-Child Relationships", "Blended Family Dynamics", "Communication Skills"],
    experience: "15 years",
    contactInfo: {
      email: "james.wilson@healthyme.com",
      phone: "(555) 456-7890"
    },
    isSpecialist: true
  },
  {
    id: "5",
    name: "Dr. Amara Patel",
    title: "Preventive Care Specialist",
    specialty: "Holistic Health",
    rating: 4.6,
    description: "Board-certified in preventive medicine with a focus on holistic approaches to health maintenance, disease prevention, and overall wellness optimization.",
    detailedBio: "Dr. Amara Patel is board-certified in preventive medicine with additional training in integrative health practices. Her approach combines conventional medical knowledge with evidence-based complementary therapies to create comprehensive prevention strategies. Dr. Patel specializes in helping clients identify potential health risks and develop personalized wellness plans that address all aspects of health—physical, mental, and social. She is particularly interested in the connections between lifestyle factors and chronic disease prevention, empowering clients to make informed choices that support long-term well-being.",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1398&auto=format&fit=crop",
    location: "Seattle, WA",
    availability: "Available Mon-Fri, 8AM-4PM",
    education: [
      "M.D. with specialization in Preventive Medicine, Johns Hopkins University",
      "M.P.H. in Health Promotion, Harvard University",
      "B.S. in Biology, University of Washington"
    ],
    languages: ["English", "Hindi", "Gujarati"],
    specializations: ["Preventive Health Screenings", "Lifestyle Medicine", "Stress Management", "Sleep Medicine", "Chronic Disease Prevention"],
    experience: "9 years",
    contactInfo: {
      email: "amara.patel@healthyme.com",
      phone: "(555) 567-8901"
    },
    isSpecialist: true
  },
  {
    id: "6",
    name: "Dr. Robert Taylor",
    title: "Stress Management Coach",
    specialty: "Mindfulness",
    rating: 4.8,
    description: "Certified mindfulness instructor and stress management expert helping clients develop practical techniques for reducing stress and improving mental wellbeing.",
    detailedBio: "Dr. Robert Taylor is a stress management specialist with certification in mindfulness-based stress reduction (MBSR) and cognitive approaches to wellness. After working in high-pressure corporate environments for over a decade, he transitioned to health coaching to help others manage workplace stress and prevent burnout. Dr. Taylor combines neuroscience-based approaches with practical mindfulness techniques to help clients recognize stress patterns and develop sustainable coping strategies. His coaching style emphasizes experiential learning and daily practice to create lasting behavioral change.",
    imageUrl: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=1374&auto=format&fit=crop",
    location: "Austin, TX",
    availability: "Available Tue-Sat, 9AM-6PM",
    education: [
      "Ph.D. in Health Psychology, University of Texas",
      "M.S. in Mind-Body Medicine, Saybrook University",
      "B.A. in Cognitive Science, Rice University",
      "Certified MBSR Instructor, University of Massachusetts Medical School"
    ],
    languages: ["English"],
    specializations: ["Stress Reduction", "Mindfulness Training", "Burnout Prevention", "Work-Life Balance", "Meditation Techniques"],
    experience: "11 years",
    contactInfo: {
      email: "robert.taylor@healthyme.com",
      phone: "(555) 678-9012"
    },
    isSpecialist: true
  }
];

const SpecialistProfile = () => {
  const { id } = useParams();
  const specialist = specialistsData.find(spec => spec.id === id);
  
  if (!specialist) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-20">
          <div className="max-w-5xl mx-auto text-center py-16">
            <h1 className="text-3xl font-bold mb-4">Specialist Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The specialist you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/specialists">Back to Specialists</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Generate initials from name for the avatar fallback
  const initials = specialist.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 pt-16 pb-16">
        <div className="max-w-5xl mx-auto">
          {/* Back button */}
          <Button variant="ghost" asChild className="mb-6 pl-0">
            <Link to="/specialists" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Specialists
            </Link>
          </Button>
          
          {/* Profile header */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
            <div className="bg-primary/5 p-8">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <Avatar className="h-32 w-32 border-4 border-white rounded-full">
                  <AvatarImage src={specialist.imageUrl} alt={specialist.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium text-4xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <h1 className="text-3xl font-bold">{specialist.name}</h1>
                    <div className="flex items-center justify-center md:justify-end gap-1">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium">{specialist.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-1 mb-3">
                    <p className="text-lg text-muted-foreground">{specialist.title}</p>
                    <Badge variant="secondary" className="mt-2">
                      {specialist.specialty}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground mt-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{specialist.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{specialist.availability}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span>{specialist.experience} experience</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="border-t border-gray-100 px-8 py-4 flex flex-wrap gap-3 justify-center md:justify-start">
              <Button className="flex-1 sm:flex-none gap-2 min-w-[150px]">
                <CalendarRange className="h-4 w-4" />
                Book Appointment
              </Button>
              <Button variant="outline" className="flex-1 sm:flex-none gap-2 min-w-[150px]">
                <MessageSquare className="h-4 w-4" />
                Send Message
              </Button>
              <Button variant="outline" className="flex-1 sm:flex-none gap-2 min-w-[150px]">
                <Phone className="h-4 w-4" />
                Call
              </Button>
              <Button variant="outline" className="flex-1 sm:flex-none gap-2 min-w-[150px]">
                <Mail className="h-4 w-4" />
                Email
              </Button>
            </div>
          </div>
          
          {/* Profile details */}
          <div className="mt-8 grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-semibold mb-4">About</h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {specialist.detailedBio}
                </p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">Education</h2>
                <ul className="space-y-2">
                  {specialist.education.map((edu, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="mt-1 min-w-4 h-4 bg-primary/20 rounded-full"></div>
                      <span>{edu}</span>
                    </li>
                  ))}
                </ul>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">Specializations</h2>
                <div className="flex flex-wrap gap-2">
                  {specialist.specializations.map((spec, index) => (
                    <Badge key={index} variant="outline" className="bg-primary/5">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p>{specialist.contactInfo.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p>{specialist.contactInfo.phone}</p>
                    </div>
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold mt-6 mb-4">Languages</h2>
                <div className="flex flex-wrap gap-2">
                  {specialist.languages.map((lang, index) => (
                    <Badge key={index} variant="secondary">
                      {lang}
                    </Badge>
                  ))}
                </div>
                
                <h2 className="text-xl font-semibold mt-6 mb-4">Availability</h2>
                <p className="text-muted-foreground">
                  {specialist.availability}
                </p>
                
                <Button className="w-full mt-6">
                  Book an Appointment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SpecialistProfile;
