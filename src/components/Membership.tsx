
import React, { useRef, useEffect } from "react";
import { Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PricingTierProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  index: number;
}

const PricingTier = ({ title, price, description, features, popular, index }: PricingTierProps) => (
  <div 
    className={cn(
      "glass-card rounded-2xl p-8 flex flex-col h-full reveal",
      popular ? "border-primary/50 shadow-lg scale-105 z-10" : "border-transparent hover:shadow-lg",
      "transition-all duration-500 hover:border-primary/20"
    )}
    style={{ transitionDelay: `${index * 200}ms` }}
  >
    {popular && (
      <div className="px-3 py-1 text-xs font-semibold text-primary bg-primary/10 rounded-full w-fit mb-4 animate-pulse-slow">
        Most Popular
      </div>
    )}
    
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <div className="mb-4">
      <span className="text-3xl font-bold">{price}</span>
      <span className="text-muted-foreground">/month</span>
    </div>
    
    <p className="text-muted-foreground mb-6">{description}</p>
    
    <ul className="space-y-3 mb-8 flex-grow">
      {features.map((feature, i) => (
        <li 
          key={i} 
          className="flex items-start"
          style={{ transitionDelay: `${i * 100 + 200}ms`, opacity: 0 }}
          className="flex items-start opacity-0 transition-opacity duration-500"
        >
          <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    
    <Button 
      variant={popular ? "default" : "outline"} 
      className={cn(
        "w-full transition-all duration-300", 
        popular ? "button-glow" : "hover-lift"
      )}
    >
      Choose Plan
      <ChevronRight className="ml-1 h-4 w-4" />
    </Button>
  </div>
);

const Membership = () => {
  const membershipRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll(".reveal");
            elements.forEach((el, index) => {
              setTimeout(() => {
                el.classList.add("revealed");
                
                // Animate list items within each pricing tier
                const listItems = el.querySelectorAll("li");
                listItems.forEach((item, i) => {
                  setTimeout(() => {
                    item.classList.add("opacity-100");
                  }, i * 100);
                });
              }, index * 150);
            });
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
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

  const pricingTiers = [
    {
      title: "Basic",
      price: "$49",
      description: "Essential health services for individuals seeking basic care.",
      features: [
        "Physiotherapy (2 sessions/month)",
        "Fitness Training (1 session/month)",
        "Nutrition Consultation (1 session/month)",
        "Health Check-up (Quarterly)",
        "Mobile App Access"
      ]
    },
    {
      title: "Premium",
      price: "$99",
      description: "Comprehensive health coverage for regular wellness needs.",
      features: [
        "Physiotherapy (4 sessions/month)",
        "Fitness Training (4 sessions/month)",
        "Nutrition Consultation (2 sessions/month)",
        "Massage Therapy (2 sessions/month)",
        "Health Check-up (Monthly)",
        "Priority Scheduling",
        "24/7 Telehealth Support"
      ],
      popular: true
    },
    {
      title: "Family",
      price: "$179",
      description: "Complete health coverage for families up to 4 members.",
      features: [
        "Everything in Premium",
        "Coverage for 4 Family Members",
        "Pediatric Care",
        "Elder Care Support",
        "Family Health Assessments",
        "Dedicated Family Health Coordinator",
        "Household Safety Assessment"
      ]
    }
  ];

  return (
    <section 
      id="membership" 
      ref={membershipRef}
      className="section-padding bg-gradient-to-b from-white to-secondary/20 relative overflow-hidden"
    >
      <div className="section-container relative z-10">
        <div className="text-center mb-16 reveal">
          <div className="inline-block mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4">
              <Check className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Membership Plans
          </h2>
          <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
            Choose the perfect health plan to match your wellness goals and budget.
            Subscribe monthly or annually with a 20% discount.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <PricingTier key={index} {...tier} index={index} />
          ))}
        </div>
        
        <div className="mt-16 text-center max-w-xl mx-auto reveal">
          <h3 className="text-xl font-semibold mb-4">Need a Custom Plan?</h3>
          <p className="text-muted-foreground mb-6">
            We understand that everyone's health needs are unique. Contact us to create a
            personalized health plan tailored specifically for you.
          </p>
          <Button variant="outline" className="hover-lift">
            Contact for Custom Plan
          </Button>
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute top-1/3 -right-48 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/3 -left-48 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Membership;
