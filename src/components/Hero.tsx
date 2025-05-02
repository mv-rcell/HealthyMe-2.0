import React, { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const elements = entry.target.querySelectorAll(".animate-in");
          if (entry.isIntersecting) {
            elements.forEach((el) => {
              (el as HTMLElement).style.animationPlayState = "running";
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  return (
    <div
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden py-20"
    >
      {/* Background with overlay gradient */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-black/0 to-black/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
        <div
          className="absolute inset-0 bg-cover bg-center transform transition-all duration-10000 hover:scale-110"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2670&auto=format&fit=crop')",
            opacity: 0.15,
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
        <span className="inline-block py-1 px-3 rounded-full bg-primary/5 text-sm font-medium text-primary mb-6 animate-in animate-float-1">
          Your Complete Health Journey Starts Here
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-in animate-float-2 leading-tight">
          <span className="relative">
           Healthy Living,
            <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></span>
          </span>
          <br />
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Anytime, Anywhere</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-in animate-float-3 leading-relaxed">
          Experience comprehensive health services for both body and mind delivered directly to you. 
          From physical therapy to  preventive care to wellness coaching - we bring the experts to you.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in animate-float-3">
          <Button
            size="lg"
            className="w-full sm:w-auto button-glow text-white bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105"
            asChild
          >
            <a href="#features">Explore Services</a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto hover-lift"
          >
            Book Consultation
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce">
        <a href="#features" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300" aria-label="Scroll to features">
          <ArrowDown className="h-6 w-6 text-primary" />
        </a>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
      
      {/* Floating elements */}
      <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-primary/10 rounded-full animate-float" style={{ animationDelay: "0s" }} />
      <div className="absolute bottom-1/3 left-1/4 w-8 h-8 bg-primary/20 rounded-full animate-float" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/5 w-12 h-12 bg-primary/15 rounded-full animate-float" style={{ animationDelay: "2s" }} />
    </div>
  );
};

export default Hero;
