"use client";

import React, { useEffect } from 'react';
import { useAuth } from './auth-provider';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2, Shield, Lock } from 'lucide-react';

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
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Verificando autenticação...
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Aguarde enquanto validamos seu acesso
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Usuário não logado
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Acesso Restrito
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Você precisa estar logado para acessar esta página
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Usuário suspenso ou inativo
  if (profile && profile.status !== 'ativo') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-800/20 flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Conta {profile.status === 'suspenso' ? 'Suspensa' : 'Inativa'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Entre em contato com o suporte para reativar sua conta
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Acesso negado para admin
  if (requireAdmin && profile && profile.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Acesso Negado
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Você não tem permissão para acessar esta área
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Tudo OK - renderizar conteúdo
  return <>{children}</>;
};