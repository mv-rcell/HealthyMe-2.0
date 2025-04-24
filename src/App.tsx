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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;

