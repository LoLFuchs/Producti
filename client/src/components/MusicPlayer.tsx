import { useMusic } from "@/contexts/MusicContext";
import { Play, Pause } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export function MusicPlayer() {
  const { 
    isPlaying, 
    toggleMusic, 
    volume, 
    adjustVolume, 
    currentTrackName 
  } = useMusic();

  const handleVolumeChange = (value: number[]) => {
    adjustVolume(value[0]);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-4">
      <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">
        LoFi Music
      </h2>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleMusic}
          className="p-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </button>
        
        <div className="flex-1">
          <Label htmlFor="volume" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Volume
          </Label>
          <Slider
            id="volume"
            min={0}
            max={100}
            step={1}
            value={[volume]}
            onValueChange={handleVolumeChange}
            className="w-full"
            aria-label="Adjust volume"
          />
        </div>
      </div>
      
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Now Playing: <span>{currentTrackName}</span>
      </div>
    </div>
  );
}
