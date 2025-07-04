import React from 'react';
import { Sparkles, Zap } from 'lucide-react';
import Image from 'next/image';

export const EasyScaleLogo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-3 ${className} group`}>
      {/* Enhanced logo icon with company logo */}
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 overflow-hidden">
          {/* Company logo image */}
          <div className="relative w-8 h-8">
            <Image
              src="https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png"
              alt="EasyScale Logo"
              fill
              className="object-contain rounded-lg"
              sizes="32px"
              priority
            />
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-1 right-1 w-2 h-2 bg-white/40 rounded-full"></div>
          <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-white/30 rounded-full"></div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300"></div>
          
          {/* Pulse ring */}
          <div className="absolute inset-0 rounded-xl border-2 border-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"></div>
        </div>
        
        {/* Floating sparkles */}
        <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Sparkles className="h-3 w-3 text-amber-400 animate-pulse" />
        </div>
        <div className="absolute -bottom-1 -left-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
          <Zap className="h-3 w-3 text-blue-400 animate-pulse" />
        </div>
      </div>
      
      {/* Enhanced text */}
      <div className="flex flex-col">
        <span className="text-2xl font-black text-[#0F1115] dark:text-gray-100 tracking-tight group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
          EasyScale
        </span>
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          AI POWERED
        </span>
      </div>
      
      {/* Subtle background glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
    </div>
  );
};