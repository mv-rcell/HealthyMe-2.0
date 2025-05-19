import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Specialists from "./pages/Specialist";
import Clients from "./pages/Client";
import AdVideo from "./pages/AdVideo.tsx";
import BackgroundMusic from "./components/BackgroundMusic.tsx";
import Home from './components/Home';
import NutritionPage from './pages/NutritionPage';
import FitnessPage from './pages/FitnessTrainingPage';
import HealthCarePage from './pages/HealthCarePage';
import TrackingPage from './pages/TrackingPage';
import ServiceDetails from "./pages/ServiceDetails";
import SpecialistOnboarding from "./pages/SpecialistOnboarding.tsx";
import ClientOnboarding from "./pages/ClientOnboarding.tsx";
import SpecialistDashboard from "./pages/SpecialistDashboard.tsx";
import SpecialistProfile from "./pages/SpecialistProfile.tsx";
import ClientDashboard from "./pages/ClientDashboard.tsx";
import MembershipPage from "./pages/MembershipPage.tsx";
import Auth from "./pages/Auth";
import Payments from "./pages/Payments.tsx";
import Profile from "./pages/Profile";
import { ThemeProvider } from "./hooks/use-theme";
import AuthGate from '@/components/AuthGate.tsx'; 
import AppointmentRequest from '@/pages/AppointmentRequest.tsx'



// Create a client
const queryClient = new QueryClient();

const App = () => {
  const [musicStarted, setMusicStarted] = useState(false);

  const handleStartMusic = () => {
    setMusicStarted(true);
  };

  return (
    <React.StrictMode>
       <ThemeProvider defaultTheme="system">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <SonnerToaster position="top-right" richColors closeButton />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/specialists" element={<Specialists />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/specialist/:id" element={<SpecialistProfile />} />
                <Route path="/BackgroundMusic" element={<BackgroundMusic isPlaying={false} isMuted={false} />} />
                <Route path="/Home" element={<Home />} />                
                <Route path="/NutritionPage" element={<NutritionPage />} />
                <Route path="/FitnessPage" element={<FitnessPage />} />
                <Route path="/HealthCarePage" element={<HealthCarePage />} />
                <Route path="/TrackingPage" element={<TrackingPage />} />
                <Route path="/AdVideo" element={<AdVideo />} />
                <Route path="/service/:serviceId" element={<ServiceDetails />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/specialist-onboarding" element={<SpecialistOnboarding />} />
                <Route path="/client-onboarding" element={<ClientOnboarding/>} />
                <Route path="/specialist-dashboard" element={<SpecialistDashboard />} />
                <Route path="/client-dashboard" element={<ClientDashboard />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/memberships" element={<MembershipPage />} />
                <Route path="/appointment" element={<AppointmentRequest />} />

                <Route path="/" element={<AuthGate />} />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
};

export default App;

