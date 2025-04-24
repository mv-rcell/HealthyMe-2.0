import React, { useEffect, useRef } from 'react';

interface BackgroundMusicProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume?: number;
}

const BackgroundMusic: React.FC<BackgroundMusicProps> = ({
  isPlaying,
  isMuted,
  volume = 0.15, // Subtle volume
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;

      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) =>
            console.error('Audio play was prevented:', err)
          );
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isMuted, volume]);

  return (
    <audio
      ref={audioRef}
      src="public/relaxing-jazz-saxophone-music-saxophone-instruments-music-303093.mp3"
      loop
      preload="auto"
    />
  );
};

export default BackgroundMusic;
