"use client";

import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Sparkles } from 'lucide-react';

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

  return (
    <div className="mb-12">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
            <Filter className="h-5 w-5 text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Encontre o comando perfeito</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Buscar comandos
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Digite palavras-chave..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-12 h-12 border-slate-600 focus:border-blue-500 focus:ring-blue-500/20 bg-slate-700/50 text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Categoria
            </label>
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="h-12 border-slate-600 focus:border-blue-500 focus:ring-blue-500/20 bg-slate-700/50 text-white">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="text-slate-200 focus:bg-slate-700 focus:text-white">
                    <div className="flex items-center gap-2">
                      {category !== 'Todas' && (
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      )}
                      {category}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Nível de complexidade
            </label>
            <Select value={selectedLevel} onValueChange={onLevelChange}>
              <SelectTrigger className="h-12 border-slate-600 focus:border-blue-500 focus:ring-blue-500/20 bg-slate-700/50 text-white">
                <SelectValue placeholder="Selecione o nível" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {levels.map((level) => (
                  <SelectItem key={level} value={level} className="text-slate-200 focus:bg-slate-700 focus:text-white">
                    <div className="flex items-center gap-2">
                      {level !== 'Todos' && (
                        <Sparkles className="w-3 h-3 text-amber-400" />
                      )}
                      {level}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick filters */}
        <div className="mt-6 pt-6 border-t border-slate-700/50">
          <p className="text-sm text-slate-400 mb-3">Filtros rápidos:</p>
          <div className="flex flex-wrap gap-2">
            {['Marketing Digital', 'Vendas', 'Gestão', 'Finanças'].map((filter) => (
              <button
                key={filter}
                onClick={() => onSearchChange(filter)}
                className="px-3 py-1 bg-slate-700/50 hover:bg-blue-500/20 text-slate-300 hover:text-blue-400 text-sm rounded-full transition-colors border border-slate-600/30 hover:border-blue-500/30"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};