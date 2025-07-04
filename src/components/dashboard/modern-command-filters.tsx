"use client";

import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Sparkles, Zap, Target, Rocket, Star } from 'lucide-react';

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
    { name: 'Marketing Digital', icon: Target, color: 'from-blue-500 to-blue-600', popular: true },
    { name: 'Vendas', icon: Zap, color: 'from-orange-500 to-orange-600', popular: true },
    { name: 'Gestão', icon: Rocket, color: 'from-purple-500 to-purple-600', popular: false },
    { name: 'Finanças', icon: Sparkles, color: 'from-green-500 to-green-600', popular: true }
  ];

  return (
    <div className="mb-16">
      <div className="relative overflow-hidden bg-white/10 backdrop-blur-2xl rounded-3xl border-2 border-white/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-yellow-400/10"></div>
        
        <div className="relative p-10">
          <div className="flex items-center gap-6 mb-10">
            <div className="relative">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-yellow-400 rounded-3xl shadow-2xl">
                <Filter className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <Star className="h-3 w-3 text-gray-900" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-black text-white mb-2">Filtros Inteligentes</h2>
              <p className="text-gray-300 text-lg">Encontre exatamente o que seu negócio precisa</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="md:col-span-1">
              <label className="block text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Search className="h-5 w-5 text-yellow-400" />
                Buscar comandos
              </label>
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 group-focus-within:text-yellow-400 transition-colors duration-300" />
                <Input
                  placeholder="Digite palavras-chave..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-14 h-16 border-2 border-white/20 focus:border-yellow-400 focus:ring-yellow-400 bg-white/10 backdrop-blur-sm rounded-2xl text-white font-semibold placeholder:text-gray-400 transition-all duration-300 text-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-blue-600/10 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            <div>
              <label className="block text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-yellow-400" />
                Categoria
              </label>
              <Select value={selectedCategory} onValueChange={onCategoryChange}>
                <SelectTrigger className="h-16 border-2 border-white/20 focus:border-yellow-400 focus:ring-yellow-400 bg-white/10 backdrop-blur-sm rounded-2xl font-semibold text-white text-lg">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-2 bg-gray-900/95 backdrop-blur-xl">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="font-semibold text-white hover:bg-yellow-400/20">
                      <div className="flex items-center gap-3">
                        {category !== 'Todas' && (
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-yellow-400 rounded-full"></div>
                        )}
                        {category}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                Nível de complexidade
              </label>
              <Select value={selectedLevel} onValueChange={onLevelChange}>
                <SelectTrigger className="h-16 border-2 border-white/20 focus:border-yellow-400 focus:ring-yellow-400 bg-white/10 backdrop-blur-sm rounded-2xl font-semibold text-white text-lg">
                  <SelectValue placeholder="Selecione o nível" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-2 bg-gray-900/95 backdrop-blur-xl">
                  {levels.map((level) => (
                    <SelectItem key={level} value={level} className="font-semibold text-white hover:bg-yellow-400/20">
                      <div className="flex items-center gap-3">
                        {level !== 'Todos' && (
                          <Sparkles className="w-4 h-4 text-yellow-400" />
                        )}
                        {level}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-8 border-t border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <Zap className="h-6 w-6 text-yellow-400" />
              <p className="text-lg font-bold text-white">Filtros Populares:</p>
            </div>
            <div className="flex flex-wrap gap-4">
              {quickFilters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.name}
                    onClick={() => onSearchChange(filter.name)}
                    className={`group relative flex items-center gap-3 px-6 py-4 bg-gradient-to-r ${filter.color} text-white rounded-2xl font-bold transition-all duration-500 transform hover:scale-110 shadow-xl hover:shadow-2xl overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <Icon className="h-5 w-5 group-hover:animate-pulse relative z-10" />
                    <span className="relative z-10">{filter.name}</span>
                    {filter.popular && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                        <Star className="h-3 w-3 text-gray-900" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};