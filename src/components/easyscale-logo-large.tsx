import React from 'react';
import { Sparkles, Zap } from 'lucide-react';
import Image from 'next/image';

interface EasyScaleLogoLargeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const EasyScaleLogoLarge: React.FC<EasyScaleLogoLargeProps> = ({ 
  className = "", 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: { container: 'w-8 h-8', image: 'w-6 h-6', text: 'text-lg' },
    md: { container: 'w-12 h-12', image: 'w-10 h-10', text: 'text-2xl' },
    lg: { container: 'w-16 h-16', image: 'w-14 h-14', text: 'text-3xl' },
    xl: { container: 'w-20 h-20', image: 'w-18 h-18', text: 'text-4xl' }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-center gap-4 ${className} group`}>
      {/* Enhanced logo icon with company logo */}
      <div className="relative">
        <div className={`${currentSize.container} bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 overflow-hidden`}>
          {/* Company logo image */}
          <div className={`relative ${currentSize.image}`}>
            <Image
              src="https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751663753020-y59b2eo6q.jpeg"
              alt="EasyScale Logo"
              fill
              className="object-contain rounded-xl"
              sizes={size === 'xl' ? '80px' : size === 'lg' ? '64px' : size === 'md' ? '48px' : '32px'}
              priority
            />
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-2 right-2 w-3 h-3 bg-white/40 rounded-full"></div>
          <div className="absolute bottom-2 left-2 w-2 h-2 bg-white/30 rounded-full"></div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 opacity-0 group-hover:opacity-50 blur-2xl transition-opacity duration-300"></div>
          
          {/* Pulse ring */}
          <div className="absolute inset-0 rounded-2xl border-3 border-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"></div>
        </div>
        
        {/* Floating sparkles */}
        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
        </div>
        <div className="absolute -bottom-2 -left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
          <Zap className="h-4 w-4 text-blue-400 animate-pulse" />
        </div>
      </div>
      
      {/* Enhanced text */}
      <div className="flex flex-col">
        <span className={`${currentSize.text} font-black text-[#0F1115] dark:text-gray-100 tracking-tight group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300`}>
          EasyScale
        </span>
        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          AI POWERED
        </span>
      </div>
      
      {/* Subtle background glow */}
      <div className="absolute -inset-6 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"></div>
    </div>
  );
};