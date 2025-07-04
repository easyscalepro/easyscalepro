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
      changePercent: '+12%',
      icon: FileText,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10',
      borderGradient: 'from-blue-500/30 to-cyan-500/30',
      description: 'Prompts profissionais'
    },
    {
      title: 'Usuários Ativos',
      value: '2,847',
      change: '+23% este mês',
      changePercent: '+23%',
      icon: Users,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/10 to-emerald-500/10',
      borderGradient: 'from-green-500/30 to-emerald-500/30',
      description: 'Empresários conectados'
    },
    {
      title: 'Taxa de Sucesso',
      value: '94.2%',
      change: '+5.2% melhoria',
      changePercent: '+5.2%',
      icon: TrendingUp,
      gradient: 'from-purple-500 to-violet-500',
      bgGradient: 'from-purple-500/10 to-violet-500/10',
      borderGradient: 'from-purple-500/30 to-violet-500/30',
      description: 'Resultados positivos'
    },
    {
      title: 'Tempo Economizado',
      value: '156h',
      change: 'por usuário/mês',
      changePercent: '156h',
      icon: Zap,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-500/10 to-red-500/10',
      borderGradient: 'from-orange-500/30 to-red-500/30',
      description: 'Produtividade aumentada'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={index} 
            className={`group relative border border-slate-700/50 bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm hover:bg-gradient-to-br hover:from-slate-800/80 hover:to-slate-900/80 hover:border-slate-600/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl overflow-hidden`}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Animated background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            
            {/* Glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${stat.borderGradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}></div>
            
            <CardContent className="relative p-6 z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300 relative overflow-hidden`}>
                  <Icon className="h-7 w-7 text-white relative z-10" />
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-black text-white mb-1 group-hover:text-blue-400 transition-colors duration-300">
                    {stat.value}
                  </div>
                  <div className="flex items-center gap-1 text-green-400 text-xs font-semibold">
                    <ArrowUp className="h-3 w-3" />
                    {stat.changePercent}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors duration-300">
                  {stat.title}
                </h3>
                <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                  {stat.description}
                </p>
                <div className="flex items-center gap-1 text-xs text-slate-500 group-hover:text-slate-400 transition-colors duration-300">
                  <Sparkles className="h-3 w-3" />
                  {stat.change}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 h-1 bg-slate-700/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-1000 group-hover:w-full`}
                  style={{ width: '70%' }}
                ></div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};