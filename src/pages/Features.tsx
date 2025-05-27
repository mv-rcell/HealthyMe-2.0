import React, { useEffect } from "react";
import  Navbar  from "@/components/Navbar";

import { Link } from "react-router-dom";
import { SmartphoneNfc, Video, Search, HeartHandshake, Gauge, Home, Medal, ThumbsUp, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
  linkTo: string;
}

const FeatureCard = ({ icon, title, description, index, linkTo }: FeatureCardProps) => (
  <Link
    to={linkTo}
    className={cn(
      "glass-card p-6 rounded-2xl hover-lift transition-all duration-300",
      "flex flex-col items-start gap-4",
      index % 2 === 0 ? "lg:translate-y-8" : "",
      index % 3 === 0 ? "reveal" : index % 3 === 1 ? "reveal-left" : "reveal-right"
    )}
    style={{ transitionDelay: `${index * 100}ms` }}
    role="link"
    aria-label={title}
  >
    <div className="p-3 rounded-xl bg-primary/5 text-primary" aria-hidden="true">
      {icon}
    </div>
    <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </Link>
);

const features = [
  {
    icon: <SmartphoneNfc className="h-6 w-6" />,
    title: "Smart Booking",
    description: "Instantly match with specialists based on location and availability. Real-time confirmations and reminders keep you on track.",
    linkTo: "/features/smart-booking"
  },
  {
    icon: <Video className="h-6 w-6" />,
    title: "Virtual Consultations",
    description: "Secure video and in-app messaging to consult your provider from anywhere, with prescription sharing and treatment plans.",
    linkTo: "/features/virtual-consultation"
  },
  {
    icon: <Search className="h-6 w-6" />,
    title: "Specialist Discovery",
    description: "Search by service, filter by location or ratings, and view detailed profiles to find the right fit for your needs.",
    linkTo: "/features/specialist-discovery"
  },
  {
    icon: <HeartHandshake className="h-6 w-6" />,
    title: "Subscription Wellness Plans",
    description: "Access bundled health services like physiotherapy, nutrition, and mental care — with reports and progress tracking.",
    linkTo: "/features/wellness-plans"
  },
  {
    icon: <Gauge className="h-6 w-6" />,
    title: "Health Dashboard",
    description: "Sync data from your wearables to view trends in sleep, steps, and mood — plus personalized alerts and insights.",
    linkTo: "/features/health-dashboard"
  },
  {
    icon: <Home className="h-6 w-6" />,
    title: "Home & On-Demand Care",
    description: "Request therapists or caregivers to your doorstep and track their ETA — ideal for post-op recovery or elder care.",
    linkTo: "/features/home-care"
  },
  {
    icon: <Medal className="h-6 w-6" />,
    title: "Wellness Challenges",
    description: "Join 21-day programs for detox, stress relief, or movement — complete goals and compete on leaderboards.",
    linkTo: "/features/wellness-challenges"
  },
  {
    icon: <ThumbsUp className="h-6 w-6" />,
    title: "Specialist Reviews",
    description: "Explore verified feedback from real users to help choose the right professionals based on real experiences.",
    linkTo: "/features/doctor-reviews"
  },
  {
    icon: <FlaskConical className="h-6 w-6" />,
    title: "Health Tests & Checkups",
    description: "Book lab tests and screening services with digital results and automated follow-up scheduling.",
    linkTo: "/features/health-checkups"
  }
];

const Features = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            obs.unobserve(entry.target); // stop observing once revealed
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    const elements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="relative section-padding overflow-hidden">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-16 reveal">
          <div className="inline-block mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4" aria-hidden="true">
              <SmartphoneNfc className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Smart Health, Seamless Care
          </h2>
          <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
            Explore how HealthyMe empowers you with smart tools, real-time services, and personalized wellness — all in one app.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>

        {/* Background Glow Effects */}
        <div className="absolute top-1/4 -left-64 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse-slow" />
      </div>
    </section>
  );
};

export default Features;
