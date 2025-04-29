import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface TimerSettings {
  workTime: number;  // minutes
  shortBreakTime: number;
  longBreakTime: number;
  rounds: number;
}

type TimerMode = "work" | "shortBreak" | "longBreak";

interface TimerContextProps {
  timeLeft: number;
  maxTime: number;
  isRunning: boolean;
  currentRound: number;
  totalRounds: number;
  mode: TimerMode;
  settings: TimerSettings;
  startTimer: () => void;
  resetTimer: () => void;
  skipTimer: () => void;
  updateWorkTime: (time: number) => void;
  updateShortBreakTime: (time: number) => void;
  updateLongBreakTime: (time: number) => void;
  updateRounds: (rounds: number) => void;
}

const defaultSettings: TimerSettings = {
  workTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  rounds: 4
};

// Create context with default values
const TimerContext = createContext<TimerContextProps>({
  timeLeft: defaultSettings.workTime * 60,
  maxTime: defaultSettings.workTime * 60,
  isRunning: false,
  currentRound: 1,
  totalRounds: defaultSettings.rounds,
  mode: "work",
  settings: defaultSettings,
  startTimer: () => {},
  resetTimer: () => {},
  skipTimer: () => {},
  updateWorkTime: () => {},
  updateShortBreakTime: () => {},
  updateLongBreakTime: () => {},
  updateRounds: () => {}
});

// Custom hook to use the timer context
export const useTimer = () => useContext(TimerContext);

export function TimerProvider({ children }: { children: ReactNode }) {
  // Load settings from localStorage if available
  const [settings, setSettings] = useState<TimerSettings>(() => {
    if (typeof window === "undefined") return defaultSettings;
    
    try {
      const savedSettings = localStorage.getItem("timer-settings");
      if (savedSettings) {
        return JSON.parse(savedSettings) as TimerSettings;
      }
    } catch (e) {
      console.error("Failed to parse timer settings:", e);
    }
    return defaultSettings;
  });

  // Initialize timer state
  const [timeLeft, setTimeLeft] = useState(settings.workTime * 60);
  const [maxTime, setMaxTime] = useState(settings.workTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>("work");
  const [currentRound, setCurrentRound] = useState(1);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Save settings to localStorage when they change
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("timer-settings", JSON.stringify(settings));
  }, [settings]);

  // Notification function
  const notifyUser = (message: string) => {
    if (typeof window === "undefined") return;
    
    try {
      // Browser notification
      if (Notification.permission === "granted") {
        new Notification("Pomodoro Timer", { body: message });
      }
      
      // Sound notification
      const audio = new Audio('/notification.mp3');
      audio.play().catch(err => console.error("Could not play notification sound:", err));
    } catch (err) {
      console.error("Notification error:", err);
    }
  };

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    if (typeof Notification !== "undefined" && 
        Notification.permission !== "granted" && 
        Notification.permission !== "denied") {
      Notification.requestPermission().catch(err => {
        console.error("Error requesting notification permission:", err);
      });
    }
  }, []);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  // Reset timer when settings change
  useEffect(() => {
    resetTimer();
  }, [settings.workTime, settings.shortBreakTime, settings.longBreakTime, settings.rounds]);

  const startTimer = () => {
    if (typeof window === "undefined") return;
    
    if (isRunning) {
      // Pause the timer
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      setIsRunning(false);
    } else {
      // Start the timer
      setIsRunning(true);
      const id = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer completed
            if (intervalId) clearInterval(intervalId);
            
            // Determine next mode
            if (mode === "work") {
              const isLastRound = currentRound >= settings.rounds;
              const nextMode = isLastRound ? "longBreak" : "shortBreak";
              const message = isLastRound 
                ? "Time for a long break!" 
                : "Time for a short break!";
              
              notifyUser(message);
              
              // Setup next timer
              setMode(nextMode);
              const nextDuration = isLastRound 
                ? settings.longBreakTime * 60 
                : settings.shortBreakTime * 60;
              
              setTimeLeft(nextDuration);
              setMaxTime(nextDuration);
              setIsRunning(false);
              return nextDuration;
            } else {
              // Break completed, go back to work
              const nextRound = mode === "longBreak" ? 1 : currentRound + 1;
              
              notifyUser("Break complete! Time to focus!");
              
              setMode("work");
              setCurrentRound(nextRound);
              setTimeLeft(settings.workTime * 60);
              setMaxTime(settings.workTime * 60);
              setIsRunning(false);
              return settings.workTime * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
      setIntervalId(id);
    }
  };

  const resetTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsRunning(false);
    setMode("work");
    setCurrentRound(1);
    const workSeconds = settings.workTime * 60;
    setTimeLeft(workSeconds);
    setMaxTime(workSeconds);
  };

  const skipTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsRunning(false);
    
    // Logic similar to timer completion
    if (mode === "work") {
      const isLastRound = currentRound >= settings.rounds;
      const nextMode = isLastRound ? "longBreak" : "shortBreak";
      setMode(nextMode);
      
      const nextDuration = isLastRound 
        ? settings.longBreakTime * 60 
        : settings.shortBreakTime * 60;
      
      setTimeLeft(nextDuration);
      setMaxTime(nextDuration);
    } else {
      const nextRound = mode === "longBreak" ? 1 : currentRound + 1;
      setMode("work");
      setCurrentRound(nextRound);
      setTimeLeft(settings.workTime * 60);
      setMaxTime(settings.workTime * 60);
    }
  };

  const updateWorkTime = (time: number) => {
    setSettings(prev => ({ ...prev, workTime: time }));
  };

  const updateShortBreakTime = (time: number) => {
    setSettings(prev => ({ ...prev, shortBreakTime: time }));
  };

  const updateLongBreakTime = (time: number) => {
    setSettings(prev => ({ ...prev, longBreakTime: time }));
  };

  const updateRounds = (rounds: number) => {
    setSettings(prev => ({ ...prev, rounds }));
  };

  return (
    <TimerContext.Provider 
      value={{ 
        timeLeft,
        maxTime,
        isRunning,
        currentRound,
        totalRounds: settings.rounds,
        mode,
        settings,
        startTimer,
        resetTimer,
        skipTimer,
        updateWorkTime,
        updateShortBreakTime,
        updateLongBreakTime,
        updateRounds
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}