
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Membership from "@/components/Membership";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  // Initialize intersection observer for animation
  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
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
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
    });

    document.querySelectorAll("section").forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      
       {/* Client Dashboard Access Button */}
       <div className="container mx-auto py-10 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Access Your Health Dashboard</h2>
        <p className="mb-6 text-muted-foreground max-w-2xl mx-auto">
          Track your health journey, manage appointments, and connect with specialists through our personalized dashboard.
        </p>
        <Button asChild size="lg" className="group">
          <Link to="/client-dashboard">
            Go to Client Dashboard <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>

      <Features />
      <Membership />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
