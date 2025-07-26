"use client";

import React from 'react';

interface EasyScaleLogoLargeProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const EasyScaleLogoLarge: React.FC<EasyScaleLogoLargeProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-24 h-8',
    md: 'w-32 h-10',
    lg: 'w-40 h-12',
    xl: 'w-48 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center justify-center`}>
      <div className="flex items-center space-x-2">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2">
          <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
            <span className="text-blue-600 font-bold text-sm">E</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
            EasyScale
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
            ChatGPT Commands
          </span>
        </div>
      </div>
    </div>
  );
};