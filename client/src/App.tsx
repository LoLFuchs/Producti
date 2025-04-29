import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TimerProvider } from "./contexts/TimerContext";
import { TaskProvider } from "./contexts/TaskContext";
import { MusicProvider } from "./contexts/MusicContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TimerProvider>
          <TaskProvider>
            <MusicProvider>
              <TooltipProvider>
                <Toaster />
                <Router />
              </TooltipProvider>
            </MusicProvider>
          </TaskProvider>
        </TimerProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
