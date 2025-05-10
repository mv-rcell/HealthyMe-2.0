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
import AdVideo from "./pages/AdVideo";
import BackgroundMusic from "./components/BackgroundMusic";
import Home from './components/Home';
import NutritionPage from './pages/NutritionPage';
import FitnessPage from './pages/FitnessTrainingPage';
import HealthCarePage from './pages/HealthCarePage';
import TrackingPage from './pages/TrackingPage';
import ServiceDetails from "./pages/ServiceDetails";
import SpecialistOnboarding from "./pages/SpecialistOnboarding.tsx";
import ClientOnboarding from "./pages/ClientOnboarding.tsx";
import SpecialistDashboard from "./pages/SpecialistDashboard.tsx";
import ClientDashboard from "./pages/ClientDashboard.tsx";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";



// Create a client
const queryClient = new QueryClient();

const App = () => {
  const [musicStarted, setMusicStarted] = useState(false);

  const handleStartMusic = () => {
    setMusicStarted(true);
  };

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <SonnerToaster position="top-right" richColors closeButton />

          
          <BackgroundMusic isPlaying={musicStarted} isMuted={false} volume={0.15} />

          <BrowserRouter>
            <Routes>
            <Route path="/" element={<Index />} />
<Route path="/specialists" element={<Specialists />} />
<Route path="/clients" element={<Clients />} />
<Route path="/advideo" element={<AdVideo />} />
<Route path="/home" element={<Home />} />
<Route path="/nutrition" element={<NutritionPage />} />
<Route path="/fitness" element={<FitnessPage />} />
<Route path="/healthcare" element={<HealthCarePage />} />
<Route path="/tracking" element={<TrackingPage />} />
<Route path="/service/:serviceId" element={<ServiceDetails />} />
<Route path="/auth" element={<Auth />} />
<Route path="/profile" element={<Profile />} />
<Route path="/specialist-onboarding" element={<SpecialistOnboarding />} />
<Route path="/client-onboarding" element={<ClientOnboarding />} />
<Route path="/specialist-dashboard" element={<SpecialistDashboard />} />
<Route path="/client-dashboard" element={<ClientDashboard />} />
             

<Route path="/*" element={<NotFound />} />

                  </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;

