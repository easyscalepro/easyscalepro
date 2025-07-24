"use client";

import React from 'react';
import Image from 'next/image';

interface LoadingScreenProps {
  message?: string;
  submessage?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Verificando autenticação...",
  submessage = "Aguarde enquanto validamos suas credenciais"
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1115] via-[#1a1f2e] to-[#2563EB] flex items-center justify-center p-4">
      <div className="text-center space-y-6 p-8 lasy-highlight">
        {/* Logo Animada */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Logo principal com animação */}
            <div className="w-24 h-24 relative">
              <Image
                src="https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png"
                alt="EasyScale Logo"
                fill
                className="object-contain animate-pulse"
                sizes="96px"
                priority
              />
            </div>
            
            {/* Anel de loading ao redor da logo */}
            <div className="absolute inset-0 w-24 h-24">
              <div className="w-full h-full border-4 border-transparent border-t-[#FBBF24] border-r-[#FBBF24] rounded-full animate-spin"></div>
            </div>
            
            {/* Segundo anel para efeito duplo */}
            <div className="absolute inset-2 w-20 h-20">
              <div className="w-full h-full border-2 border-transparent border-b-blue-400 border-l-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            
            {/* Pontos orbitais */}
            <div className="absolute inset-0 w-24 h-24 animate-spin" style={{ animationDuration: '3s' }}>
              <div className="absolute top-0 left-1/2 w-2 h-2 bg-[#FBBF24] rounded-full transform -translate-x-1/2 -translate-y-1"></div>
              <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-blue-400 rounded-full transform -translate-x-1/2 translate-y-1"></div>
            </div>
          </div>
        </div>

        {/* Texto principal */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">
            {message}
          </h2>
          <p className="text-blue-200 text-lg">
            {submessage}
          </p>
        </div>

        {/* Barra de progresso animada */}
        <div className="w-64 mx-auto">
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#FBBF24] to-blue-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Pontos de loading */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-[#FBBF24] rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-[#FBBF24] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-[#FBBF24] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>

        {/* Texto adicional */}
        <div className="text-blue-300 text-sm opacity-75">
          <p>Conectando com segurança...</p>
        </div>
      </div>
    </div>
  );
};