"use client";

import { useEffect, useState } from "react";

export default function ThemeProvider() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      const prefersDark =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

      const theme = stored || (prefersDark ? "dark" : "light");

      if (theme === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    } catch (e) {
      // ignore
    }
    setMounted(true);
  }, []);

  // This component only ensures the correct class is set on first mount.
  if (!mounted) return null;
  return null;
}
