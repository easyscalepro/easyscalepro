"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Users, TrendingUp, Clock, ArrowUpRight } from 'lucide-react';

export const ModernStats: React.FC = () => {
  const stats = [
    {
      title: 'Comandos Disponíveis',
      value: '1,247',
      change: '+12 esta semana',
      icon: FileText,
      description: 'Prompts especializados',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100/50',
      darkBgGradient: 'from-blue-950/30 to-blue-900/20'
    },
    {
      title: 'Empresários Ativos',
      value: '2,847',
      change: '+23% este mês',
      icon: Users,
      description: 'Utilizando a plataforma',
      gradient: 'from-indigo-500 to-indigo-600',
      bgGradient: 'from-indigo-50 to-indigo-100/50',
      darkBgGradient: 'from-indigo-950/30 to-indigo-900/20'
    },
    {
      title: 'Taxa de Efetividade',
      value: '94.2%',
      change: '+5.2% melhoria',
      icon: TrendingUp,
      description: 'Resultados positivos',
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100/50',
      darkBgGradient: 'from-emerald-950/30 to-emerald-900/20'
    },
    {
      title: 'Tempo Economizado',
      value: '156h',
      change: 'por empresa/mês',
      icon: Clock,
      description: 'Produtividade aumentada',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100/50',
      darkBgGradient: 'from-purple-950/30 to-purple-900/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={index} 
            className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
          >
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} dark:${stat.darkBgGradient} opacity-60 group-hover:opacity-80 transition-opacity duration-300`}></div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8 group-hover:scale-125 transition-transform duration-700"></div>
            
            <CardContent className="relative p-6 z-10">
              <div className="flex items-start justify-between mb-6">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                    <ArrowUpRight className="h-3 w-3" />
                    {stat.change}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {stat.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {stat.description}
                </p>
              </div>

              {/* Progress indicator */}
              <div className="mt-4 w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-1000 group-hover:animate-pulse`}
                  style={{ width: '75%' }}
                ></div>
              </div>
            </CardContent>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </Card>
        );
      })}
    </div>
  );
};