"use client";

import React, { useEffect } from 'react';
import { useAuth } from './auth-provider';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2, Shield, Lock, AlertTriangle } from 'lucide-react';

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

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Usuário não logado - redirecionar para login
        console.log('Usuário não logado, redirecionando para login');
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      if (profile && profile.status !== 'ativo') {
        // Usuário suspenso ou inativo
        console.log('Usuário com status inativo:', profile.status);
        router.push('/login?error=account_suspended');
        return;
      }

      if (requireAdmin && profile && profile.role !== 'admin') {
        // Rota requer admin mas usuário não é admin
        console.log('Acesso negado - requer admin');
        router.push('/dashboard?error=access_denied');
        return;
      }
    }
  }, [user, profile, loading, router, pathname, requireAdmin]);

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center space-y-6 p-8">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Verificando autenticação...
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              Aguarde enquanto validamos seu acesso e carregamos suas informações
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-100"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Usuário não logado
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 flex items-center justify-center">
        <div className="text-center space-y-6 p-8 max-w-md">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Acesso Restrito
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Você precisa estar logado para acessar esta página. Faça login para continuar.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
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
                ? 'Sua conta foi suspensa. Entre em contato com o suporte para reativação.'
                : 'Sua conta está inativa. Entre em contato com o suporte para ativação.'
              }
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => router.push('/login')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Voltar ao Login
              </button>
              <button
                onClick={() => window.location.href = 'mailto:suporte@easyscale.com'}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Contatar Suporte
              </button>
            </div>
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
              Você não tem permissão para acessar esta área. Esta seção é restrita a administradores.
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