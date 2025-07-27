"use client";

import React from 'react';
import { EasyScaleLogoLarge } from '@/components/easyscale-logo-large';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Carregando" 
}) => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex flex-col items-center justify-center z-50 transition-colors">
      {/* Logo com animação sutil */}
      <div className="animate-pulse">
        <EasyScaleLogoLarge size="xl" />
      </div>
      
      {/* Texto de carregamento */}
      <div className="mt-8 flex flex-col items-center space-y-3">
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 tracking-wide">
          {message}
        </p>
        
        {/* Indicador de loading minimalista */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};