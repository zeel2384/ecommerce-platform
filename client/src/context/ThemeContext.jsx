/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
    if (isDark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const theme = {
    isDark,
    toggleTheme,
    colors: {
      bg: "var(--bg)",
      surface: "var(--surface)",
      surface2: "var(--surface2)",
      border: "var(--border)",
      text: "var(--text)",
      textSecondary: "var(--text-secondary)",
      textMuted: "var(--text-muted)",
      primary: "#6366f1",
      success: "#22c55e",
      danger: "#ef4444",
      warning: "#f59e0b",
    },
  };

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
