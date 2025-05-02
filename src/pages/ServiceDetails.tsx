import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProfileCard from "@/components/ProfileCard";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ArrowLeft, Calendar, MessageSquare, Check } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { motion } from "framer-motion";

// Service details data structure
interface ServiceSpecialist {
  id: string;
  name: string;
  title: string;
  specialty: string;
  rating: number;
  description: string;
  imageUrl: string;
  availability: string;
}

interface ServiceDetail {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  longDescription: string;
  imageUrl: string;
  benefits: string[];
  specialists: ServiceSpecialist[];
  faqs: { question: string; answer: string }[];
}

// Define service details
const serviceDetails: { [key: string]: ServiceDetail } = {
  "physical-therapy": {
    id: "physical-therapy",
    title: "Physical Therapy",
    icon: <span className="icon">🤸</span>,
    description: "Professional therapy for injury recovery, chronic pain management, and mobility restoration.",
    longDescription: "Our physical therapy services are designed to help you recover from injuries, manage chronic pain, and improve your mobility. Our certified physical therapists work with you to create a personalized treatment plan that addresses your specific needs and goals. Through a combination of exercises, manual therapy, and education, we help you regain function and prevent future injuries.",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1470&auto=format&fit=crop",
    benefits: [
      "Personalized treatment plans tailored to your specific needs",
      "Reduced pain and improved mobility",
      "Enhanced strength and flexibility",
      "Prevention of future injuries",
      "Avoidance of surgery in many cases"
    ],
    specialists: [
      {
        id: "pt1",
        name: "Dr. Sarah Johnson",
        title: "Physical Therapist",
        specialty: "Sports Injuries",
        rating: 4.9,
        description: "Dr. Johnson specializes in sports injury rehabilitation with over 10 years of experience working with professional athletes.",
        imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1170&auto=format&fit=crop",
        availability: "Mon, Wed, Fri: 9AM - 5PM"
      },
      {
        id: "pt2",
        name: "Dr. Michael Chen",
        title: "Physical Therapist",
        specialty: "Neuromuscular Rehabilitation",
        rating: 4.8,
        description: "Dr. Chen focuses on neurological conditions and stroke recovery, helping patients regain motor function and independence.",
        imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1064&auto=format&fit=crop",
        availability: "Tue, Thu: 8AM - 6PM"
      }
    ],
    faqs: [
      {
        question: "How long does a physical therapy session last?",
        answer: "Most physical therapy sessions last between 45-60 minutes, depending on your specific treatment plan and needs."
      },
      {
        question: "How many sessions will I need?",
        answer: "The number of sessions varies based on your condition, but most treatment plans range from 6-12 sessions. Your therapist will provide a more accurate estimate after your initial evaluation."
      }
    ]
  },
  "mental-health-therapy": {
    id: "mental-health-therapy",
    title: "Mental Health Therapy",
    icon: <span className="icon">🧠</span>,
    description: "Professional mental health services including therapy, counseling and support for various mental health conditions.",
    longDescription: "Our mental health therapy services provide compassionate care for a range of psychological needs. Our licensed therapists and counselors use evidence-based approaches to help you manage anxiety, depression, stress, and other mental health challenges. We create a safe, supportive environment where you can explore your thoughts and feelings and develop effective coping strategies.",
    imageUrl: "https://images.unsplash.com/photo-1573497019418-b400bb3ab074?q=80&w=1470&auto=format&fit=crop",
    benefits: [
      "Personalized therapy tailored to your unique needs",
      "Evidence-based treatment approaches",
      "Improved coping strategies for managing stress and emotions",
      "Enhanced self-awareness and personal growth",
      "Better relationships and communication skills"
    ],
    specialists: [
      {
        id: "mh1",
        name: "Dr. Emily Rodriguez",
        title: "Clinical Psychologist",
        specialty: "Anxiety & Depression",
        rating: 4.9,
        description: "Dr. Rodriguez specializes in cognitive-behavioral therapy for anxiety and depression, with expertise in trauma-informed care.",
        imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1288&auto=format&fit=crop",
        availability: "Mon-Thu: 10AM - 7PM"
      },
      {
        id: "mh2",
        name: "Dr. James Wilson",
        title: "Licensed Therapist",
        specialty: "Family Therapy",
        rating: 4.7,
        description: "Dr. Wilson focuses on family dynamics and relationships, helping families improve communication and resolve conflicts.",
        imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1287&auto=format&fit=crop",
        availability: "Tue, Wed, Fri: 9AM - 6PM"
      }
    ],
    faqs: [
      {
        question: "Is therapy confidential?",
        answer: "Yes, all therapy sessions are confidential. Therapists are bound by professional ethics and legal standards to maintain your privacy, with few exceptions related to safety concerns."
      },
      {
        question: "How often will I need to attend therapy?",
        answer: "Most clients attend weekly sessions, especially at the beginning of treatment. As you progress, sessions may become less frequent. Your therapist will work with you to determine the best schedule."
      }
    ]
  },
  "nutrition-diet": {
    id: "nutrition-diet",
    title: "Nutrition & Diet",
    icon: <span className="icon">🥗</span>,
    description: "Personalized nutrition plans and consultations to help you achieve your health goals with balanced, effective dietary guidance.",
    longDescription: "Our nutrition and diet services provide expert guidance for improving your overall health through proper nutrition. Our registered dietitians create personalized meal plans based on your health goals, preferences, and any dietary restrictions. Whether you're looking to manage your weight, improve athletic performance, or address specific health concerns, we offer evidence-based nutrition advice tailored to your needs.",
    imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1470&auto=format&fit=crop",
    benefits: [
      "Personalized nutrition plans tailored to your goals and preferences",
      "Expert guidance from registered dietitians",
      "Improved energy levels and overall wellness",
      "Management of health conditions through diet",
      "Sustainable eating habits for long-term health"
    ],
    specialists: [
      {
        id: "nd1",
        name: "Maria Thompson",
        title: "Registered Dietitian",
        specialty: "Weight Management",
        rating: 4.8,
        description: "Maria helps clients develop sustainable eating habits for weight management and overall wellness, specializing in intuitive eating approaches.",
        imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=1287&auto=format&fit=crop",
        availability: "Mon, Wed, Fri: 8AM - 4PM"
      },
      {
        id: "nd2",
        name: "Robert Kim",
        title: "Sports Nutritionist",
        specialty: "Athletic Performance",
        rating: 4.9,
        description: "Robert works with athletes at all levels to optimize nutrition for performance, recovery, and overall health through science-based approaches.",
        imageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=1170&auto=format&fit=crop",
        availability: "Tue, Thu, Sat: 9AM - 5PM"
      }
    ],
    faqs: [
      {
        question: "How long does it take to see results from changing my diet?",
        answer: "Many people notice improvements in energy and mood within 1-2 weeks of making dietary changes. Physical changes typically become noticeable after 3-4 weeks of consistent healthy eating."
      },
      {
        question: "Do I need to completely change how I eat?",
        answer: "Not necessarily. Our approach focuses on sustainable changes that work with your lifestyle. We often start with small adjustments and gradually build on them for lasting results."
      }
    ]
  },
  "preventive-care": {
    id: "preventive-care",
    title: "Preventive Care",
    icon: <span className="icon">🛡️</span>,
    description: "Comprehensive preventive health strategies, screenings, and lifestyle modifications to maintain wellness and prevent future conditions.",
    longDescription: "Our preventive care services focus on proactive health measures to help you avoid illness and maintain optimal health. Through regular screenings, health assessments, and lifestyle guidance, we identify potential health risks early and develop strategies to address them before they become serious problems. Our preventive approach emphasizes the importance of nutrition, physical activity, stress management, and other key factors that contribute to long-term health.",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1470&auto=format&fit=crop",
    benefits: [
      "Early detection of potential health issues",
      "Reduced risk of chronic diseases",
      "Comprehensive health assessments",
      "Personalized preventive strategies",
      "Long-term health maintenance"
    ],
    specialists: [
      {
        id: "pc1",
        name: "Dr. Olivia Parker",
        title: "Preventive Medicine Specialist",
        specialty: "Health Maintenance",
        rating: 4.7,
        description: "Dr. Parker specializes in developing comprehensive preventive care plans focused on early detection and risk reduction for chronic diseases.",
        imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1170&auto=format&fit=crop",
        availability: "Mon-Thu: 9AM - 5PM"
      },
      {
        id: "pc2",
        name: "Dr. Thomas Lee",
        title: "Lifestyle Medicine Physician",
        specialty: "Disease Prevention",
        rating: 4.8,
        description: "Dr. Lee focuses on lifestyle modifications for disease prevention, specializing in nutrition, physical activity, and stress management approaches.",
        imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1064&auto=format&fit=crop",
        availability: "Wed-Fri: 10AM - 6PM"
      }
    ],
    faqs: [
      {
        question: "How often should I get preventive health screenings?",
        answer: "Screening frequency depends on your age, gender, family history, and risk factors. Generally, adults should have a comprehensive health assessment every 1-3 years."
      },
      {
        question: "Are preventive care services covered by insurance?",
        answer: "Many preventive services are covered by insurance plans with no copay. We can help you determine which services are covered under your specific plan."
      }
    ]
  },
  "wellness-programs": {
    id: "wellness-programs",
    title: "Wellness Programs",
    icon: <span className="icon">✨</span>,
    description: "Comprehensive wellness consultations and programs tailored to your specific health concerns and lifestyle goals.",
    longDescription: "Our wellness programs take a holistic approach to health and wellbeing, addressing physical, mental, and emotional aspects of health. Our qualified wellness coaches work with you to identify areas for improvement and develop personalized strategies for achieving optimal wellness. Whether you're looking to reduce stress, improve sleep, increase energy, or enhance your overall quality of life, our programs provide the guidance and support you need to reach your goals.",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1520&auto=format&fit=crop",
    benefits: [
      "Holistic approach to health and wellbeing",
      "Personalized wellness strategies",
      "Improved work-life balance",
      "Stress reduction and better sleep",
      "Enhanced overall quality of life"
    ],
    specialists: [
      {
        id: "wp1",
        name: "Jennifer Martin",
        title: "Wellness Coach",
        specialty: "Stress Management",
        rating: 4.9,
        description: "Jennifer helps clients develop effective stress management techniques and create balanced lifestyles that promote overall wellbeing.",
        imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1288&auto=format&fit=crop",
        availability: "Mon, Wed, Fri: 10AM - 6PM"
      },
      {
        id: "wp2",
        name: "David Thompson",
        title: "Holistic Health Practitioner",
        specialty: "Sleep Optimization",
        rating: 4.8,
        description: "David specializes in improving sleep quality through natural approaches, helping clients develop healthy sleep habits for better overall health.",
        imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1287&auto=format&fit=crop",
        availability: "Tue, Thu: 9AM - 7PM"
      }
    ],
    faqs: [
      {
        question: "What does a wellness program typically include?",
        answer: "Our wellness programs typically include an initial assessment, personalized wellness plan, regular coaching sessions, progress tracking, and ongoing support. Programs are customized based on your specific goals and needs."
      },
      {
        question: "How long do wellness programs last?",
        answer: "Program length varies based on your goals, but most clients participate for 3-6 months to establish new habits and see meaningful results. Some choose to continue with maintenance sessions after completing the initial program."
      }
    ]
  },
  "doctor-reviews": {
    id: "doctor-reviews",
    title: "Doctor Reviews",
    icon: <span className="icon">👨‍⚕️</span>,
    description: "Virtual consultations with qualified doctors who provide expert advice, prescriptions, and personalized medical recommendations.",
    longDescription: "Our doctor review service connects you with board-certified physicians for virtual consultations from the comfort of your home. Whether you need advice on managing a chronic condition, a second opinion on a diagnosis, or help interpreting test results, our experienced doctors provide personalized guidance and recommendations. This service offers a convenient way to access medical expertise without the need for in-person visits.",
    imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1170&auto=format&fit=crop",
    benefits: [
      "Convenient access to medical expertise from home",
      "Personalized medical advice and recommendations",
      "Second opinions on diagnoses and treatment plans",
      "Reduced time and travel costs compared to in-person visits",
      "Secure, confidential consultations"
    ],
    specialists: [
      {
        id: "dr1",
        name: "Dr. Rebecca Taylor",
        title: "Family Physician",
        specialty: "General Medicine",
        rating: 4.9,
        description: "Dr. Taylor provides comprehensive primary care for patients of all ages, with expertise in preventive care and chronic disease management.",
        imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1170&auto=format&fit=crop",
        availability: "Mon-Thu: 9AM - 5PM"
      },
      {
        id: "dr2",
        name: "Dr. Andrew Miller",
        title: "Internal Medicine Specialist",
        specialty: "Chronic Disease Management",
        rating: 4.8,
        description: "Dr. Miller specializes in adult medicine with a focus on managing complex chronic conditions and coordinating comprehensive care plans.",
        imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1064&auto=format&fit=crop",
        availability: "Tue, Wed, Fri: 10AM - 6PM"
      }
    ],
    faqs: [
      {
        question: "Can doctors prescribe medication during virtual consultations?",
        answer: "Yes, doctors can prescribe many medications during virtual consultations. However, there are some restrictions on controlled substances, which may require in-person visits depending on state regulations."
      },
      {
        question: "How long do virtual doctor consultations typically last?",
        answer: "Most consultations last 15-30 minutes, though they may be longer for complex medical issues or initial visits. Your doctor will spend the time needed to address your concerns thoroughly."
      }
    ]
  },
  "caregiving-services": {
    id: "caregiving-services",
    title: "Caregiving Services",
    icon: <span className="icon">🤲</span>,
    description: "Compassionate caregiving assistance for daily activities, post-surgical recovery, and specialized support for various needs.",
    longDescription: "Our caregiving services provide compassionate support for individuals who need assistance with daily activities or specialized care. Our trained caregivers offer personalized care that promotes independence, safety, and quality of life. Whether you need help after surgery, assistance with daily tasks, or specialized support for conditions like dementia, our caregiving team is dedicated to meeting your unique needs with dignity and respect.",
    imageUrl: "https://images.unsplash.com/photo-1576765975429-d2d5d6a579d4?q=80&w=1287&auto=format&fit=crop",
    benefits: [
      "Personalized care plans tailored to individual needs",
      "Assistance with daily activities and personal care",
      "Companionship and emotional support",
      "Respite for family caregivers",
      "Enhanced safety and quality of life"
    ],
    specialists: [
      {
        id: "cg1",
        name: "Lisa Johnson",
        title: "Senior Care Specialist",
        specialty: "Elderly Care",
        rating: 4.9,
        description: "Lisa specializes in providing compassionate care for seniors, helping them maintain independence while ensuring safety and well-being.",
        imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=1287&auto=format&fit=crop",
        availability: "Mon-Fri: 8AM - 6PM"
      },
      {
        id: "cg2",
        name: "Marcus Williams",
        title: "Rehabilitation Caregiver",
        specialty: "Post-Surgical Care",
        rating: 4.8,
        description: "Marcus focuses on supporting patients during recovery from surgery or hospitalization, providing both physical assistance and emotional support.",
        imageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=1170&auto=format&fit=crop",
        availability: "Tue-Sat: 9AM - 7PM"
      }
    ],
    faqs: [
      {
        question: "What services do caregivers provide?",
        answer: "Caregivers can provide assistance with personal care (bathing, dressing), meal preparation, medication reminders, light housekeeping, transportation, companionship, and specialized care for conditions like dementia or post-surgical recovery."
      },
      {
        question: "How are caregivers selected and trained?",
        answer: "All of our caregivers undergo thorough background checks, reference verification, and extensive training. We match caregivers to clients based on needs, personalities, and preferences to ensure a good fit."
      }
    ]
  }
};

const ServiceDetails: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const service = serviceId ? serviceDetails[serviceId] : null;

  useEffect(() => {
    if (!service) {
      navigate('/');
    }
    
    window.scrollTo(0, 0);
  }, [service, navigate]);

  if (!service) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            className="mb-6 flex items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col lg:flex-row gap-8 mb-12"
          >
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">{service.title}</h1>
              <p className="text-muted-foreground text-lg mb-6">
                {service.longDescription}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule Consultation
                </Button>
                <Button variant="outline" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Ask a Question
                </Button>
              </div>
            </div>
            <div className="lg:w-2/5">
              <AspectRatio ratio={16/9} className="bg-muted rounded-2xl overflow-hidden">
                <img 
                  src={service.imageUrl} 
                  alt={service.title}
                  className="object-cover w-full h-full" 
                />
              </AspectRatio>
            </div>
          </motion.div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-semibold mb-6">Benefits</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {service.benefits.map((benefit, i) => (
                <Card key={i} className="bg-primary/5 border-primary/10">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 bg-primary/10 rounded-full p-1">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <p>{benefit}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Specialists Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-semibold mb-6">Our Specialists</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {service.specialists.map((specialist, i) => (
                <motion.div
                  key={specialist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (i * 0.2), duration: 0.5 }}
                >
                  <ProfileCard
                    id={specialist.id}
                    name={specialist.name}
                    title={specialist.title}
                    specialty={specialist.specialty}
                    rating={specialist.rating}
                    description={specialist.description}
                    imageUrl={specialist.imageUrl}
                    availability={specialist.availability}
                    isSpecialist={true}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* FAQs Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {service.faqs.map((faq, i) => (
                <Collapsible key={i} className="bg-card border rounded-lg">
                  <CollapsibleTrigger className="flex justify-between w-full p-4 text-left font-medium">
                    {faq.question}
                    <span>+</span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 pt-0 text-muted-foreground">
                    {faq.answer}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </motion.div>
          
          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="bg-primary/5 rounded-2xl p-8 text-center"
          >
            <h3 className="text-2xl font-semibold mb-4">Ready to get started?</h3>
            <p className="max-w-2xl mx-auto mb-6 text-muted-foreground">
              Schedule a consultation with one of our specialists today and take the first step toward better health and wellness.
            </p>
            <Button size="lg">Book an Appointment</Button>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ServiceDetails;
