import React, { useEffect, useRef } from "react";
import {
  HeartPulse,
  Utensils,
  Feather,
  Dumbbell,
  UserRound,
  ClipboardCheck,
  Stethoscope,
  Microscope,
  FileSpreadsheet
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureCard = ({ icon, title, description, index }: FeatureCardProps) => (
  <div
    className={cn(
      "glass-card p-6 rounded-2xl hover-lift",
      "flex flex-col items-start gap-4",
      index % 2 === 0 ? "lg:translate-y-8" : "",
      index % 3 === 0 ? "reveal" : index % 3 === 1 ? "reveal-left" : "reveal-right"
    )}
    style={{ transitionDelay: `${index * 100}ms` }}
  >
    <div className="p-3 rounded-xl bg-primary/5 text-primary transition-all duration-300 group-hover:bg-primary/10">
      {icon}
    </div>
    <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

const features = [
  {
    icon: <HeartPulse className="h-6 w-6" />,
    title: "Physiotherapy",
    description:
      "Professional physiotherapy for injury recovery, chronic pain management, and mobility restoration, available virtually or at your home.",
  },
  {
    icon: <Utensils className="h-6 w-6" />,
    title: "Nutrition & Diet",
    description:
      "Personalized nutrition plans and consultations to help you achieve your health goals with balanced, effective dietary guidance.",
  },
  {
    icon: <Feather className="h-6 w-6" />,
    title: "Massage Therapy",
    description:
      "Therapeutic massage services for relaxation, pain relief, and recovery, delivered by certified professionals in your home.",
  },
  {
    icon: <Dumbbell className="h-6 w-6" />,
    title: "Fitness Training",
    description:
      "Customized workout plans with qualified trainers, available through virtual sessions or in-person visits to meet your fitness goals.",
  },
  {
    icon: <UserRound className="h-6 w-6" />,
    title: "Caregiving Services",
    description:
      "Compassionate caregiving assistance for daily activities, post-surgical recovery, and specialized support for various needs.",
  },
  {
    icon: <ClipboardCheck className="h-6 w-6" />,
    title: "Wellness Programs",
    description:
      "Comprehensive wellness consultations and programs tailored to your specific health concerns and lifestyle goals.",
  },
  {
    icon: <Stethoscope className="h-6 w-6" />,
    title: "Doctor Reviews",
    description:
      "Virtual consultations with qualified doctors who provide expert advice, prescriptions, and personalized medical recommendations.",
  },
  {
    icon: <Microscope className="h-6 w-6" />,
    title: "Health Check-ups",
    description:
      "Comprehensive health screenings delivered to your doorstep, designed to monitor your overall health and detect potential issues early.",
  },
  {
    icon: <FileSpreadsheet className="h-6 w-6" />,
    title: "Test Programs",
    description:
      "Convenient diagnostic testing including at-home kits and partnerships with certified labs for accurate health assessments.",
  },
];

const Features = () => {
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll(".reveal, .reveal-left, .reveal-right");
            elements.forEach((el, index) => {
              setTimeout(() => {
                el.classList.add("revealed");
              }, index * 100);
            });
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => {
      if (featuresRef.current) {
        observer.unobserve(featuresRef.current);
      }
    };
  }, []);

  return (
    <section
      id="features"
      ref={featuresRef}
      className="relative section-padding overflow-hidden"
    >
      <div className="section-container">
        <div className="text-center mb-16 reveal">
          <div className="inline-block mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4">
              <HeartPulse className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Our Services
          </h2>
          <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
            Discover our comprehensive range of health and wellness services, all designed 
            to be accessible, convenient, and tailored to your unique needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>

        {/* Background elements */}
        <div className="absolute top-1/4 -left-64 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse-slow" />
      </div>
    </section>
  );
};

export default Features;
