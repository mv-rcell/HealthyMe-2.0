import React from "react";
import { ChevronRight, Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary/5 pt-16 pb-8">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4">HEALTHY<span className="text-primary/70">ME</span></h3>
            <p className="text-muted-foreground mb-4">
              Your complete health and wellness solution, anytime, anywhere. We bring expert care to you.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" 
                className="bg-primary/10 hover:bg-primary/20 text-primary p-2 rounded-full transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="bg-primary/10 hover:bg-primary/20 text-primary p-2 rounded-full transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"
                className="bg-primary/10 hover:bg-primary/20 text-primary p-2 rounded-full transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                className="bg-primary/10 hover:bg-primary/20 text-primary p-2 rounded-full transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                className="bg-primary/10 hover:bg-primary/20 text-primary p-2 rounded-full transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
        
        </div>
        
        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} HealthyMe. All rights reserved.</p>
          <div className="mt-2 flex justify-center gap-4">
            <a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
