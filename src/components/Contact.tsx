import React, { useState, useRef, useEffect } from "react";
import { Phone, Mail, MapPin, Send, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSpecialists: 0,
    completedAppointments: 0
  });
  const contactRef = useRef<HTMLElement>(null);

  // Fetch real-time stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total users count
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Get active specialists count
        const { count: specialistsCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'specialist')
          .eq('is_active', true);

        // Get completed appointments count
        const { count: appointmentsCount } = await supabase
          .from('appointments_new')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'completed');

        setStats({
          totalUsers: usersCount || 0,
          activeSpecialists: specialistsCount || 0,
          completedAppointments: appointmentsCount || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
    
    // Set up real-time subscription for stats updates
    const channel = supabase
      .channel('contact-stats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments_new' }, fetchStats)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // For now, we'll just show a success message since we don't have a contact_messages table
      // In a real application, you would store this in a contact messages table
      console.log('Contact form submitted:', formData);
      
      // Reset form and show success message
      setFormData({ name: "", email: "", message: "" });
      toast.success("Message sent!", {
        description: "We'll get back to you within 24 hours."
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message", {
        description: "Please try again or contact us directly."
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

        {/* Real-time Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 reveal">
          <div className="text-center p-6 glass-card rounded-2xl">
            <div className="text-3xl font-bold text-primary mb-2">{stats.totalUsers.toLocaleString()}</div>
            <div className="text-muted-foreground">Registered Users</div>
          </div>
          <div className="text-center p-6 glass-card rounded-2xl">
            <div className="text-3xl font-bold text-primary mb-2">{stats.activeSpecialists}</div>
            <div className="text-muted-foreground">Active Specialists</div>
          </div>
          <div className="text-center p-6 glass-card rounded-2xl">
            <div className="text-3xl font-bold text-primary mb-2">{stats.completedAppointments.toLocaleString()}</div>
            <div className="text-muted-foreground">Successful Consultations</div>
          </div>
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
                    <p className="text-muted-foreground">+254 701 482 127</p>
                    <p className="text-muted-foreground">+254 701 210 698</p>
                    <p className="text-muted-foreground">(555) 123-4567</p>


                  </div>
                </div>
                
                <div className="flex items-start group transition-all duration-300 hover:translate-x-1">
                  <Mail className="h-5 w-5 text-primary mr-3 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">support@healthyme.com</p>
                    <p className="text-muted-foreground">info@healthyMe.com</p>

                  </div>
                </div>
                
                <div className="flex items-start group transition-all duration-300 hover:translate-x-1">
                  <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-muted-foreground">
                      Nairobi Health Center<br />
                      Westlands, Nairobi 00100
                      123 Medical Center Dr Health City,HC 12345
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-6 rounded-2xl hover-lift">
              <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
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

            <div className="glass-card p-6 rounded-2xl hover-lift">
              <h3 className="text-xl font-semibold mb-4">Response Time</h3>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">We typically respond within 2-4 hours during business hours</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">Emergency support available 24/7</span>
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