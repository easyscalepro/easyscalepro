"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggleDebug() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    console.log('Mudando tema para:', newTheme);
    setTheme(newTheme);
    setIsOpen(false);
  };

  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-9 h-9 p-0"
      >
        <div className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-9 h-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onClick={() => {
          console.log('Toggle clicked, current state:', isOpen);
          setIsOpen(!isOpen);
        }}
      >
        {resolvedTheme === 'dark' ? (
          <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        ) : (
          <Sun className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        )}
        <span className="sr-only">Alternar tema</span>
      </Button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-[9999]">
          <div className="py-1">
            <button
              onClick={() => handleThemeChange("light")}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <Sun className="h-4 w-4" />
              <span>Claro</span>
              {theme === 'light' && <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>}
            </button>
            <button
              onClick={() => handleThemeChange("dark")}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <Moon className="h-4 w-4" />
              <span>Escuro</span>
              {theme === 'dark' && <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>}
            </button>
            <button
              onClick={() => handleThemeChange("system")}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <Monitor className="h-4 w-4" />
              <span>Sistema</span>
              {theme === 'system' && <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>}
            </button>
          </div>
        </div>
      )}
      
      {/* Overlay para fechar o dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9998]" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}