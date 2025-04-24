import React, { useEffect, useRef } from "react";
import { Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PlanProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  index: number;
}

const PlanCard = ({
  title,
  price,
  description,
  features,
  popular,
  index,
}: PlanProps) => (
  <div
    className={cn(
      "rounded-2xl p-8 transition-all duration-500 reveal",
      popular
        ? "bg-primary text-white border-0 shadow-xl relative z-10 lg:scale-105"
        : "bg-card border border-border",
      index % 2 === 0 ? "lg:mt-8" : ""
    )}
  >
    {popular && (
      <div className="absolute -top-4 left-0 right-0 flex justify-center">
        <div className="px-4 py-1 bg-primary rounded-full text-xs font-semibold text-white shadow-lg">
          Most Popular
        </div>
      </div>
    )}

    <h3 className="text-xl font-semibold tracking-tight mb-2">{title}</h3>
    <div className="mb-4">
      <span className="text-4xl font-bold">{price}</span>
      <span className={popular ? "text-white/70" : "text-muted-foreground"}>
        /month
      </span>
    </div>
    <p
      className={cn(
        "mb-6 text-sm leading-relaxed",
        popular ? "text-white/80" : "text-muted-foreground"
      )}
    >
      {description}
    </p>

    <ul className="space-y-3 mb-8">
      {features.map((feature, idx) => (
        <li key={idx} className="flex items-start gap-2">
          <Check
            className={cn(
              "h-5 w-5 shrink-0 mt-0.5",
              popular ? "text-white/80" : "text-primary"
            )}
          />
          <span
            className={cn(
              "text-sm",
              popular ? "text-white/80" : "text-muted-foreground"
            )}
          >
            {feature}
          </span>
        </li>
      ))}
    </ul>

    <Button
      className={cn(
        "w-full button-glow",
        popular
          ? "bg-white text-primary hover:bg-white/90"
          : "bg-primary text-white hover:bg-primary/90"
      )}
    >
      Get Started <ChevronRight className="ml-1 h-4 w-4" />
    </Button>
  </div>
);

const plans = [
  {
    title: "Essential Care",
    price: "$89",
    description:
      "Basic health and wellness services for individuals seeking essential care and guidance.",
    features: [
      "Monthly virtual health consultations",
      "Basic physiotherapy assessment",
      "Nutrition guidance",
      "Access to wellness resources",
      "Email support",
    ],
    popular: false,
  },
  {
    title: "Comprehensive Wellness",
    price: "$149",
    description:
      "Full-service health and wellness package with personalized care and regular check-ins.",
    features: [
      "Bi-weekly virtual or in-home visits",
      "Complete physiotherapy services",
      "Personalized nutrition planning",
      "Fitness training sessions",
      "Health check-ups and monitoring",
      "Priority scheduling and support",
    ],
    popular: true,
  },
  {
    title: "Premium Health",
    price: "$249",
    description:
      "VIP health experience with comprehensive services and dedicated personal care team.",
    features: [
      "Weekly virtual or in-home visits",
      "Advanced physiotherapy treatments",
      "Custom nutrition and meal planning",
      "Personal training and fitness program",
      "Regular health check-ups",
      "Dedicated care coordinator",
      "24/7 access to health professionals",
    ],
    popular: false,
  },
];

const Membership = () => {
  const membershipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll(".reveal");
            elements.forEach((el, index) => {
              setTimeout(() => {
                el.classList.add("revealed");
              }, index * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (membershipRef.current) {
      observer.observe(membershipRef.current);
    }

    return () => {
      if (membershipRef.current) {
        observer.unobserve(membershipRef.current);
      }
    };
  }, []);

  return (
    <section
      id="membership"
      ref={membershipRef}
      className="relative section-padding bg-muted/30"
    >
      <div className="section-container">
        <div className="text-center mb-16 reveal">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Service Packages
          </h2>
          <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
            Choose the perfect health and wellness package that aligns with your personal needs and goals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PlanCard key={index} {...plan} index={index} />
          ))}
        </div>

        <div className="mt-16 text-center max-w-2xl mx-auto reveal">
          <p className="text-sm text-muted-foreground">
            All plans include access to our mobile app and online resources. Individual services can also be booked separately.
            Custom packages are available for families and organizations. Contact us for more information about special requirements or specific health needs.
          </p>
        </div>
      </div>

      {/* Background elements */}
      <div className="absolute top-1/3 -right-64 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/3 -left-64 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
    </section>
  );
};

export default Membership;