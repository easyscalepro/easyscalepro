"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Users, TrendingUp, Zap, ArrowUp, Sparkles } from 'lucide-react';

export const DashboardStats: React.FC = () => {
  const stats = [
    {
      title: 'Comandos Disponíveis',
      value: '1,247',
      change: '+12 esta semana',
      icon: FileText,
      color: 'blue',
      gradient: 'from-blue-500 via-blue-600 to-purple-600',
      bgGradient: 'from-blue-50 via-blue-100 to-purple-50',
      darkBgGradient: 'from-blue-900/20 via-blue-800/30 to-purple-900/20',
      shadowColor: 'shadow-blue-500/20',
      changeType: 'positive'
    },
    {
      title: 'Usuários Ativos',
      value: '2,847',
      change: '+23% este mês',
      icon: Users,
      color: 'emerald',
      gradient: 'from-emerald-500 via-green-600 to-teal-600',
      bgGradient: 'from-emerald-50 via-green-100 to-teal-50',
      darkBgGradient: 'from-emerald-900/20 via-green-800/30 to-teal-900/20',
      shadowColor: 'shadow-emerald-500/20',
      changeType: 'positive'
    },
    {
      title: 'Taxa de Sucesso',
      value: '94.2%',
      change: '+5.2% melhoria',
      icon: TrendingUp,
      color: 'purple',
      gradient: 'from-purple-500 via-violet-600 to-indigo-600',
      bgGradient: 'from-purple-50 via-violet-100 to-indigo-50',
      darkBgGradient: 'from-purple-900/20 via-violet-800/30 to-indigo-900/20',
      shadowColor: 'shadow-purple-500/20',
      changeType: 'positive'
    },
    {
      title: 'Tempo Economizado',
      value: '156h',
      change: 'por usuário/mês',
      icon: Zap,
      color: 'amber',
      gradient: 'from-amber-500 via-orange-600 to-red-500',
      bgGradient: 'from-amber-50 via-orange-100 to-red-50',
      darkBgGradient: 'from-amber-900/20 via-orange-800/30 to-red-900/20',
      shadowColor: 'shadow-amber-500/20',
      changeType: 'neutral'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={index} 
            className={`group relative overflow-hidden border-0 bg-gradient-to-br ${stat.bgGradient} dark:bg-gradient-to-br dark:${stat.darkBgGradient} hover:shadow-xl ${stat.shadowColor} dark:shadow-none transition-all duration-500 hover:-translate-y-2 cursor-pointer`}
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent dark:via-gray-300 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
            
            {/* Floating sparkles */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Sparkles className="h-4 w-4 text-white/60 animate-pulse" />
            </div>
            
            <CardContent className="relative p-6">
              <div className="flex items-start justify-between mb-6">
                {/* Icon with enhanced design */}
                <div className={`relative p-4 rounded-2xl bg-gradient-to-r ${stat.gradient} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <Icon className="h-7 w-7 text-white drop-shadow-sm" />
                  
                  {/* Glow effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300`}></div>
                </div>

                {/* Change indicator */}
                {stat.changeType === 'positive' && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold">
                    <ArrowUp className="h-3 w-3" />
                    <span>Crescendo</span>
                  </div>
                )}
              </div>

              {/* Value with enhanced typography */}
              <div className="space-y-2">
                <div className="text-3xl font-black text-gray-900 dark:text-white group-hover:scale-105 transition-transform duration-300 tracking-tight">
                  {stat.value}
                </div>
                
                <div className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                  {stat.title}
                </div>
                
                <div className={`text-xs font-semibold ${
                  stat.changeType === 'positive' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-gray-500 dark:text-gray-400'
                } flex items-center gap-1`}>
                  {stat.changeType === 'positive' && <ArrowUp className="h-3 w-3" />}
                  {stat.change}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-1000 group-hover:w-full`}
                  style={{ width: `${60 + index * 10}%` }}
                ></div>
              </div>
            </CardContent>

            {/* Bottom accent line */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
          </Card>
        );
      })}
    </div>
  );
};