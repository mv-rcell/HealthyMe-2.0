import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Hospital, Heart, ShieldCheck, CalendarDays, UsersRound, Award, Play, Dumbbell, Apple, Salad, Carrot, Egg, Bean, Nut } from "lucide-react";
import AdVoiceoverPlayer from "@/components/AdVoiceoverPlayer";
import BackgroundMusic from "@/components/BackgroundMusic";
import { Pause, Play as PlayIcon, Mic, MicOff } from "lucide-react";

const SCENE_DATA = [
  {
    id: 0,
    duration: 10000,
    voiceover:
      "Welcome to HealthyMe. A place where efficiency meets excellence, and your wellbeing is our mission.",
  },
  {
    id: 1,
    duration: 10000,
    voiceover:
      "For every client, we provide trusted care. International standards, an immersive, person-centered approach, and timely access—our promise to you.",
  },
  {
    id: 2,
    duration: 12000,
    voiceover:
      "From specialist consultations, and top notch workout equipment,to advanced technology, and world-class safety—your journey to healthy living is supported at every step.",
  },
  {
    id: 3,
    duration: 10000,
    voiceover:
      "Experience the difference of lifelong wellbeing. Book your visit today with HealthyMe .",
  },
];

// The visual scenes remain the same but will be paced with the voiceover
const AdVideo = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  

  const backgroundStyle = {
    backgroundImage: "url('/dumbell-5237133_1280.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };


  // Updated hospital/care focused scenes for HealthyMe
  const scenes = [
    {
      id: 0,
      duration: SCENE_DATA[0].duration,
      component: (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 animate-pulse-slow shadow-md">
            <Hospital className="h-10 w-10 text-[#1666ba] animate-float" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-3 animate-fade-in">
            <span className="bg-gradient-to-r from-[#1666ba] to-[#3ba8e2] bg-clip-text text-transparent">
              HealthyMe
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-600 max-w-md mx-auto animate-fade-in" style={{ animationDelay: "300ms" }}>
            Where health meets efficiency
          </p>
        </div>
      ),
    },
    {
      id: 1,
      duration: SCENE_DATA[1].duration,
      component: (
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 animate-fade-in">
            Trusted Care for Every Client
          </h2>
          <img 
        src="/customer-3864809_1280.jpg"
        alt="Healthy Food"
        className="w-full max-w-lg rounded-2xl mb-6 shadow-lg animate-fade-in"
        style={{ animationDelay: "300ms" }}
      />
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: "300ms" }}>
            <div className="flex flex-col items-center bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md">
              <div className="text-[#1666ba] mb-2">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <p className="text-gray-700">International Healthcare Standards</p>
            </div>
            <div className="flex flex-col items-center bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md">
              <div className="text-[#1666ba] mb-2">
                <Heart className="h-6 w-6" />
              </div>
              <p className="text-gray-700">Immersive, Person-Centered Approach</p>
            </div>
            <div className="flex flex-col items-center bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md">
              <div className="text-[#1666ba] mb-2">
                <CalendarDays className="h-6 w-6" />
              </div>
              <p className="text-gray-700">Accessible, Timely Appointments</p>
            </div>
            <div className="flex flex-col items-center bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md">
              <div className="text-[#1666ba] mb-2">
                <Award className="h-6 w-6" />
              </div>
              <p className="text-gray-700">Award-Winning Medical & Nutritional Team</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      duration: SCENE_DATA[2].duration,
      component: (
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-center animate-fade-in">
            Comprehensive Care, Advanced Technology
          </h2>
          <img 
        src="/treadmill-5030966_1280.jpg"
        alt="Healthy Food"
        className="w-full max-w-lg rounded-2xl mb-6 shadow-lg animate-fade-in"
        style={{ animationDelay: "300ms" }}
      />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div
              className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-md hover-lift"
              style={{ animationDelay: "200ms" }}
            >
              <UsersRound className="h-12 w-12 text-[#1666ba] mb-4" />
              <h3 className="text-xl font-semibold mb-2">Specialist Consultations</h3>
              <p className="text-gray-600 text-center">Access leading experts across every field</p>
            </div>
            <div
              className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-md hover-lift"
              style={{ animationDelay: "400ms" }}
            >
              <ShieldCheck className="h-12 w-12 text-[#1666ba] mb-4" />
              <h3 className="text-xl font-semibold mb-2">Client Safety First</h3>
              <p className="text-gray-600 text-center">World-class safety protocols for peace of mind</p>
            </div>
            <div
              className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-md hover-lift"
              style={{ animationDelay: "600ms" }}
            >
              <Hospital className="h-12 w-12 text-[#1666ba] mb-4" />
              <h3 className="text-xl font-semibold mb-2">State-of-the-Art Facilities</h3>
              <p className="text-gray-600 text-center">Modern gym equipment and workout environments</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      duration: SCENE_DATA[3].duration,
      component: (
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in">
            <span className="bg-gradient-to-r from-[#1666ba] to-[#3ba8e2] bg-clip-text text-transparent">
              Experience the Difference
            </span>
          </h2>
          <p className="text-lg md:text-2xl text-gray-700 max-w-lg mx-auto mb-8 animate-fade-in" style={{ animationDelay: "300ms" }}>
            HealthyMe – Your Partner for physical and mental wellness
          </p>
          <Button
            size="lg"
            className="animate-bounce button-glow text-white flex items-center gap-2 bg-[#1666ba] hover:bg-[#145caf]"
            style={{ animationDelay: "600ms" }}
            onClick={() => navigate("/")}
          >
            <Play className="h-5 w-5" />
            Book Your Visit
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (isPlaying && currentScene < scenes.length) {
      timeoutRef.current = setTimeout(() => {
        if (currentScene < scenes.length - 1) {
          setCurrentScene((prev) => prev + 1);
        } else {
          setCurrentScene(0);
        }
      }, scenes[currentScene].duration);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentScene, isPlaying, scenes.length]);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleExit = () => {
    navigate("/");
  };

  return (
    <div
      className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden"
      style={backgroundStyle}
    >
      
      {/* Decorative circles */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#D3E4FD] rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#F1F0FB] rounded-full blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#F1F0FB] via-[#D3E4FD] to-white/60 pointer-events-none" />

      <AdVoiceoverPlayer
        scenes={SCENE_DATA}
        currentScene={currentScene}
        isPlaying={isPlaying}
        isMuted={isMuted}
      />

<BackgroundMusic 
        isPlaying={isPlaying} 
        isMuted={isMuted} 
        volume={0.15}
      />


      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-full max-w-6xl mx-auto mb-8 transition-all duration-1000">
            {scenes[currentScene].component}
          </div>
          {/* CONTROLS */}
          <div className="flex items-center gap-4 mt-12">
            <Button variant="outline" size="sm" onClick={handlePlayPause}>
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <PlayIcon className="h-4 w-4 mr-1" />
                  Play
                </>
              )}
            </Button>
            <Button
              variant={isMuted ? "default" : "outline"}
              size="icon"
              onClick={handleMute}
              aria-label={isMuted ? "Unmute voiceover" : "Mute voiceover"}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-2">
              {scenes.map((scene) => (
                <button
                  key={scene.id}
                  onClick={() => setCurrentScene(scene.id)}
                  className={`w-3 h-3 rounded-full border border-[#b1c8e6] transition-colors duration-200 ${
                    currentScene === scene.id ? "bg-[#1666ba]" : "bg-gray-300"
                  }`}
                  aria-label={`Go to scene ${scene.id + 1}`}
                />
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={handleExit}>
              Exit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdVideo;
