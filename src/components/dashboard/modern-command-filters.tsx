"use client";

import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Tag, BarChart3, Zap } from 'lucide-react';

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
    'Todas',
    'Marketing',
    'Finanças',
    'Gestão',
    'Vendas',
    'Atendimento',
    'Recursos Humanos',
    'Estratégia',
    'Operações'
  ];

  const levels = [
    'Todos',
    'iniciante',
    'intermediário',
    'avançado'
  ];

  const quickFilters = [
    { label: 'Marketing Digital', gradient: 'from-blue-500 to-blue-600' },
    { label: 'Análise Financeira', gradient: 'from-emerald-500 to-emerald-600' },
    { label: 'Gestão de Equipe', gradient: 'from-purple-500 to-purple-600' },
    { label: 'Estratégia de Vendas', gradient: 'from-orange-500 to-orange-600' }
  ];

  return (
    <div className="relative">
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-white/80 to-indigo-50/50 dark:from-blue-950/20 dark:via-gray-800/80 dark:to-indigo-950/20 rounded-2xl"></div>
      
      <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <Filter className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Filtros de Busca
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Encontre comandos específicos para suas necessidades
            </p>
          </div>
        </div>

        {/* Filtros principais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Search */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Search className="h-4 w-4" />
              Buscar comandos
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors" />
              <Input
                placeholder="Digite palavras-chave..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-12 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl text-base font-medium transition-all duration-300 hover:shadow-md focus:shadow-lg"
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
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Categoria
            </label>
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl text-base font-medium transition-all duration-300 hover:shadow-md">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-2 shadow-2xl">
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="rounded-lg">
                    <span className="font-medium">{category}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Level */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Nível de complexidade
            </label>
            <Select value={selectedLevel} onValueChange={onLevelChange}>
              <SelectTrigger className="h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl text-base font-medium transition-all duration-300 hover:shadow-md">
                <SelectValue placeholder="Selecione o nível" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-2 shadow-2xl">
                {levels.map((level) => (
                  <SelectItem key={level} value={level} className="rounded-lg">
                    <span className="font-medium capitalize">{level}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick filters */}
        <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="h-5 w-5 text-blue-500" />
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filtros rápidos:</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {quickFilters.map((filter, index) => (
              <button
                key={filter.label}
                onClick={() => onSearchChange(filter.label)}
                className={`group flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${filter.gradient} hover:shadow-lg text-white rounded-xl transition-all duration-300 transform hover:scale-105 font-medium`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {filter.label}
                <div className="w-1.5 h-1.5 bg-white/50 rounded-full group-hover:animate-ping"></div>
              </button>
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-xl"></div>
      </div>
    </div>
  );
};