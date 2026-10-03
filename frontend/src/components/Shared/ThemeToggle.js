"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  const cycleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const Icon = isDark ? Moon : Sun;

  return (
    <button
      onClick={cycleTheme}
      aria-label="Toggle theme"
      className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer shadow-sm"
      title={`Theme: ${isDark ? "dark" : "light"}`}
    >
      <Icon className="w-4 h-4 transition-transform duration-300" />
    </button>
  );
}
