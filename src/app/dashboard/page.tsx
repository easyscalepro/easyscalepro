"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useRouter } from 'next/navigation';
import { LoadingScreen } from '@/components/loading-screen';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Command, 
  Activity, 
  TrendingUp,
  UserPlus,
  Settings,
  BarChart3,
  Zap
} from 'lucide-react';

export default function DashboardPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);

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

  // Simular carregamento de dados
  useEffect(() => {
    if (!pageLoading) {
      const timer = setTimeout(() => {
        setDataLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [pageLoading]);

  if (loading || pageLoading) {
    return (
      <LoadingScreen 
        message="Carregando dashboard..."
        submessage="Preparando sua área de trabalho"
      />
    );
  }

  if (!user) {
    return null;
  }

  if (dataLoading) {
    return (
      <LoadingScreen 
        message="Carregando dados..."
        submessage="Buscando informações atualizadas"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0F1115] mb-2">
            Bem-vindo, {profile?.name || 'Usuário'}!
          </h1>
          <p className="text-gray-600">
            Aqui está um resumo da sua atividade na plataforma EasyScale
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Command className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#0F1115]">
                    {profile?.commands_used || 0}
                  </div>
                  <div className="text-sm text-gray-600">Comandos Usados</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#0F1115]">+15%</div>
                  <div className="text-sm text-gray-600">Crescimento</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#0F1115]">Ativo</div>
                  <div className="text-sm text-gray-600">Status</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#0F1115]">Pro</div>
                  <div className="text-sm text-gray-600">Plano</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Command className="h-5 w-5 text-[#2563EB]" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={() => router.push('/commands')}
                  className="h-20 bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0F1115] flex-col"
                >
                  <Command className="h-6 w-6 mb-2" />
                  Comandos
                </Button>
                
                {profile?.role === 'admin' && (
                  <Button 
                    onClick={() => router.push('/admin/users')}
                    variant="outline"
                    className="h-20 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white flex-col"
                  >
                    <Users className="h-6 w-6 mb-2" />
                    Usuários
                  </Button>
                )}
                
                <Button 
                  onClick={() => router.push('/analytics')}
                  variant="outline"
                  className="h-20 border-gray-300 text-gray-600 hover:bg-gray-50 flex-col"
                >
                  <BarChart3 className="h-6 w-6 mb-2" />
                  Analytics
                </Button>
                
                <Button 
                  onClick={() => router.push('/settings')}
                  variant="outline"
                  className="h-20 border-gray-300 text-gray-600 hover:bg-gray-50 flex-col"
                >
                  <Settings className="h-6 w-6 mb-2" />
                  Configurações
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#2563EB]" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Login realizado</div>
                    <div className="text-xs text-gray-500">Agora</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Comando executado</div>
                    <div className="text-xs text-gray-500">2 horas atrás</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Perfil atualizado</div>
                    <div className="text-xs text-gray-500">1 dia atrás</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Message */}
        <Card className="border-gray-200 bg-gradient-to-r from-[#2563EB] to-[#1d4ed8] text-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Pronto para aumentar sua produtividade?
                </h2>
                <p className="text-blue-100 mb-4">
                  Explore nossos comandos especializados e transforme seu negócio
                </p>
                <Button 
                  onClick={() => router.push('/commands')}
                  className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0F1115]"
                >
                  Explorar Comandos
                </Button>
              </div>
              <div className="hidden md:block">
                <Command className="h-24 w-24 text-blue-200" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}