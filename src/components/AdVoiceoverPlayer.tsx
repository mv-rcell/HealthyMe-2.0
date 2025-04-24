
import React, { useEffect, useRef } from "react";

interface Scene {
  id: number;
  voiceover: string;
  duration: number;
}
interface AdVoiceoverPlayerProps {
  scenes: Scene[];
  currentScene: number;
  isPlaying: boolean;
  isMuted: boolean;
}

const AdVoiceoverPlayer: React.FC<AdVoiceoverPlayerProps> = ({
  scenes,
  currentScene,
  isPlaying,
  isMuted,
}) => {
  const synth = window.speechSynthesis;
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const prevSceneRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying || isMuted || !scenes[currentScene]?.voiceover) {
      synth.cancel();
      return;
    }
    // Only change voiceover if scene changed/playing
    if (prevSceneRef.current !== currentScene) {
      synth.cancel();
      const utter = new window.SpeechSynthesisUtterance(
        scenes[currentScene].voiceover
      );
      // Set female, English, soft voice if available; fallback otherwise
      const voice =
        synth
          .getVoices()
          .find(
            (v) =>
              v.lang.startsWith("en") &&
              (v.name.toLowerCase().includes("female") ||
                v.name.toLowerCase().includes("google us english"))
          ) || undefined;
      if (voice) utter.voice = voice;
      utter.rate = 0.97;
      utter.pitch = 1.03;
      utter.volume = 0.92;
      utteranceRef.current = utter;
      synth.speak(utter);
      prevSceneRef.current = currentScene;
    }
    // Stop voice if muted or paused
    return () => {
      synth.cancel();
    };
    // eslint-disable-next-line
  }, [currentScene, isPlaying, isMuted, scenes]);

  useEffect(() => {
    // If pause, stop talking
    if (!isPlaying || isMuted) {
      synth.cancel();
    }
    // eslint-disable-next-line
  }, [isPlaying, isMuted]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      synth.cancel();
    };
    // eslint-disable-next-line
  }, []);

  return null;
};

export default AdVoiceoverPlayer;