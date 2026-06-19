"use client";

import { useEffect } from "react";

export default function ThemeInitializer() {
  useEffect(() => {
    try {
      const storedTheme = window.localStorage.getItem("theme");
      if (storedTheme === "dark") {
        document.documentElement.classList.add("dark");
      }
    } catch (error) {
      // ignore on older browsers or no localStorage access
    }
  }, []);

  return null;
}
