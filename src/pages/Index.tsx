
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Membership from "@/components/Membership";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

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
      <Features />
      <Membership />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
