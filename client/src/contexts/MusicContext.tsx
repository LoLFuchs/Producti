import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { lofiTracks } from "@/lib/lofi-tracks";

interface MusicContextProps {
  isPlaying: boolean;
  volume: number;
  currentTrackIndex: number;
  currentTrackName: string;
  toggleMusic: () => void;
  adjustVolume: (volume: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
}

// Create a context with default values
const MusicContext = createContext<MusicContextProps>({
  isPlaying: false,
  volume: 50,
  currentTrackIndex: 0,
  currentTrackName: lofiTracks[0]?.title || "Unknown",
  toggleMusic: () => {},
  adjustVolume: () => {},
  nextTrack: () => {},
  previousTrack: () => {}
});

// Custom hook to use the music context
export const useMusic = () => useContext(MusicContext);

export function MusicProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage if available
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(() => {
    if (typeof window === "undefined") return 50;
    
    const savedVolume = localStorage.getItem("music-volume");
    return savedVolume ? Number(savedVolume) : 50;
  });
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // Save volume to localStorage when it changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("music-volume", volume.toString());
  }, [volume]);

  // Initialize audio element on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    try {
      // Create audio element
      const audioElement = new Audio();
      
      // Set audio properties
      audioElement.volume = volume / 100;
      audioElement.loop = true;
      
      // Load the audio from our local server
      const audioSrc = lofiTracks[currentTrackIndex].url;
      console.log("Loading audio from:", audioSrc);
      audioElement.src = audioSrc;
      
      // Add listeners
      audioElement.addEventListener('canplaythrough', () => {
        console.log("Audio loaded and can play");
      });
      
      audioElement.addEventListener('error', (e) => {
        console.error("Audio loading error:", e);
      });
      
      // Set the audio element
      setAudio(audioElement);
      
      // Cleanup on unmount
      return () => {
        audioElement.pause();
        audioElement.src = "";
      };
    } catch (err) {
      console.error("Error initializing audio:", err);
    }
  }, []);

  // Handle track changes
  useEffect(() => {
    if (!audio) return;
    
    try {
      audio.src = lofiTracks[currentTrackIndex].url;
      audio.load();
      
      if (isPlaying) {
        audio.play().catch(err => {
          console.error("Error playing audio:", err);
          setIsPlaying(false);
        });
      }
    } catch (err) {
      console.error("Error changing track:", err);
    }
  }, [currentTrackIndex, audio]);

  // Handle play/pause
  useEffect(() => {
    if (!audio) return;
    
    try {
      if (isPlaying) {
        // Make sure we have a valid source
        if (!audio.src || audio.src === '') {
          audio.src = lofiTracks[currentTrackIndex].url;
          audio.load();
        }
        
        // Create a promise to track when the audio is actually ready
        const playPromise = audio.play();
        
        // Modern browsers return a promise from play()
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.error("Error playing audio:", err);
            setIsPlaying(false);
          });
        }
      } else {
        // Only pause if we're actually playing, to avoid errors
        if (!audio.paused) {
          audio.pause();
        }
      }
    } catch (err) {
      console.error("Error playing/pausing audio:", err);
      setIsPlaying(false);
    }
  }, [isPlaying, audio, currentTrackIndex]);

  // Handle volume changes
  useEffect(() => {
    if (!audio) return;
    try {
      audio.volume = volume / 100;
    } catch (err) {
      console.error("Error adjusting volume:", err);
    }
  }, [volume, audio]);

  // Player controls
  const toggleMusic = () => {
    setIsPlaying(prev => !prev);
  };

  const adjustVolume = (newVolume: number) => {
    setVolume(newVolume);
  };

  const nextTrack = () => {
    setCurrentTrackIndex(prev => 
      prev === lofiTracks.length - 1 ? 0 : prev + 1
    );
  };

  const previousTrack = () => {
    setCurrentTrackIndex(prev => 
      prev === 0 ? lofiTracks.length - 1 : prev - 1
    );
  };

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        volume,
        currentTrackIndex,
        currentTrackName: lofiTracks[currentTrackIndex]?.title || "Unknown",
        toggleMusic,
        adjustVolume,
        nextTrack,
        previousTrack
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}