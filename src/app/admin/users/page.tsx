"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/admin-layout';
import { UserManagementDashboard } from '@/components/admin/user-management-dashboard';
import { LoadingScreen } from '@/components/loading-screen';

export default function AdminUsersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Simular carregamento da página
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading || pageLoading) {
    return (
      <LoadingScreen 
        message="Carregando área de usuários..."
        submessage="Preparando o painel de gerenciamento"
      />
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0F1115] mb-2">
            Gerenciamento de Usuários
          </h1>
          <p className="text-gray-600">
            Gerencie todos os usuários cadastrados na plataforma
          </p>
        </div>

        <UserManagementDashboard />
      </div>
    </AdminLayout>
  );
}