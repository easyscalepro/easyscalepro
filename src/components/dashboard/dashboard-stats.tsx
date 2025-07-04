"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Users, TrendingUp, Zap } from 'lucide-react';

export const DashboardStats: React.FC = () => {
  const stats = [
    {
      title: 'Comandos',
      value: '1,247',
      change: '+12 esta semana',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Usuários Ativos',
      value: '2,847',
      change: '+23% este mês',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Taxa de Sucesso',
      value: '94.2%',
      change: '+5.2% melhoria',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      title: 'Tempo Economizado',
      value: '156h',
      change: 'por usuário/mês',
      icon: Zap,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Icon className={`h-5 w-5 ${stat.color}`} />
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{stat.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.change}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};