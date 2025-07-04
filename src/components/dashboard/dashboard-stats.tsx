"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Users, TrendingUp, Zap, Star, Target, Rocket, Award } from 'lucide-react';

export const DashboardStats: React.FC = () => {
  const stats = [
    {
      title: 'Comandos Disponíveis',
      value: '1,247',
      change: '+12 esta semana',
      icon: FileText,
      color: 'blue',
      gradient: 'from-blue-500 via-blue-600 to-blue-700',
      bgGradient: 'from-blue-50 to-blue-100',
      darkBgGradient: 'from-blue-900/20 to-blue-800/30',
      emoji: '📚'
    },
    {
      title: 'Usuários Ativos',
      value: '2,847',
      change: '+23% este mês',
      icon: Users,
      color: 'emerald',
      gradient: 'from-emerald-500 via-emerald-600 to-emerald-700',
      bgGradient: 'from-emerald-50 to-emerald-100',
      darkBgGradient: 'from-emerald-900/20 to-emerald-800/30',
      emoji: '👥'
    },
    {
      title: 'Taxa de Sucesso',
      value: '94.2%',
      change: '+5.2% melhoria',
      icon: Target,
      color: 'purple',
      gradient: 'from-purple-500 via-purple-600 to-purple-700',
      bgGradient: 'from-purple-50 to-purple-100',
      darkBgGradient: 'from-purple-900/20 to-purple-800/30',
      emoji: '🎯'
    },
    {
      title: 'Tempo Economizado',
      value: '156h',
      change: 'por usuário/mês',
      icon: Rocket,
      color: 'orange',
      gradient: 'from-orange-500 via-orange-600 to-orange-700',
      bgGradient: 'from-orange-50 to-orange-100',
      darkBgGradient: 'from-orange-900/20 to-orange-800/30',
      emoji: '⚡'
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
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} dark:${stat.darkBgGradient} opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8 group-hover:scale-125 transition-transform duration-500"></div>
            
            <CardContent className="relative p-6 z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.gradient} shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-2xl group-hover:animate-bounce">{stat.emoji}</span>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-gray-900 dark:text-gray-100 group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  {stat.title}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                    <TrendingUp className="h-3 w-3" />
                    {stat.change}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
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