import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  Users, 
  Stethoscope, 
  TestTube, 
  Brain, 
  Bot, 
  Heart,
  Activity,
  Shield,
  Smartphone,
  Video,
  MessageCircle,
  Star,
  ChevronRight,
  Plus,
  Search,
  ArrowLeft,
  Eye,
  Scissors,
  Baby,
  Bell,
  Settings,
  Moon,
  Sun,
  Menu,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Simple theme hook implementation (using state instead of localStorage)
const useTheme = () => {
  const [theme, setThemeState] = useState('light');

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    
    // Apply theme to document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    // Apply theme on mount
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return { theme, setTheme };
};

// Mock auth hook
const useAuth = () => {
  return {
    user: { name: "Health User", avatar: "H" }
  };
};

// Mock navigation hook
const useNavigate = () => {
  return (path) => {
    console.log(`Navigating to: ${path}`);
  };
};

// Mock location hook
const useLocation = () => {
  return {
    pathname: '/'
  };
};

// Theme Toggle Component
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Navbar Component
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-500" />
          <span className="font-bold text-gray-900 dark:text-white">HealthApp</span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Button 
            variant="ghost" 
            className="text-gray-600 dark:text-gray-300 hover:text-red-500"
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </Button>
          <Button 
            variant="ghost" 
            className="text-gray-600 dark:text-gray-300 hover:text-red-500"
            onClick={() => navigate('/appointments')}
          >
            Appointments
          </Button>
          <Button 
            variant="ghost" 
            className="text-gray-600 dark:text-gray-300 hover:text-red-500"
            onClick={() => navigate('/specialists')}
          >
            Specialists
          </Button>
          <Button 
            variant="ghost" 
            className="text-gray-600 dark:text-gray-300 hover:text-red-500"
            onClick={() => navigate('/health-records')}
          >
            Health Records
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col gap-2 mt-4">
            <Button 
              variant="ghost" 
              className="justify-start text-gray-600 dark:text-gray-300 hover:text-red-500"
              onClick={() => {
                navigate('/dashboard');
                setIsMobileMenuOpen(false);
              }}
            >
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              className="justify-start text-gray-600 dark:text-gray-300 hover:text-red-500"
              onClick={() => {
                navigate('/appointments');
                setIsMobileMenuOpen(false);
              }}
            >
              Appointments
            </Button>
            <Button 
              variant="ghost" 
              className="justify-start text-gray-600 dark:text-gray-300 hover:text-red-500"
              onClick={() => {
                navigate('/specialists');
                setIsMobileMenuOpen(false);
              }}
            >
              Specialists
            </Button>
            <Button 
              variant="ghost" 
              className="justify-start text-gray-600 dark:text-gray-300 hover:text-red-500"
              onClick={() => {
                navigate('/health-records');
                setIsMobileMenuOpen(false);
              }}
            >
              Health Records
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

// Footer Component
const Footer = () => {
  const navigate = useNavigate();
  
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-6 w-6 text-red-500" />
              <span className="font-bold text-gray-900 dark:text-white">HealthApp</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your comprehensive healthcare companion for better health management.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Button 
                variant="link" 
                className="p-0 h-auto text-sm text-gray-600 dark:text-gray-400 hover:text-red-500"
                onClick={() => navigate('/book-consultation')}
              >
                Book Appointment
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-sm text-gray-600 dark:text-gray-400 hover:text-red-500"
                onClick={() => navigate('/specialists')}
              >
                Find Specialists
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-sm text-gray-600 dark:text-gray-400 hover:text-red-500"
                onClick={() => navigate('/labtests')}
              >
                Lab Tests
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-sm text-gray-600 dark:text-gray-400 hover:text-red-500"
                onClick={() => navigate('/virtualchats')}
              >
                Virtual Consultations
              </Button>
            </div>
          </div>

          {/* Services */}
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Services</h3>
            <div className="space-y-2">
              <Button 
                variant="link" 
                className="p-0 h-auto text-sm text-gray-600 dark:text-gray-400 hover:text-red-500"
                onClick={() => navigate('/programs')}
              >
                Wellness Programs
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-sm text-gray-600 dark:text-gray-400 hover:text-red-500"
                onClick={() => navigate('/smart-features')}
              >
                AI Health Assistant
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-sm text-gray-600 dark:text-gray-400 hover:text-red-500"
                onClick={() => navigate('/client-dashboard')}
              >
                Health Dashboard
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-sm text-gray-600 dark:text-gray-400 hover:text-red-500"
                onClick={() => navigate('/integratedspecialists')}
              >
                Integrated Care
              </Button>
            </div>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Contact</h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>📞 +254 701 210 698</p>
              <p>📞 +254 701 482 127</p>

              <p>✉️ support@HealthyMe.com</p>
              <p>📍 Nairobi, Kenya</p>
              <p>🕒 24/7 Support Available</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2025 HealthMe. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
};

const Index = () => {
  const [selectedTab, setSelectedTab] = useState("quick-access");
  const [selectedSpecialtyCategory, setSelectedSpecialtyCategory] = useState("");
  const navigate = useNavigate();

  // Specialty categories matching the specialists data
  const specialtyCategories = [
    {
      id: "general-medicine",
      name: "General Medicine",
      description: "Primary care and family medicine",
      icon: Stethoscope,
      color: "bg-red-500"
    },
    {
      id: "surgery",
      name: "Surgery",
      description: "General and specialized surgical procedures",
      icon: Scissors,
      color: "bg-blue-500"
    },
    {
      id: "neurology",
      name: "Neurology",
      description: "Brain and nervous system disorders",
      icon: Brain,
      color: "bg-purple-500"
    },
    {
      id: "mental-health",
      name: "Mental Health",
      description: "Psychiatric and psychological care",
      icon: Heart,
      color: "bg-green-500"
    },
    {
      id: "pediatrics",
      name: "Pediatrics",
      description: "Child and adolescent healthcare",
      icon: Baby,
      color: "bg-pink-500"
    },
    {
      id: "ophthalmology",
      name: "Ophthalmology",
      description: "Eye care and vision health",
      icon: Eye,
      color: "bg-indigo-500"
    }
  ];

  const handleSpecialtyCategorySelect = (categoryId) => {
    navigate(`/specialists?category=${categoryId}`);
  };

  const handleBackToCategories = () => {
    setSelectedSpecialtyCategory("");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto">
          {/* Header with greeting and notifications - Banking app style */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Hello,</p>
                <p className="font-semibold text-gray-900 dark:text-white">HealthyMe</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => navigate('/notifications')} />
              <Settings className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => navigate('/settings')} />
              <div 
                className="w-8 h-8 bg-red-500 rounded flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors"
                onClick={() => navigate('/profile')}
              >
                <span className="text-white text-xs font-bold">H</span>
              </div>
            </div>
          </div>

          <Card className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white rounded-2xl mb-6 overflow-hidden relative">
            <div className="absolute top-4 right-4">
              <ChevronRight className="h-5 w-5 opacity-70" />
            </div>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm opacity-80">Health Dashboard</span>
                <Eye className="h-4 w-4 opacity-70" />
              </div>
              <div className="text-2xl font-bold mb-1">Your Health Score</div>
              <div className="text-3xl font-bold">85/100</div>
              <div className="text-sm opacity-80 mt-2">Last updated today</div>
            </CardContent>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10" />
          </Card>

          {/* Services Tabs Section */}
          <div className="mb-6">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="quick-access" className="text-xs">Quick Access</TabsTrigger>
                <TabsTrigger value="consultations" className="text-xs">Consultations</TabsTrigger>
                <TabsTrigger value="health-tools" className="text-xs">Health Tools</TabsTrigger>
              </TabsList>

              <TabsContent value="quick-access">
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center cursor-pointer" onClick={() => navigate('/book-consultation')}>
                    <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-red-500" />
                    </div>
                    <span className="text-xs text-gray-700 dark:text-gray-300">Book appointment</span>
                  </div>

                  <div className="text-center cursor-pointer" onClick={() => navigate('/client-dashboard')}>
                    <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                      <Activity className="h-6 w-6 text-red-500" />
                    </div>
                    <span className="text-xs text-gray-700 dark:text-gray-300">Health data</span>
                  </div>

                  <div className="text-center cursor-pointer" onClick={() => navigate('/integratedspecialists')}>
                    <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                      <Users className="h-6 w-6 text-red-500" />
                    </div>
                    <span className="text-xs text-gray-700 dark:text-gray-300">Find specialists</span>
                  </div>

                  <div className="text-center cursor-pointer" onClick={() => navigate('/programs')}>
                    <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                      <Heart className="h-6 w-6 text-red-500" />
                    </div>
                    <span className="text-xs text-gray-700 dark:text-gray-300">Wellness</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="consultations">
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center cursor-pointer" onClick={() => navigate('/virtualchats')}>
                    <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <Video className="h-6 w-6 text-blue-500" />
                    </div>
                    <span className="text-xs text-gray-700 dark:text-gray-300">Virtual consults</span>
                  </div>

                  <div className="text-center cursor-pointer" onClick={() => navigate('/specialists')}>
                    <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <Stethoscope className="h-6 w-6 text-blue-500" />
                    </div>
                    <span className="text-xs text-gray-700 dark:text-gray-300">Specialists</span>
                  </div>

                  <div className="text-center cursor-pointer" onClick={() => navigate('/emergency-consult')}>
                    <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-blue-500" />
                    </div>
                    <span className="text-xs text-gray-700 dark:text-gray-300">Emergency</span>
                  </div>

                  <div className="text-center cursor-pointer" onClick={() => navigate('/follow-up')}>
                    <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-blue-500" />
                    </div>
                    <span className="text-xs text-gray-700 dark:text-gray-300">Follow-up</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="health-tools">
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center cursor-pointer" onClick={() => navigate('/labtests')}>
                    <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                      <TestTube className="h-6 w-6 text-green-500" />
                    </div>
                    <span className="text-xs text-gray-700 dark:text-gray-300">Lab tests</span>
                  </div>

                  <div className="text-center cursor-pointer" onClick={() => navigate('/smart-features')}>
                    <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                      <Bot className="h-6 w-6 text-green-500" />
                    </div>
                    <span className="text-xs text-gray-700 dark:text-gray-300">AI Assistant</span>
                  </div>

                  <div className="text-center cursor-pointer" onClick={() => navigate('/health-tracker')}>
                    <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                      <Smartphone className="h-6 w-6 text-green-500" />
                    </div>
                    <span className="text-xs text-gray-700 dark:text-gray-300">Health tracker</span>
                  </div>

                  <div className="text-center cursor-pointer" onClick={() => navigate('/reports')}>
                    <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                      <Eye className="h-6 w-6 text-green-500" />
                    </div>
                    <span className="text-xs text-gray-700 dark:text-gray-300">Reports</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Quick Transfer Section - Adapted for Health */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick connect - Specialists</h3>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {[
                { name: "Dr. Sarah", specialty: "Cardiology", avatar: "S", color: "bg-blue-500" },
                { name: "Dr. Mike", specialty: "Neurology", avatar: "M", color: "bg-green-500" },
                { name: "Dr. Lisa", specialty: "Pediatrics", avatar: "L", color: "bg-purple-500" },
                { name: "Dr. John", specialty: "Surgery", avatar: "J", color: "bg-orange-500" }
              ].map((doctor, index) => (
                <div key={index} className="flex flex-col items-center cursor-pointer min-w-[80px]" onClick={() => navigate('/specialists')}>
                  <div className={`w-12 h-12 ${doctor.color} rounded-full flex items-center justify-center mb-2 text-white font-semibold relative`}>
                    {doctor.avatar}
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-700 dark:text-gray-300 text-center">{doctor.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent activities</h3>
              <Button variant="ghost" size="sm" className="text-red-500 text-sm">
                See all <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Appointment scheduled</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Dr. Sarah - Cardiology checkup</p>
                </div>
                <span className="text-xs text-gray-400">2h ago</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <TestTube className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Lab results ready</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Blood work panel completed</p>
                </div>
                <span className="text-xs text-gray-400">1d ago</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-purple-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">New message</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Follow-up from Dr. Mike</p>
                </div>
                <span className="text-xs text-gray-400">2d ago</span>
              </div>
            </div>
          </div>

          {/* Additional Health Programs Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Health Programs</h3>
            <div className="space-y-3">
              <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer" onClick={() => navigate('/labtests')}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                      <TestTube className="h-6 w-6 text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Lab Tests & Diagnostics</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Comprehensive testing and health screenings</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer" onClick={() => navigate('/programs')}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                      <Heart className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Wellness Programs</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Structured health and fitness programs</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer" onClick={() => navigate('/home-care')}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                      <Shield className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Home Care Services</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Professional healthcare services at your home</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* AI Features Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI-Powered Features</h3>
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-3 mx-auto">
                    <Bot className="h-6 w-6 text-purple-500" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">AI Assistant</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mb-3">Health recommendations</p>
                  <Button size="sm" className="w-full text-xs" onClick={() => navigate('/smart-features')}>
                    Chat with AI
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-3 mx-auto">
                    <Brain className="h-6 w-6 text-cyan-500" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Symptom Checker</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mb-3">AI-powered analysis</p>
                  <Button size="sm" className="w-full text-xs" onClick={() => navigate('/smart-features')}>
                    Check Symptoms
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;