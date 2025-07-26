"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    console.log('Mudando tema para:', newTheme);
    setTheme(newTheme);
  };

  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-9 h-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="h-4 w-4" />
        <span className="sr-only">Alternar tema</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-9 h-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
        >
          {resolvedTheme === 'dark' ? (
            <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors" />
          ) : (
            <Sun className="h-4 w-4 text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors" />
          )}
          <span className="sr-only">Alternar tema</span>
          
          {/* Glow effect */}
          <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10"></div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-40 z-[9999] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
        sideOffset={5}
      >
        <DropdownMenuItem 
          onClick={() => handleThemeChange("light")}
          className="cursor-pointer flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700"
        >
          <Sun className="h-4 w-4" />
          <span>Claro</span>
          {theme === 'light' && <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange("dark")}
          className="cursor-pointer flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700"
        >
          <Moon className="h-4 w-4" />
          <span>Escuro</span>
          {theme === 'dark' && <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange("system")}
          className="cursor-pointer flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700"
        >
          <Monitor className="h-4 w-4" />
          <span>Sistema</span>
          {theme === 'system' && <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}