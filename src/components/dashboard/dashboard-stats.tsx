"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Users, TrendingUp, Zap } from 'lucide-react';

export const DashboardStats: React.FC = () => {
  const stats = [
    {
      title: 'Comandos Disponíveis',
      value: '1,247',
      change: '+12 esta semana',
      icon: FileText,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Usuários Ativos',
      value: '2,847',
      change: '+23% este mês',
      icon: Users,
      color: 'green',
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'Taxa de Sucesso',
      value: '94.2%',
      change: '+5.2% melhoria',
      icon: TrendingUp,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Tempo Economizado',
      value: '156h',
      change: 'por usuário/mês',
      icon: Zap,
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm hover:bg-slate-800/80 transition-all duration-300 hover:border-slate-600/50 hover:shadow-lg hover:shadow-blue-500/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-slate-400 font-medium">{stat.change}</div>
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-300">{stat.title}</h3>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};