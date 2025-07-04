"use client";

import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Sparkles, Zap, Target, TrendingUp, Star } from 'lucide-react';

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
    'Operações',
    'Tecnologia',
    'Jurídico',
    'Produção',
    'Logística',
    'Qualidade',
    'Inovação',
    'Sustentabilidade'
  ];

  const levels = [
    'Todos',
    'iniciante',
    'intermediário',
    'avançado'
  ];

  const quickFilters = [
    { name: 'Marketing Digital', icon: TrendingUp, color: 'from-blue-500 to-blue-600' },
    { name: 'Vendas', icon: Target, color: 'from-emerald-500 to-emerald-600' },
    { name: 'Gestão', icon: Star, color: 'from-purple-500 to-purple-600' },
    { name: 'Finanças', icon: Zap, color: 'from-amber-500 to-amber-600' },
    { name: 'Tecnologia', icon: Sparkles, color: 'from-indigo-500 to-indigo-600' },
    { name: 'Estratégia', icon: Target, color: 'from-rose-500 to-rose-600' }
  ];

  return (
    <div className="mb-12">
      <div className="relative bg-gradient-to-br from-white/80 via-white/60 to-blue-50/30 dark:from-gray-800/80 dark:via-gray-800/60 dark:to-blue-900/20 backdrop-blur-md rounded-3xl border border-gray-200/60 dark:border-gray-700/60 p-8 shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden">
        
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-xl"></div>
          
          {/* Animated pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        </div>

        {/* Header with enhanced design */}
        <div className="relative flex items-center gap-4 mb-8">
          <div className="relative p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
            <Filter className="h-6 w-6 text-white drop-shadow-sm" />
            
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-300"></div>
          </div>
          
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
              Encontre o comando 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ml-2">
                perfeito
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 font-medium">
              Use os filtros para descobrir exatamente o que precisa
            </p>
          </div>
          
          {/* Floating sparkles */}
          <div className="absolute top-2 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Sparkles className="h-5 w-5 text-blue-400 animate-pulse" />
          </div>
        </div>

        {/* Enhanced form fields */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Search Field */}
          <div className="group/field">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Search className="h-4 w-4 text-blue-500" />
              Buscar comandos
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within/field:text-blue-500 transition-colors" />
              <Input
                placeholder="Digite palavras-chave..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-12 h-14 border-2 border-gray-200/80 dark:border-gray-700/80 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl text-gray-900 dark:text-gray-100 font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600"
              />
              
              {/* Input glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within/field:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
            </div>
          </div>

          {/* Category Field */}
          <div className="group/field">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
              Categoria
            </label>
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="h-14 border-2 border-gray-200/80 dark:border-gray-700/80 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl font-medium transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-600">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/60 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      {category !== 'Todas' && (
                        <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                      )}
                      <span className="font-medium">{category}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Level Field */}
          <div className="group/field">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              Nível de complexidade
            </label>
            <Select value={selectedLevel} onValueChange={onLevelChange}>
              <SelectTrigger className="h-14 border-2 border-gray-200/80 dark:border-gray-700/80 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl font-medium transition-all duration-300 hover:border-purple-300 dark:hover:border-purple-600">
                <SelectValue placeholder="Selecione o nível" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/60 rounded-xl shadow-xl">
                {levels.map((level) => (
                  <SelectItem key={level} value={level} className="hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      {level !== 'Todos' && (
                        <Sparkles className="w-3 h-3 text-purple-500" />
                      )}
                      <span className="font-medium">{level}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Enhanced quick filters */}
        <div className="relative pt-6 border-t border-gray-200/60 dark:border-gray-700/60">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="h-4 w-4 text-amber-500" />
            <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Filtros rápidos:</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {quickFilters.map((filter, index) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.name}
                  onClick={() => onSearchChange(filter.name)}
                  className="group/pill relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 hover:from-white hover:to-gray-50 dark:hover:from-gray-600 dark:hover:to-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 rounded-full border border-gray-200/60 dark:border-gray-600/60 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 font-medium"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`p-1 rounded-full bg-gradient-to-r ${filter.color} shadow-sm group-hover/pill:scale-110 transition-transform duration-300`}>
                    <Icon className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm">{filter.name}</span>
                  
                  {/* Pill glow effect */}
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${filter.color} opacity-0 group-hover/pill:opacity-20 transition-opacity duration-300 -z-10 blur-lg`}></div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center rounded-b-3xl"></div>
      </div>
    </div>
  );
};