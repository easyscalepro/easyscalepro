"use client";

import React from 'react';
import { EnhancedLoadingScreen } from '@/components/ui/enhanced-loading-screen';

interface AuthLoadingProps {
  message?: string;
  type?: 'login' | 'signup' | 'validation' | 'logout';
}

export const AuthLoading: React.FC<AuthLoadingProps> = ({ 
  message,
  type = 'validation'
}) => {
  const getDefaultMessage = () => {
    switch (type) {
      case 'login':
        return 'Fazendo login';
      case 'signup':
        return 'Criando conta';
      case 'logout':
        return 'Saindo da conta';
      case 'validation':
      default:
        return 'Validando autenticação';
    }
  };

  return (
    <EnhancedLoadingScreen 
      message={message || getDefaultMessage()} 
    />
  );
};