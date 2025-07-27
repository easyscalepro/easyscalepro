"use client";

import React, { useState, useEffect, createContext, useContext } from 'react';
import { EnhancedLoadingScreen } from '@/components/ui/enhanced-loading-screen';

interface AppLoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AppLoadingContext = createContext<AppLoadingContextType | undefined>(undefined);

export const useAppLoading = () => {
  const context = useContext(AppLoadingContext);
  if (!context) {
    throw new Error('useAppLoading must be used within AppLoadingProvider');
  }
  return context;
};

interface AppLoadingProviderProps {
  children: React.ReactNode;
}

export const AppLoadingProvider: React.FC<AppLoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Simular tempo de carregamento inicial mais realista
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Marcar como hidratado
    setIsHydrated(true);

    return () => clearTimeout(timer);
  }, []);

  // Mostrar loading aprimorado durante a hidratação ou quando explicitamente definido
  if (!isHydrated || isLoading) {
    return <EnhancedLoadingScreen message="Inicializando aplicação" />;
  }

  return (
    <AppLoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </AppLoadingContext.Provider>
  );
};