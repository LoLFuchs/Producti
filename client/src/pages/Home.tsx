import { Header } from "@/components/Header";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { TimerSettings } from "@/components/TimerSettings";
import { MusicPlayer } from "@/components/MusicPlayer";
import { TaskInput } from "@/components/TaskInput";
import { TaskList } from "@/components/TaskList";
import { TaskAnalytics } from "@/components/TaskAnalytics";
import { AddGroupModal } from "@/components/AddGroupModal";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Pomodoro Timer, Settings, Music */}
          <div className="lg:col-span-1 space-y-6">
            <PomodoroTimer />
            <TimerSettings />
            <MusicPlayer />
          </div>
          
          {/* Right Column - Task List, Analytics */}
          <div className="lg:col-span-2 space-y-6">
            <TaskInput />
            <TaskList />
            <TaskAnalytics />
          </div>
        </div>
      </main>
      
      {/* Modals */}
      <AddGroupModal />
    </div>
  );
}
