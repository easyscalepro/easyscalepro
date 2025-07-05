"use client";

import React, { useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/admin-layout';
import { SettingsPanel } from '@/components/admin/settings-panel';
import { PasswordPolicySettings } from '@/components/admin/password-policy-settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminSettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
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
            Configurações do Sistema
          </h1>
          <p className="text-gray-600">
            Gerencie as configurações gerais da plataforma
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">Configurações Gerais</TabsTrigger>
            <TabsTrigger value="password">Políticas de Senha</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <SettingsPanel />
          </TabsContent>
          
          <TabsContent value="password">
            <PasswordPolicySettings />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}