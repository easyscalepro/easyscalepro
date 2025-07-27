"use client";

import React from 'react';
import { Sparkles, Zap } from 'lucide-react';
import Image from 'next/image';

interface EnhancedLoadingScreenProps {
  message?: string;
}

export const EnhancedLoadingScreen: React.FC<EnhancedLoadingScreenProps> = ({ 
  message = "Carregando" 
}) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center justify-center z-50 transition-all duration-500">
      {/* Background animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-blue-600/5 animate-pulse"></div>
      
      {/* Enhanced logo container */}
      <div className="relative mb-8">
        {/* Outer glow ring */}
        <div className="absolute inset-0 w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
        
        {/* Middle glow ring */}
        <div className="absolute inset-2 w-28 h-28 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-30 animate-ping"></div>
        
        {/* Logo container with enhanced effects */}
        <div className="relative w-24 h-24 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl group animate-bounce">
          {/* Company logo image */}
          <div className="relative w-20 h-20">
            <Image
              src="https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png"
              alt="EasyScale Logo"
              fill
              className="object-contain rounded-xl filter drop-shadow-lg"
              sizes="80px"
              priority
            />
          </div>
          
          {/* Animated decorative elements */}
          <div className="absolute top-2 right-2 w-3 h-3 bg-white/60 rounded-full animate-pulse"></div>
          <div className="absolute bottom-2 left-2 w-2 h-2 bg-white/40 rounded-full animate-pulse delay-300"></div>
          
          {/* Inner glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 opacity-50 blur-lg animate-pulse"></div>
          
          {/* Rotating border */}
          <div className="absolute inset-0 rounded-2xl border-2 border-white/30 animate-spin" style={{ animationDuration: '3s' }}></div>
        </div>
        
        {/* Floating sparkles */}
        <div className="absolute -top-4 -right-4 animate-bounce delay-100">
          <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
        </div>
        <div className="absolute -bottom-4 -left-4 animate-bounce delay-500">
          <Zap className="h-5 w-5 text-blue-400 animate-pulse" />
        </div>
        <div className="absolute top-0 -left-6 animate-bounce delay-700">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
        </div>
        <div className="absolute -top-2 right-0 animate-bounce delay-1000">
          <div className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-ping"></div>
        </div>
      </div>
      
      {/* Enhanced brand text */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-4xl font-black text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text animate-pulse">
          EasyScale
        </h1>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-[0.2em] uppercase opacity-80">
          AI Powered
        </p>
      </div>
      
      {/* Loading message and indicator */}
      <div className="flex flex-col items-center space-y-4">
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 tracking-wide">
          {message}
        </p>
        
        {/* Enhanced loading dots */}
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce shadow-lg"></div>
          <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.2s' }}></div>
        </div>
        
        {/* Progress bar */}
        <div className="w-48 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-40 delay-1000"></div>
        <div className="absolute top-1/2 left-1/6 w-0.5 h-0.5 bg-blue-300 rounded-full animate-ping opacity-80 delay-500"></div>
        <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-purple-300 rounded-full animate-ping opacity-50 delay-1500"></div>
      </div>
    </div>
  );
};