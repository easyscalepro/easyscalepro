"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useCommands } from '@/contexts/commands-context';
import { useRouter } from 'next/navigation';
import { MobileDashboardHeader } from '@/components/dashboard/mobile-dashboard-header';
import { ModernCommandFilters } from '@/components/dashboard/modern-command-filters';
import { ModernCommandCard } from '@/components/dashboard/modern-command-card';
import { CommandListItem } from '@/components/dashboard/command-list-item';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { Search, Sparkles, TrendingUp, Zap, Star, Rocket, Target, Clock, BookOpen, Filter, Grid3X3, List, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { commands, incrementViews, favorites } = useCommands();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedLevel, setSelectedLevel] = useState('Todos');
  const [filteredCommands, setFilteredCommands] = useState(commands);
  const [isGridVisible, setIsGridVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    let filtered = commands;

    if (searchTerm) {
      filtered = filtered.filter(command =>
        command.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        command.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (command.tags && command.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    if (selectedCategory !== 'Todas') {
      filtered = filtered.filter(command => command.category === selectedCategory);
    }

    if (selectedLevel !== 'Todos') {
      filtered = filtered.filter(command => command.level === selectedLevel);
    }

    setFilteredCommands(filtered);
    
    // Trigger grid animation when commands change
    setIsGridVisible(false);
    setTimeout(() => setIsGridVisible(true), 100);
  }, [searchTerm, selectedCategory, selectedLevel, commands]);

  const handleViewDetails = (id: string) => {
    incrementViews(id);
    router.push(`/command/${id}`);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">Carregando sua experiência...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <MobileDashboardHeader />
      
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-12 max-w-7xl relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating geometric shapes */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full blur-xl animate-pulse delay-2000"></div>
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]"></div>
        </div>

        {/* Stats - Hidden on mobile, shown on tablet+ */}
        <div className="hidden sm:block">
          <DashboardStats />
        </div>

        {/* Mobile Quick Stats */}
        <div className="sm:hidden mb-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{commands.length}</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Comandos</div>
            </div>
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-4 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50">
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{favorites.length}</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Favoritos</div>
            </div>
          </div>
        </div>

        {/* Desktop Filters */}
        <div className="hidden lg:block">
          <ModernCommandFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedLevel={selectedLevel}
            onLevelChange={setSelectedLevel}
          />
        </div>

        {/* Mobile Search and Filters */}
        <div className="lg:hidden mb-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar comandos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 rounded-xl text-base"
              />
            </div>

            {/* Filter Button and View Toggle */}
            <div className="flex items-center justify-between gap-3">
              <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl h-12"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filtros
                    {(selectedCategory !== 'Todas' || selectedLevel !== 'Todos') && (
                      <div className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </Button>
                </SheetTrigger>
                
                <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl">
                  <div className="p-6 space-y-6">
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Filtros</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Refine sua busca</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Categoria
                        </label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="h-12 border-gray-200 dark:border-gray-700">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nível
                        </label>
                        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                          <SelectTrigger className="h-12 border-gray-200 dark:border-gray-700">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {levels.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={() => {
                          setSelectedCategory('Todas');
                          setSelectedLevel('Todos');
                          setShowMobileFilters(false);
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        Limpar
                      </Button>
                      <Button
                        onClick={() => setShowMobileFilters(false)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Aplicar
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                <Button
                  onClick={() => setViewMode('grid')}
                  variant="ghost"
                  size="sm"
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => setViewMode('list')}
                  variant="ghost"
                  size="sm"
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list' 
                      ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' 
                      :  'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {filteredCommands.length} comandos
            </h2>
          </div>
          {searchTerm && (
            <div className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
              Resultados para "{searchTerm}"
            </div>
          )}
        </div>

        {/* Enhanced Commands Grid/List */}
        {filteredCommands.length > 0 ? (
          <div className={`grid gap-4 sm:gap-6 lg:gap-8 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredCommands.map((command, index) => (
              <div
                key={command.id}
                className={`transform transition-all duration-700 ${
                  isGridVisible 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-8 opacity-0'
                }`}
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                {viewMode === 'grid' ? (
                  <ModernCommandCard
                    {...command}
                    onViewDetails={handleViewDetails}
                  />
                ) : (
                  <CommandListItem
                    {...command}
                    onViewDetails={handleViewDetails}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-20">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Search className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Nenhum comando encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto text-sm sm:text-base">
              Tente ajustar seus filtros ou buscar por outros termos para encontrar o comando perfeito
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Todas');
                setSelectedLevel('Todos');
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              Limpar Filtros
            </button>
          </div>
        )}

        {/* Mobile Bottom Padding */}
        <div className="h-20 sm:hidden"></div>
      </main>
    </div>
  );
}