"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from './auth-provider';
import { useRouter, usePathname } from 'next/navigation';
import { Shield, Lock, AlertTriangle } from 'lucide-react';
import { EnhancedLoadingScreen } from '@/components/ui/enhanced-loading-screen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  fallback 
}) => {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [checkComplete, setCheckComplete] = useState(false);

  useEffect(() => {
    // Timeout de segurança para evitar loading infinito
    const safetyTimeout = setTimeout(() => {
      console.log('⏰ ProtectedRoute: Timeout de segurança - finalizando verificação');
      setCheckComplete(true);
    }, 8000); // 8 segundos máximo

    // Aguardar o AuthProvider terminar de carregar
    if (!loading) {
      console.log('🔍 ProtectedRoute: AuthProvider terminou, verificando acesso...');
      
      // Pequeno delay para garantir que o estado está estável
      setTimeout(() => {
        if (!user) {
          console.log('🔄 Redirecionando para login - usuário não autenticado');
          router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
          return;
        }

        if (profile && profile.status !== 'ativo') {
          console.log('🚫 Usuário com status inativo:', profile.status);
          router.push('/login?error=account_suspended');
          return;
        }

        if (requireAdmin && profile && profile.role !== 'admin') {
          console.log('🚫 Acesso negado - requer admin');
          router.push('/dashboard?error=access_denied');
          return;
        }

        // Tudo OK
        console.log('✅ ProtectedRoute: Acesso autorizado');
        setCheckComplete(true);
        clearTimeout(safetyTimeout);
      }, 500);
    }

    return () => {
      clearTimeout(safetyTimeout);
    };
  }, [user, profile, loading, router, pathname, requireAdmin]);

  // Mostrar loading aprimorado enquanto verifica autenticação
  if (loading || !checkComplete) {
    return fallback || <EnhancedLoadingScreen message="Validando autenticação" />;
  }

  // Usuário não logado
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 flex items-center justify-center">
        <div className="text-center space-y-6 p-8 max-w-md">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Acesso Restrito
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Você precisa estar logado para acessar esta página.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Ir para Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Usuário suspenso ou inativo
  if (profile && profile.status !== 'ativo') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-800/20 flex items-center justify-center">
        <div className="text-center space-y-6 p-8 max-w-md">
          <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <AlertTriangle className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Conta {profile.status === 'suspenso' ? 'Suspensa' : 'Inativa'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {profile.status === 'suspenso' 
                ? 'Sua conta foi suspensa. Entre em contato com o suporte.'
                : 'Sua conta está inativa. Entre em contato com o suporte.'
              }
            </p>
            <button
              onClick={() => router.push('/login')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Voltar ao Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Acesso negado para admin
  if (requireAdmin && profile && profile.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 flex items-center justify-center">
        <div className="text-center space-y-6 p-8 max-w-md">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Shield className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Acesso Negado
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Esta seção é restrita a administradores.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tudo OK - renderizar conteúdo
  return <>{children}</>;
};