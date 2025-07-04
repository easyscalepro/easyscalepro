import React from 'react';

export const EasyScaleLogo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-yellow-400 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-sm">ES</span>
      </div>
      <span className="text-2xl font-bold text-[#0F1115]">EasyScale</span>
    </div>
  );
};