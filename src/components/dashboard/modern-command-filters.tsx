"use client";

import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Sparkles, Tag, BarChart3, Zap } from 'lucide-react';

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
    { value: 'Todas', icon: '🌟', color: 'from-gray-500 to-gray-600' },
    { value: 'Marketing', icon: '📈', color: 'from-blue-500 to-blue-600' },
    { value: 'Finanças', icon: '💰', color: 'from-green-500 to-green-600' },
    { value: 'Gestão', icon: '👔', color: 'from-purple-500 to-purple-600' },
    { value: 'Vendas', icon: '🎯', color: 'from-orange-500 to-orange-600' },
    { value: 'Atendimento', icon: '🤝', color: 'from-pink-500 to-pink-600' },
    { value: 'Recursos Humanos', icon: '👥', color: 'from-teal-500 to-teal-600' },
    { value: 'Estratégia', icon: '🧠', color: 'from-indigo-500 to-indigo-600' },
    { value: 'Operações', icon: '⚙️', color: 'from-cyan-500 to-cyan-600' }
  ];

  const levels = [
    { value: 'Todos', icon: '🌟', color: 'from-gray-500 to-gray-600' },
    { value: 'iniciante', icon: '🌱', color: 'from-emerald-500 to-emerald-600' },
    { value: 'intermediário', icon: '🔥', color: 'from-amber-500 to-amber-600' },
    { value: 'avançado', icon: '🚀', color: 'from-red-500 to-red-600' }
  ];

  const quickFilters = [
    { label: 'Marketing Digital', icon: '📱', gradient: 'from-blue-500 to-purple-600' },
    { label: 'Vendas', icon: '💼', gradient: 'from-orange-500 to-red-600' },
    { label: 'Gestão', icon: '📊', gradient: 'from-purple-500 to-indigo-600' },
    { label: 'Finanças', icon: '💎', gradient: 'from-green-500 to-emerald-600' }
  ];

  return (
    <div className="relative">
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-white to-purple-50 dark:from-blue-900/10 dark:via-gray-800/50 dark:to-purple-900/10 rounded-3xl"></div>
      
      <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-8 shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
            <Filter className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Encontre o comando perfeito
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Use os filtros abaixo para descobrir exatamente o que precisa
            </p>
          </div>
          <div className="ml-auto">
            <Sparkles className="h-8 w-8 text-yellow-500 animate-pulse" />
          </div>
        </div>

        {/* Filtros principais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Search */}
          <div className="group">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Search className="h-4 w-4" />
              Buscar comandos
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors" />
              <Input
                placeholder="Digite palavras-chave..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-12 h-14 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl text-lg font-medium transition-all duration-300 hover:shadow-lg focus:shadow-xl"
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="group">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Categoria
            </label>
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="h-14 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl text-lg font-medium transition-all duration-300 hover:shadow-lg">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-2 shadow-2xl">
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value} className="rounded-xl">
                    <div className="flex items-center gap-3 py-1">
                      <span className="text-lg">{category.icon}</span>
                      <span className="font-medium">{category.value}</span>
                      {category.value !== 'Todas' && (
                        <div className={`w-3 h-3 bg-gradient-to-r ${category.color} rounded-full`}></div>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Level */}
          <div className="group">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Nível de complexidade
            </label>
            <Select value={selectedLevel} onValueChange={onLevelChange}>
              <SelectTrigger className="h-14 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl text-lg font-medium transition-all duration-300 hover:shadow-lg">
                <SelectValue placeholder="Selecione o nível" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-2 shadow-2xl">
                {levels.map((level) => (
                  <SelectItem key={level.value} value={level.value} className="rounded-xl">
                    <div className="flex items-center gap-3 py-1">
                      <span className="text-lg">{level.icon}</span>
                      <span className="font-medium capitalize">{level.value}</span>
                      {level.value !== 'Todos' && (
                        <div className={`w-3 h-3 bg-gradient-to-r ${level.color} rounded-full`}></div>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick filters */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="h-5 w-5 text-yellow-500" />
            <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Filtros rápidos:</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {quickFilters.map((filter, index) => (
              <button
                key={filter.label}
                onClick={() => onSearchChange(filter.label)}
                className={`group flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${filter.gradient} hover:shadow-lg text-white rounded-2xl transition-all duration-300 transform hover:scale-105 font-medium`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="text-lg group-hover:animate-bounce">{filter.icon}</span>
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full blur-xl"></div>
      </div>
    </div>
  );
};