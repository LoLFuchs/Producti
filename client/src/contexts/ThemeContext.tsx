import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

// Create context with an empty default value
const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
  toggleTheme: () => {}
});

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Default to light theme on the server
    if (typeof window === "undefined") return "light";
    
    // Check localStorage first
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      return savedTheme as Theme;
    }
    
    // Otherwise use system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches 
      ? "dark" 
      : "light";
  });

  // Effect to update the DOM when theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Save to localStorage
    localStorage.setItem("theme", theme);
    
    // Update document class
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"));
  };

  // Provide the context value to children
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}