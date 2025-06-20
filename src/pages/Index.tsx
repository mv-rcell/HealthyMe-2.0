import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import About from "@/components/About";
import Footer from "@/components/Footer";
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
  Sun,
  Moon
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const useTheme = () => {
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return { theme, setTheme };
};

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full relative">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Index = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedSpecialtyCategory, setSelectedSpecialtyCategory] = useState<string>("");

  // Add your full component code here as you had it
  // Insert <ThemeToggle /> wherever you want in your layout, such as in header settings


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

  const handleSpecialtyCategorySelect = (categoryId: string) => {
    navigate(`/specialists?category=${categoryId}`);
  };

  const handleBackToCategories = () => {
    setSelectedSpecialtyCategory("");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Hello,</p>
                <p className="font-semibold">Health User</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-gray-400" />
              <Settings className="h-5 w-5 text-gray-400" />
              <ThemeToggle />
              <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
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


          {/* Top Services Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top services</h3>
            <div className="grid grid-cols-4 gap-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <div className="text-center cursor-pointer" onClick={() => navigate('/book-consultation')}>
                  <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-red-50 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-red-500" />
                  </div>
                  <span className="text-xs text-gray-700">Book appointment</span>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <div className="text-center cursor-pointer" onClick={() => navigate('/client-dashboard')}>
                  <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-red-50 flex items-center justify-center">
                    <Activity className="h-6 w-6 text-red-500" />
                  </div>
                  <span className="text-xs text-gray-700">Health data</span>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <div className="text-center cursor-pointer" onClick={() => navigate('/virtualchats')}>
                  <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-red-50 flex items-center justify-center">
                    <Video className="h-6 w-6 text-red-500" />
                  </div>
                  <span className="text-xs text-gray-700">Virtual consults</span>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <div className="text-center cursor-pointer" onClick={() => navigate('/integratedspecialists')}>
                  <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-red-50 flex items-center justify-center">
                    <Users className="h-6 w-6 text-red-500" />
                  </div>
                  <span className="text-xs text-gray-700">Find specialists</span>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <div className="text-center cursor-pointer" onClick={() => navigate('/labtests')}>
                  <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-red-50 flex items-center justify-center">
                    <TestTube className="h-6 w-6 text-red-500" />
                  </div>
                  <span className="text-xs text-gray-700">Lab tests</span>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <div className="text-center cursor-pointer" onClick={() => navigate('/programs')}>
                  <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-red-50 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-red-500" />
                  </div>
                  <span className="text-xs text-gray-700">Wellness</span>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <div className="text-center cursor-pointer" onClick={() => navigate('/smart-features')}>
                  <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-red-50 flex items-center justify-center">
                    <Bot className="h-6 w-6 text-red-500" />
                  </div>
                  <span className="text-xs text-gray-700">AI Assistant</span>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <div className="text-center cursor-pointer" onClick={() => navigate('/smart-features')}>
                  <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-red-50 flex items-center justify-center">
                    <Plus className="h-6 w-6 text-red-500" />
                  </div>
                  <span className="text-xs text-gray-700">More</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Quick Transfer Section - Adapted for Health */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Quick connect - Specialists</h3>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {[
                { name: "Dr. Sarah", specialty: "Cardiology", avatar: "S", color: "bg-blue-500" },
                { name: "Dr. Mike", specialty: "Neurology", avatar: "M", color: "bg-green-500" },
                { name: "Dr. Lisa", specialty: "Pediatrics", avatar: "L", color: "bg-purple-500" },
                { name: "Dr. John", specialty: "Surgery", avatar: "J", color: "bg-orange-500" }
              ].map((doctor, index) => (
                <motion.div key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <div className="flex flex-col items-center cursor-pointer min-w-[80px]" onClick={() => navigate('/specialists')}>
                    <div className={`w-12 h-12 ${doctor.color} rounded-full flex items-center justify-center mb-2 text-white font-semibold relative`}>
                      {doctor.avatar}
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-700 text-center">{doctor.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent activities</h3>
              <Button variant="ghost" size="sm" className="text-red-500 text-sm">
                See all <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Appointment scheduled</p>
                  <p className="text-xs text-gray-500">Dr. Sarah - Cardiology checkup</p>
                </div>
                <span className="text-xs text-gray-400">2h ago</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                  <TestTube className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Lab results ready</p>
                  <p className="text-xs text-gray-500">Blood work panel completed</p>
                </div>
                <span className="text-xs text-gray-400">1d ago</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-purple-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New message</p>
                  <p className="text-xs text-gray-500">Follow-up from Dr. Mike</p>
                </div>
                <span className="text-xs text-gray-400">2d ago</span>
              </div>
            </div>
          </div>

          {/* Additional Health Programs Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Programs</h3>
            <div className="space-y-3">
              <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                      <TestTube className="h-6 w-6 text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">Lab Tests & Diagnostics</h4>
                      <p className="text-xs text-gray-500">Comprehensive testing and health screenings</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                      <Heart className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">Wellness Programs</h4>
                      <p className="text-xs text-gray-500">Structured health and fitness programs</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                      <Shield className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">Home Care Services</h4>
                      <p className="text-xs text-gray-500">Professional healthcare services at your home</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* AI Features Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Powered Features</h3>
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-3 mx-auto">
                    <Bot className="h-6 w-6 text-purple-500" />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">AI Assistant</h4>
                  <p className="text-gray-500 text-xs mb-3">Health recommendations</p>
                  <Button size="sm" className="w-full text-xs" onClick={() => navigate('/smart-features')}>
                    Chat with AI
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-3 mx-auto">
                    <Brain className="h-6 w-6 text-cyan-500" />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">Symptom Checker</h4>
                  <p className="text-gray-500 text-xs mb-3">AI-powered analysis</p>
                  <Button size="sm" className="w-full text-xs" onClick={() => navigate('/smart-features')}>
                    Check Symptoms
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <About />
      <Footer />
    </div>
  );
};

export default Index;
