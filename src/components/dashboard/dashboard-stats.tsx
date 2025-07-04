"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Users, Target, Clock, TrendingUp, Zap, Star, Award } from 'lucide-react';

export const DashboardStats: React.FC = () => {
  const stats = [
    {
      title: 'Comandos Premium',
      value: '1,247',
      change: '+12 esta semana',
      icon: FileText,
      gradient: 'from-[#2563EB] to-[#1d4ed8]',
      bgGradient: 'from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-500/30',
      shadowColor: 'shadow-blue-500/25'
    },
    {
      title: 'Empresas Ativas',
      value: '2,847',
      change: '+23% este mês',
      icon: Users,
      gradient: 'from-[#10B981] to-[#059669]',
      bgGradient: 'from-green-500/20 to-green-600/20',
      borderColor: 'border-green-500/30',
      shadowColor: 'shadow-green-500/25'
    },
    {
      title: 'Taxa de Sucesso',
      value: '94.2%',
      change: '+5.2% melhoria',
      icon: Target,
      gradient: 'from-[#FBBF24] to-[#F59E0B]',
      bgGradient: 'from-yellow-500/20 to-yellow-600/20',
      borderColor: 'border-yellow-500/30',
      shadowColor: 'shadow-yellow-500/25'
    },
    {
      title: 'Tempo Economizado',
      value: '156h',
      change: 'por empresa/mês',
      icon: Clock,
      gradient: 'from-[#8B5CF6] to-[#7C3AED]',
      bgGradient: 'from-purple-500/20 to-purple-600/20',
      borderColor: 'border-purple-500/30',
      shadowColor: 'shadow-purple-500/25'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={index} 
            className={`group relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-4 hover:rotate-1 bg-gradient-to-br ${stat.bgGradient} backdrop-blur-xl border-2 ${stat.borderColor} ${stat.shadowColor}`}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm"></div>
            <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-700`}></div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-tr from-white/5 to-transparent rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            
            <CardContent className="relative p-8">
              {/* Icon and Value */}
              <div className="flex items-center justify-between mb-6">
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${stat.gradient} shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-white group-hover:scale-110 transition-transform duration-500 drop-shadow-lg">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-300 font-semibold mt-2 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-400" />
                    {stat.change}
                  </div>
                </div>
              </div>
              
              {/* Title */}
              <h3 className="text-lg font-bold text-white group-hover:text-white transition-colors duration-500 mb-2">
                {stat.title}
              </h3>
              
              {/* Progress Bar */}
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-1000 group-hover:w-full`}
                  style={{ width: '75%' }}
                ></div>
              </div>
              
              {/* Premium Badge */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] text-[#0F1115] px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  PREMIUM
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};