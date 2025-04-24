
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import AdButton from "./AdButton";


const Navbar = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/#features" },
    { name: "Membership", path: "/#membership" },
    { name: "About", path: "/#about" },
    { name: "Contact", path: "/#contact" },
    { name: "Specialists", path: "/specialists" },
    { name: "Clients", path: "/clients" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm py-2"
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-bold text-primary flex items-center gap-2"
          >
            <span className="rounded-full bg-primary text-white w-8 h-8 flex items-center justify-center">
              H
            </span>
            HealthyMe
          </Link>

          {isMobile ? (
            <>
               <div className="flex items-center gap-2">
                <AdButton />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
              </div>
              {isMenuOpen && (
                <div className="fixed inset-0 top-16 bg-white z-40 p-6">
                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className="text-lg font-medium py-2 hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    ))}
                    <div className="mt-4 flex flex-col gap-4">
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                      <Button className="w-full">Sign Up</Button>
                    </div>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <>
              <NavigationMenu>
                <NavigationMenuList>
                  {navLinks.map((link) => (
                    <NavigationMenuItem key={link.path}>
                      <Link to={link.path} className={navigationMenuTriggerStyle()}>
                        {link.name}
                      </Link>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>

              <div className="flex items-center gap-4">
              <AdButton />
                <Button variant="outline">Sign In</Button>
                <Button>Sign Up</Button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
