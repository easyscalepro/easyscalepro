"use client";

import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Sparkles, Zap, Target, TrendingUp } from 'lucide-react';

interface ModernCommandFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedLevel: string;
  onLevelChange: (value: string) => void;
}

export const ModernCommandFilters: React.FC<ModernCommandFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedLevel,
  onLevelChange,
}) => {
  const categories = [
    { value: 'Todas', icon: '🎯', color: 'from-slate-500 to-gray-500' },
    { value: 'Marketing', icon: '📈', color: 'from-blue-500 to-cyan-500' },
    { value: 'Finanças', icon: '💰', color: 'from-green-500 to-emerald-500' },
    { value: 'Gestão', icon: '👥', color: 'from-purple-500 to-violet-500' },
    { value: 'Vendas', icon: '🎯', color: 'from-orange-500 to-red-500' },
    { value: 'Atendimento', icon: '💬', color: 'from-pink-500 to-rose-500' },
    { value: 'Recursos Humanos', icon: '👤', color: 'from-teal-500 to-cyan-500' },
    { value: 'Estratégia', icon: '🧠', color: 'from-indigo-500 to-blue-500' },
    { value: 'Operações', icon: '⚙️', color: 'from-cyan-500 to-blue-500' }
  ];

  const levels = [
    { value: 'Todos', icon: '📝', color: 'from-slate-500 to-gray-500' },
    { value: 'iniciante', icon: '🌱', color: 'from-emerald-500 to-green-500' },
    { value: 'intermediário', icon: '⚡', color: 'from-amber-500 to-orange-500' },
    { value: 'avançado', icon: '🚀', color: 'from-red-500 to-pink-500' }
  ];

  const quickFilters = [
    { label: 'Marketing Digital', icon: '📱', gradient: 'from-blue-500 to-cyan-500' },
    { label: 'Vendas', icon: '💼', gradient: 'from-orange-500 to-red-500' },
    { label: 'Gestão', icon: '👑', gradient: 'from-purple-500 to-violet-500' },
    { label: 'Finanças', icon: '📊', gradient: 'from-green-500 to-emerald-500' }
  ];

  return (
    <div className="mb-16">
      <div className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 shadow-2xl overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5"></div>
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30 backdrop-blur-sm">
              <Filter className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Encontre o comando perfeito</h2>
              <p className="text-slate-400 mt-1">Use os filtros abaixo para descobrir exatamente o que precisa</p>
            </div>
            <div className="ml-auto flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full px-4 py-2">
              <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
              <span className="text-yellow-400 font-semibold text-sm">AI Powered</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Search */}
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <Search className="h-4 w-4 text-blue-400" />
                Buscar comandos
              </label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                <Input
                  placeholder="Digite palavras-chave..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-12 h-14 border-slate-600/50 focus:border-blue-500 focus:ring-blue-500/20 bg-slate-700/50 text-white placeholder:text-slate-400 rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/70"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-400" />
                Categoria
              </label>
              <Select value={selectedCategory} onValueChange={onCategoryChange}>
                <SelectTrigger className="h-14 border-slate-600/50 focus:border-purple-500 focus:ring-purple-500/20 bg-slate-700/50 text-white rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/70">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800/95 backdrop-blur-xl border-slate-700 rounded-xl">
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value} className="text-slate-200 focus:bg-slate-700 focus:text-white rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center text-xs`}>
                          {category.icon}
                        </div>
                        <span className="font-medium">{category.value}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-400" />
                Nível de complexidade
              </label>
              <Select value={selectedLevel} onValueChange={onLevelChange}>
                <SelectTrigger className="h-14 border-slate-600/50 focus:border-green-500 focus:ring-green-500/20 bg-slate-700/50 text-white rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-slate-700/70">
                  <SelectValue placeholder="Selecione o nível" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800/95 backdrop-blur-xl border-slate-700 rounded-xl">
                  {levels.map((level) => (
                    <SelectItem key={level.value} value={level.value} className="text-slate-200 focus:bg-slate-700 focus:text-white rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-lg bg-gradient-to-r ${level.color} flex items-center justify-center text-xs`}>
                          {level.icon}
                        </div>
                        <span className="font-medium capitalize">{level.value}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quick filters */}
          <div className="pt-6 border-t border-slate-700/50">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="h-4 w-4 text-yellow-400" />
              <p className="text-sm font-semibold text-slate-300">Filtros rápidos populares:</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {quickFilters.map((filter) => (
                <button
                  key={filter.label}
                  onClick={() => onSearchChange(filter.label)}
                  className={`group relative px-4 py-2 bg-gradient-to-r ${filter.gradient}/20 hover:${filter.gradient}/30 text-slate-300 hover:text-white text-sm rounded-xl transition-all duration-300 border border-slate-600/30 hover:border-slate-500/50 backdrop-blur-sm overflow-hidden`}
                >
                  <div className="flex items-center gap-2 relative z-10">
                    <span className="text-base">{filter.icon}</span>
                    <span className="font-medium">{filter.label}</span>
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-r ${filter.gradient}/10 opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};