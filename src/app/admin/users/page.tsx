"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/admin-layout';
import { UserManagementDashboard } from '@/components/admin/user-management-dashboard';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // Timeout de segurança para evitar loading infinito
    const safetyTimeout = setTimeout(() => {
      console.log('⏰ Timeout de segurança - forçando inicialização');
      setIsInitialized(true);
    }, 5000); // 5 segundos máximo

    const checkAuth = () => {
      console.log('🔍 Verificando auth na página admin/users:', { 
        user: !!user, 
        profile: !!profile, 
        loading, 
        role: profile?.role 
      });

      // Se ainda está carregando, aguardar
      if (loading) {
        console.log('⏳ Ainda carregando auth...');
        return;
      }

      // Se não há usuário, redirecionar para login
      if (!user) {
        console.log('❌ Usuário não autenticado, redirecionando...');
        router.push('/login');
        return;
      }

      // Se não há perfil ou não é admin, mostrar erro e redirecionar
      if (!profile || profile.role !== 'admin') {
        console.log('❌ Usuário não é admin:', profile?.role);
        toast.error('Acesso negado. Apenas administradores podem acessar esta página.');
        router.push('/dashboard');
        return;
      }

      // Tudo OK, inicializar página
      console.log('✅ Usuário admin autenticado, inicializando página');
      setIsInitialized(true);
      clearTimeout(safetyTimeout);
    };

    // Verificar imediatamente
    checkAuth();

    // Verificar novamente após um pequeno delay para casos edge
    timeoutId = setTimeout(checkAuth, 1000);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(safetyTimeout);
    };
  }, [user, profile, loading, router]);

  // Loading state
  if (loading || !isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
            <div className="absolute inset-0 rounded-full border-2 border-gray-200 dark:border-gray-700"></div>
          </div>
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              {loading ? 'Verificando autenticação...' : 'Carregando painel administrativo...'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Aguarde um momento
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Se chegou até aqui, usuário está autenticado e é admin
  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0F1115] dark:text-white mb-2">
            Gerenciamento de Usuários
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie todos os usuários cadastrados na plataforma
          </p>
        </div>

        <UserManagementDashboard />
      </div>
    </AdminLayout>
  );
}