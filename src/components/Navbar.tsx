import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import Logo from "./Logo";
import { useAuth } from "@/hooks/useAuth";
import { Menu, X } from "lucide-react";
import AuthButton from "./AuthButton";
import ThemeToggle from "./ThemeToggle";
import MessageNotificationBell from "./messaging/MessageNotificationBell";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/#about" },
    { name: "Features", path: "/#features" },
    { name: "Book Consultation", path: "/book-consultation" },
    { name: "Find Specialists", path: "/specialists" },
    { name: "Memberships", path: "/memberships" },
    { name: "Contact", path: "/#contact" },
  ];

  return (
    <header className="bg-background/90 backdrop-blur-md border-b border-border sticky top-0 z-40 pwa-header">
      <div className="container mx-auto px-4 py-4 mobile-padding">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                onClick={() => {
                  if (item.path.startsWith("/#")) {
                    // Handle in-page navigation for homepage sections
                    if (location.pathname === "/") {
                      document
                        .querySelector(item.path.substring(1))
                        ?.scrollIntoView({ behavior: "smooth" });
                    } else {
                      navigate(item.path);
                    }
                  } else {
                    navigate(item.path);
                  }
                }}
                className={`${
                  isActive(item.path) ? "bg-muted" : ""
                } text-sm transition-colors pwa-button`}
              >
                {item.name}
              </Button>
            ))}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            {user && <MessageNotificationBell />}
            <AuthButton />
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden pwa-button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t mt-4 space-y-2 animate-slide-up">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (item.path.startsWith("/#")) {
                    // Handle in-page navigation for homepage sections
                    if (location.pathname === "/") {
                      document
                        .querySelector(item.path.substring(1))
                        ?.scrollIntoView({ behavior: "smooth" });
                    } else {
                      navigate(item.path);
                    }
                  } else {
                    navigate(item.path);
                  }
                }}
                className={`${
                  isActive(item.path) ? "bg-muted" : ""
                } w-full justify-start text-sm pwa-button`}
              >
                {item.name}
              </Button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
