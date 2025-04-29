import { useTimer } from "@/contexts/TimerContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function TimerSettings() {
  const { 
    settings, 
    updateWorkTime, 
    updateShortBreakTime, 
    updateLongBreakTime, 
    updateRounds 
  } = useTimer();

  const handleWorkTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= 60) {
      updateWorkTime(value);
    }
  };

  const handleShortBreakChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= 30) {
      updateShortBreakTime(value);
    }
  };

  const handleLongBreakChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 5 && value <= 60) {
      updateLongBreakTime(value);
    }
  };

  const handleRoundsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= 10) {
      updateRounds(value);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-4">
      <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">
        Timer Settings
      </h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="work-time">Focus Time (minutes)</Label>
          <Input 
            type="number" 
            id="work-time" 
            min={1} 
            max={60}
            value={settings.workTime} 
            onChange={handleWorkTimeChange}
            className="mt-1 dark:bg-gray-700"
          />
        </div>
        
        <div>
          <Label htmlFor="short-break">Short Break (minutes)</Label>
          <Input 
            type="number" 
            id="short-break" 
            min={1} 
            max={30}
            value={settings.shortBreakTime} 
            onChange={handleShortBreakChange}
            className="mt-1 dark:bg-gray-700"
          />
        </div>
        
        <div>
          <Label htmlFor="long-break">Long Break (minutes)</Label>
          <Input 
            type="number" 
            id="long-break" 
            min={5} 
            max={60}
            value={settings.longBreakTime} 
            onChange={handleLongBreakChange}
            className="mt-1 dark:bg-gray-700"
          />
        </div>
        
        <div>
          <Label htmlFor="rounds">Rounds before Long Break</Label>
          <Input 
            type="number" 
            id="rounds" 
            min={1} 
            max={10}
            value={settings.rounds} 
            onChange={handleRoundsChange}
            className="mt-1 dark:bg-gray-700"
          />
        </div>
      </div>
    </div>
  );
}
