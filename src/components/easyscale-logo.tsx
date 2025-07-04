import React from 'react';

export const EasyScaleLogo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-sm">ES</span>
      </div>
      <span className="text-xl font-bold text-gray-900 dark:text-gray-100">EasyScale</span>
    </div>
  );
};