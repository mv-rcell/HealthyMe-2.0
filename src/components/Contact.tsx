import React, { useState, useRef, useEffect } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const contactRef = useRef<HTMLElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Send data to backend API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      // Reset form and show success message
      setFormData({ name: "", email: "", message: "" });
      toast.success("Message sent!", {
        description: "We'll get back to you as soon as possible."
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message", {
        description: error instanceof Error ? error.message : "Please try again later"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

    if (contactRef.current) {
      observer.observe(contactRef.current);
    }

    return () => {
      if (contactRef.current) {
        observer.unobserve(contactRef.current);
      }
    };
  }, []);

  return (
    <section id="contact" ref={contactRef} className="section-padding bg-secondary/30 relative">
      <div className="section-container">
        <div className="text-center mb-16 reveal">
          <div className="inline-block mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Get In Touch
          </h2>
          <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
            Have questions or ready to start your health journey? Reach out to us.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="glass-card p-8 rounded-2xl reveal-left hover-lift">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="transition-all duration-300 hover:translate-x-1">
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                  placeholder="Your name"
                />
              </div>
              
              <div className="transition-all duration-300 hover:translate-x-1">
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div className="transition-all duration-300 hover:translate-x-1">
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all duration-300"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              
              <Button 
                type="submit" 
                className="w-full button-glow transition-all duration-300 hover:scale-[1.02]" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
          
          <div className="space-y-8 reveal-right">
            <div className="glass-card p-6 rounded-2xl hover-lift">
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start group transition-all duration-300 hover:translate-x-1">
                  <Phone className="h-5 w-5 text-primary mr-3 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start group transition-all duration-300 hover:translate-x-1">
                  <Mail className="h-5 w-5 text-primary mr-3 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">contact@healthyme.com</p>
                  </div>
                </div>
                
                <div className="flex items-start group transition-all duration-300 hover:translate-x-1">
                  <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-muted-foreground">
                      123 Wellness Blvd, Suite 100<br />
                      San Francisco, CA 94105
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-6 rounded-2xl hover-lift">
              <h3 className="text-xl font-semibold mb-4">Hours of Operation</h3>
              <div className="space-y-2">
                <div className="flex justify-between transition-all duration-300 hover:translate-x-1 hover:font-medium">
                  <span>Monday - Friday</span>
                  <span>8:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between transition-all duration-300 hover:translate-x-1 hover:font-medium">
                  <span>Saturday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between transition-all duration-300 hover:translate-x-1 hover:font-medium">
                  <span>Sunday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse-slow" />
      <div className="absolute bottom-1/3 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse-slow" />
    </section>
  );
};

export default Contact;
