"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Users, TrendingUp, Clock } from 'lucide-react';

export const MinimalStats: React.FC = () => {
  const stats = [
    {
      title: 'Comandos',
      value: '1,247',
      icon: FileText,
      description: 'Disponíveis'
    },
    {
      title: 'Empresas',
      value: '2,847',
      icon: Users,
      description: 'Usando a plataforma'
    },
    {
      title: 'Efetividade',
      value: '94%',
      icon: TrendingUp,
      description: 'Taxa de sucesso'
    },
    {
      title: 'Economia',
      value: '156h',
      icon: Clock,
      description: 'Por mês/empresa'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border border-gray-200 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stat.value}
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                  {stat.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {stat.description}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};