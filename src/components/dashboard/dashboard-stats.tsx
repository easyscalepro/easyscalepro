"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Users, Target, Clock } from 'lucide-react';

export const DashboardStats: React.FC = () => {
  const stats = [
    {
      title: 'Comandos Disponíveis',
      value: '1,247',
      change: '+12 esta semana',
      icon: FileText,
      gradient: 'from-blue-600 to-blue-700',
      bgGradient: 'from-blue-500/10 to-blue-600/10',
      borderColor: 'border-blue-500/20'
    },
    {
      title: 'Usuários Ativos',
      value: '2,847',
      change: '+23% este mês',
      icon: Users,
      gradient: 'from-green-600 to-green-700',
      bgGradient: 'from-green-500/10 to-green-600/10',
      borderColor: 'border-green-500/20'
    },
    {
      title: 'Taxa de Sucesso',
      value: '94.2%',
      change: '+5.2% melhoria',
      icon: Target,
      gradient: 'from-yellow-500 to-yellow-600',
      bgGradient: 'from-yellow-500/10 to-yellow-600/10',
      borderColor: 'border-yellow-500/20'
    },
    {
      title: 'Tempo Economizado',
      value: '156h',
      change: 'por usuário/mês',
      icon: Clock,
      gradient: 'from-purple-600 to-purple-700',
      bgGradient: 'from-purple-500/10 to-purple-600/10',
      borderColor: 'border-purple-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={index} 
            className={`group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm border ${stat.borderColor}`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900 group-hover:scale-105 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-600 font-medium mt-1">
                    {stat.change}
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                {stat.title}
              </h3>
              
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/10 to-transparent rounded-full translate-y-8 -translate-x-8"></div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};