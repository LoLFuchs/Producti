import { useTimer } from "@/contexts/TimerContext";
import { formatTime, calculateProgress } from "@/lib/utils";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";

export function PomodoroTimer() {
  const {
    timeLeft,
    maxTime,
    isRunning,
    currentRound,
    totalRounds,
    mode,
    startTimer,
    resetTimer,
    skipTimer,
  } = useTimer();

  const progress = calculateProgress(timeLeft, maxTime);
  const circumference = 2 * Math.PI * 45; // 45 is the radius of the circle
  const dashoffset = circumference * (1 - progress);

  const modeText = mode === 'work' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-6">
      <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">
        Pomodoro Timer
      </h2>
      
      <div className="flex justify-center">
        <div className="relative h-60 w-60 flex items-center justify-center">
          <svg className="w-full h-full circular-progress" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              strokeWidth="5" 
              className="stroke-gray-200 dark:stroke-gray-700" 
            />
            {/* Progress Circle */}
            <motion.circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              strokeWidth="5" 
              strokeDasharray={circumference} 
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: dashoffset }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="stroke-primary" 
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-semibold">{formatTime(timeLeft)}</span>
            <span className="text-sm mt-1 text-gray-500 dark:text-gray-400">{modeText}</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center space-x-4">
        <button 
          onClick={startTimer}
          className="p-3 bg-primary hover:bg-primary/90 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
          aria-label={isRunning ? "Pause timer" : "Start timer"}
        >
          {isRunning ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </button>
        
        <button 
          onClick={resetTimer}
          className="p-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
          aria-label="Reset timer"
        >
          <RotateCcw className="h-6 w-6" />
        </button>
        
        <button 
          onClick={skipTimer}
          className="p-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
          aria-label="Skip to next timer"
        >
          <SkipForward className="h-6 w-6" />
        </button>
      </div>
      
      <div className="flex justify-center">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Round {currentRound} of {totalRounds}
        </div>
      </div>
    </div>
  );
}
