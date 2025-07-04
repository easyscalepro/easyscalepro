"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Users, TrendingUp, Clock } from 'lucide-react';

export const ProfessionalStats: React.FC = () => {
  const stats = [
    {
      title: 'Comandos Disponíveis',
      value: '1,247',
      change: '+12 esta semana',
      icon: FileText,
      description: 'Prompts especializados'
    },
    {
      title: 'Empresários Ativos',
      value: '2,847',
      change: '+23% este mês',
      icon: Users,
      description: 'Utilizando a plataforma'
    },
    {
      title: 'Taxa de Efetividade',
      value: '94.2%',
      change: '+5.2% melhoria',
      icon: TrendingUp,
      description: 'Resultados positivos'
    },
    {
      title: 'Tempo Economizado',
      value: '156h',
      change: 'por empresa/mês',
      icon: Clock,
      description: 'Produtividade aumentada'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={index} 
            className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white dark:bg-gray-800"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stat.value}
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {stat.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stat.description}
                </p>
                <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
                  <TrendingUp className="h-3 w-3" />
                  {stat.change}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};