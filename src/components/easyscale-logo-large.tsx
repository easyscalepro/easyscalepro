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
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center justify-center`}>
      <div className="bg-blue-600 rounded-lg p-3 shadow-lg">
        <div className="text-white font-bold text-xl">ES</div>
      </div>
    </div>
  );
};