"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Eye, TrendingUp, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface StatsData {
  totalUsers: number;
  totalCommands: number;
  totalViews: number;
  totalCopies: number;
}

export const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    totalCommands: 0,
    totalViews: 0,
    totalCopies: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        console.log('📊 Carregando estatísticas do dashboard...');

        // Buscar estatísticas em paralelo
        const [usersResult, commandsResult, viewsResult] = await Promise.all([
          // Total de usuários
          supabase
            .from('profiles')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'ativo'),
          
          // Total de comandos
          supabase
            .from('commands')
            .select('id', { count: 'exact', head: true })
            .eq('is_active', true),
          
          // Total de visualizações e cópias
          supabase
            .from('commands')
            .select('views, copies')
            .eq('is_active', true)
        ]);

        // Processar resultados
        const totalUsers = usersResult.count || 0;
        const totalCommands = commandsResult.count || 0;
        
        let totalViews = 0;
        let totalCopies = 0;
        
        if (viewsResult.data) {
          totalViews = viewsResult.data.reduce((sum, cmd) => sum + (cmd.views || 0), 0);
          totalCopies = viewsResult.data.reduce((sum, cmd) => sum + (cmd.copies || 0), 0);
        }

        setStats({
          totalUsers,
          totalCommands,
          totalViews,
          totalCopies
        });

        console.log('✅ Estatísticas carregadas:', {
          totalUsers,
          totalCommands,
          totalViews,
          totalCopies
        });

      } catch (error) {
        console.error('❌ Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const statsCards = [
    {
      title: 'Total de Usuários',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total de Comandos',
      value: stats.totalCommands,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total de Visualizações',
      value: stats.totalViews,
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Total de Cópias',
      value: stats.totalCopies,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-20">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0F1115]">
                {stat.value.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};