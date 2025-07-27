"use client";

import React from 'react';
import { EasyScaleLogoLarge } from '@/components/easyscale-logo-large';

interface PageLoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PageLoading: React.FC<PageLoadingProps> = ({ 
  message = "Carregando",
  size = 'lg'
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      {/* Logo com animação sutil */}
      <div className="animate-pulse">
        <EasyScaleLogoLarge size={size} />
      </div>
      
      {/* Texto de carregamento */}
      <div className="flex flex-col items-center space-y-3">
        <p className="text-base font-medium text-gray-600 dark:text-gray-400 tracking-wide">
          {message}
        </p>
        
        {/* Indicador de loading minimalista */}
        <div className="flex space-x-1">
          <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};