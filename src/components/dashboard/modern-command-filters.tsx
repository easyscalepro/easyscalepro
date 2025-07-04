"use client";

import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Sparkles, Zap, Target, Rocket } from 'lucide-react';

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
    { name: 'Marketing Digital', icon: Target, color: 'from-blue-500 to-blue-600' },
    { name: 'Vendas', icon: Zap, color: 'from-orange-500 to-orange-600' },
    { name: 'Gestão', icon: Rocket, color: 'from-purple-500 to-purple-600' },
    { name: 'Finanças', icon: Sparkles, color: 'from-green-500 to-green-600' }
  ];

  return (
    <div className="mb-12">
      <div className="relative overflow-hidden bg-white/90 backdrop-blur-xl rounded-3xl border border-gray-200/50 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-yellow-400/5"></div>
        
        <div className="relative p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-yellow-400 rounded-2xl shadow-lg">
              <Filter className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Encontre o comando perfeito</h2>
              <p className="text-gray-600 mt-1">Use os filtros abaixo para descobrir exatamente o que precisa</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Buscar comandos
              </label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  placeholder="Digite palavras-chave..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-12 h-14 border-2 border-gray-200 focus:border-blue-600 focus:ring-blue-600 bg-white/80 backdrop-blur-sm rounded-xl text-gray-900 font-medium placeholder:text-gray-500 transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Categoria
              </label>
              <Select value={selectedCategory} onValueChange={onCategoryChange}>
                <SelectTrigger className="h-14 border-2 border-gray-200 focus:border-blue-600 focus:ring-blue-600 bg-white/80 backdrop-blur-sm rounded-xl font-medium">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="font-medium">
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
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Nível de complexidade
              </label>
              <Select value={selectedLevel} onValueChange={onLevelChange}>
                <SelectTrigger className="h-14 border-2 border-gray-200 focus:border-blue-600 focus:ring-blue-600 bg-white/80 backdrop-blur-sm rounded-xl font-medium">
                  <SelectValue placeholder="Selecione o nível" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  {levels.map((level) => (
                    <SelectItem key={level} value={level} className="font-medium">
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

          <div className="pt-6 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-900 mb-4">Filtros rápidos:</p>
            <div className="flex flex-wrap gap-3">
              {quickFilters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.name}
                    onClick={() => onSearchChange(filter.name)}
                    className={`group flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${filter.color} text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl`}
                  >
                    <Icon className="h-4 w-4 group-hover:animate-pulse" />
                    {filter.name}
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