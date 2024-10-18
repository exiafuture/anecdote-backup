"use client";

import { useEffect } from "react";
import { ThemeProvider } from "./themeContext";

const ThemeProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const currentTheme = localStorage.getItem("liferunnertheme");
    if (currentTheme) {
      document.documentElement.setAttribute("liferunnertheme", currentTheme);
    }
  }, []);

  return <ThemeProvider>{children}</ThemeProvider>;
};

export default ThemeProviderWrapper;
