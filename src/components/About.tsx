import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const About = () => {
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll(".reveal, .reveal-left, .reveal-right");
            elements.forEach((el, index) => {
              setTimeout(() => {
                el.classList.add("revealed");
              }, index * 150);
            });
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => {
      if (aboutRef.current) {
        observer.unobserve(aboutRef.current);
      }
    };
  }, []);

  return (
    <section
      id="about"
      ref={aboutRef}
      className="relative section-padding overflow-hidden"
    >
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 reveal-left">
            <span className="inline-block py-1 px-3 rounded-full bg-primary/5 text-sm font-medium text-primary mb-6">
              Our Story
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Redefining Fitness Excellence
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="transition-all duration-500 delay-200">
                Founded in 2010, EliteFit was born from a vision to transform
                the conventional gym experience into something extraordinary.
                What began as a small studio has evolved into a premier fitness
                destination committed to helping individuals achieve their
                optimal physical potential.
              </p>
              <p className="transition-all duration-500 delay-300">
                Our philosophy centers on the belief that true fitness
                encompasses both physical strength and mental wellness. We've
                meticulously crafted an environment where innovation meets
                tradition, where cutting-edge equipment complements timeless
                training principles.
              </p>
              <p className="transition-all duration-500 delay-400">
                At EliteFit, we take pride in our community of dedicated members
                and expert trainers who collectively create an atmosphere of
                motivation, support, and achievement. Our success is measured by
                the transformations we facilitate and the lasting relationships
                we build.
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative reveal-right">
            <div
              className={cn(
                "w-full overflow-hidden rounded-2xl",
                "before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/40 before:to-transparent before:z-10"
              )}
            >
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2670&auto=format&fit=crop"
                alt="Modern gym interior"
                className="w-full h-[500px] object-cover object-center transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 -z-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
          </div>
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 reveal" style={{ transitionDelay: "100ms" }}>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2 animate-float" style={{ animationDelay: "0s" }}>
              10+
            </div>
            <p className="text-muted-foreground">Years of Excellence</p>
          </div>
          <div className="p-6 reveal" style={{ transitionDelay: "300ms" }}>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2 animate-float" style={{ animationDelay: "0.3s" }}>
              20+
            </div>
            <p className="text-muted-foreground">Expert Trainers</p>
          </div>
          <div className="p-6 reveal" style={{ transitionDelay: "500ms" }}>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2 animate-float" style={{ animationDelay: "0.6s" }}>
              5000+
            </div>
            <p className="text-muted-foreground">Success Stories</p>
          </div>
        </div>
      </div>

      {/* Background elements */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-gradient-to-br from-primary/5 to-secondary/20 rounded-full blur-3xl -z-10 animate-pulse-slow" />
    </section>
  );
};

export default About;