"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Eye, Copy } from 'lucide-react';
import { useCommands } from '@/contexts/commands-context';

export const DashboardStats: React.FC = () => {
  const { commands } = useCommands();
  
  const totalViews = commands.reduce((sum, cmd) => sum + cmd.views, 0);
  const totalCopies = commands.reduce((sum, cmd) => sum + cmd.copies, 0);
  
  const stats = [
    {
      title: 'Total de Prompts',
      value: commands.length.toString(),
      icon: FileText,
      change: '+12%',
      changeType: 'positive' as const
    },
    {
      title: 'Usuários Ativos',
      value: '342',
      icon: Users,
      change: '+8%',
      changeType: 'positive' as const
    },
    {
      title: 'Visualizações Total',
      value: totalViews.toString(),
      icon: Eye,
      change: '+23%',
      changeType: 'positive' as const
    },
    {
      title: 'Prompts Copiados',
      value: totalCopies.toString(),
      icon: Copy,
      change: '+15%',
      changeType: 'positive' as const
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-[#2563EB]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0F1115]">{stat.value}</div>
              <p className="text-xs text-green-600 mt-1">
                {stat.change} em relação ao mês anterior
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};