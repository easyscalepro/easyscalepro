"use client";

import React from 'react';
import { Sparkles, Zap } from 'lucide-react';
import Image from 'next/image';

interface PageLoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PageLoading: React.FC<PageLoadingProps> = ({ 
  message = "Carregando",
  size = 'md'
}) => {
  const sizeClasses = {
    sm: { container: 'w-12 h-12', image: 'w-10 h-10', text: 'text-sm', title: 'text-lg' },
    md: { container: 'w-16 h-16', image: 'w-14 h-14', text: 'text-base', title: 'text-xl' },
    lg: { container: 'w-20 h-20', image: 'w-18 h-18', text: 'text-lg', title: 'text-2xl' }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 relative">
      {/* Background subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-purple-50/20 to-blue-50/30 dark:from-gray-800/30 dark:via-gray-700/20 dark:to-gray-800/30 rounded-lg"></div>
      
      {/* Enhanced logo container */}
      <div className="relative">
        {/* Glow effect */}
        <div className={`absolute inset-0 ${currentSize.container} bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-lg opacity-20 animate-pulse`}></div>
        
        {/* Logo container */}
        <div className={`relative ${currentSize.container} bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-xl flex items-center justify-center shadow-xl animate-pulse`}>
          {/* Company logo image */}
          <div className={`relative ${currentSize.image}`}>
            <Image
              src="https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png"
              alt="EasyScale Logo"
              fill
              className="object-contain rounded-lg filter drop-shadow-md"
              sizes={size === 'lg' ? '80px' : size === 'md' ? '64px' : '48px'}
              priority
            />
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-1 right-1 w-2 h-2 bg-white/50 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse delay-300"></div>
        </div>
        
        {/* Floating sparkles */}
        {size === 'lg' && (
          <>
            <div className="absolute -top-2 -right-2 animate-bounce delay-100">
              <Sparkles className="h-3 w-3 text-amber-400 animate-pulse" />
            </div>
            <div className="absolute -bottom-2 -left-2 animate-bounce delay-500">
              <Zap className="h-3 w-3 text-blue-400 animate-pulse" />
            </div>
          </>
        )}
      </div>
      
      {/* Brand text */}
      <div className="text-center space-y-1">
        <h2 className={`${currentSize.title} font-black text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text animate-pulse`}>
          EasyScale
        </h2>
        {size === 'lg' && (
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase opacity-80">
            AI Powered
          </p>
        )}
      </div>
      
      {/* Loading message and indicator */}
      <div className="flex flex-col items-center space-y-3">
        <p className={`${currentSize.text} font-medium text-gray-600 dark:text-gray-400 tracking-wide`}>
          {message}
        </p>
        
        {/* Loading dots */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};