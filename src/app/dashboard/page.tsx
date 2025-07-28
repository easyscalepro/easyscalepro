"use client";

import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ModernCommandCard } from '@/components/dashboard/modern-command-card';
import { CommandDetailModal } from '@/components/dashboard/command-detail-modal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth/auth-provider';
import { useCommands } from '@/contexts/commands-context';
import { useIsMobile } from '@/hooks/use-mobile';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Star, 
  Clock, 
  Zap,
  Grid3X3,
  List,
  SlidersHorizontal,
  Sparkles,
  Target,
  Award,
  BookOpen,
  Users,
  BarChart3,
  Heart,
  Eye,
  Copy,
  ChevronDown,
  X
} from 'lucide-react';
import { toast } from 'sonner';

const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { 
    commands, 
    categories, 
    loading, 
    searchTerm, 
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedLevel,
    setSelectedLevel,
    filteredCommands,
    loadCommands
  } = useCommands();
  
  const isMobile = useIsMobile();
  const [selectedCommand, setSelectedCommand] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'alphabetical'>('popular');

  useEffect(() => {
    loadCommands();
  }, []);

  const handleViewDetails = (commandId: string) => {
    setSelectedCommand(commandId);
  };

  const handleCloseModal = () => {
    setSelectedCommand(null);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedLevel('all');
    setShowFilters(false);
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || selectedLevel !== 'all';

  const stats = [
    {
      title: 'Total de Comandos',
      value: commands.length.toString(),
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      description: 'Comandos disponíveis'
    },
    {
      title: 'Categorias',
      value: categories.length.toString(),
      icon: Target,
      color: 'from-green-500 to-emerald-600',
      description: 'Áreas de negócio'
    },
    {
      title: 'Mais Popular',
      value: filteredCommands.length > 0 ? '95%' : '0%',
      icon: TrendingUp,
      color: 'from-purple-500 to-violet-600',
      description: 'Taxa de satisfação'
    },
    {
      title: 'Usuários Ativos',
      value: '1.2k+',
      icon: Users,
      color: 'from-orange-500 to-red-500',
      description: 'Empresários usando'
    }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <DashboardHeader />
        
        <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          {/* Welcome Section - Mobile Optimized */}
          <div className="mb-6 sm:mb-8 lg:mb-12">
            <div className="text-center sm:text-left space-y-2 sm:space-y-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-gray-900 dark:text-gray-100 leading-tight">
                Bem-vindo, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {profile?.name || user?.email?.split('@')[0] || 'Usuário'}
                </span>! 👋
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                Explore nossa biblioteca com mais de <strong>1.000 comandos especializados</strong> de ChatGPT 
                para impulsionar seu negócio e aumentar sua produtividade.
              </p>
            </div>
          </div>

          {/* Stats Cards - Mobile Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:-translate-y-1 bg-white dark:bg-gray-800">
                  <CardContent className="p-3 sm:p-4 lg:p-6">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {stat.value}
                      </p>
                      <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {stat.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                        {stat.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Search and Filters - Mobile Optimized */}
          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar comandos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 h-10 sm:h-12 text-sm sm:text-base border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
              />
            </div>

            {/* Mobile Filter Toggle */}
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 h-8 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm"
                >
                  <SlidersHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                  Filtros
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                      !
                    </Badge>
                  )}
                </Button>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-8 sm:h-10 px-2 sm:px-3 text-xs sm:text-sm text-red-600 hover:text-red-700"
                  >
                    <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Limpar
                  </Button>
                )}
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 sm:h-10 px-2 sm:px-3"
                >
                  <Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 sm:h-10 px-2 sm:px-3"
                >
                  <List className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>

            {/* Collapsible Filters - Mobile */}
            {showFilters && (
              <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Category Filter */}
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                      Categoria
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="all">Todas as categorias</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Level Filter */}
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nível
                    </label>
                    <select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="all">Todos os níveis</option>
                      <option value="iniciante">Iniciante</option>
                      <option value="intermediário">Intermediário</option>
                      <option value="avançado">Avançado</option>
                    </select>
                  </div>
                </div>

                {/* Sort Options */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ordenar por
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="popular">Mais populares</option>
                    <option value="recent">Mais recentes</option>
                    <option value="alphabetical">Ordem alfabética</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                Comandos Disponíveis
              </h2>
              <Badge variant="secondary" className="text-xs sm:text-sm">
                {filteredCommands.length}
              </Badge>
            </div>
            
            {filteredCommands.length > 0 && (
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {filteredCommands.length} de {commands.length} comandos
              </div>
            )}
          </div>

          {/* Commands Grid/List - Mobile Responsive */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredCommands.length === 0 ? (
            <div className="text-center py-8 sm:py-12 lg:py-16">
              <div className="max-w-md mx-auto space-y-4">
                <div className="p-4 sm:p-6 bg-gray-100 dark:bg-gray-800 rounded-full w-fit mx-auto">
                  <Search className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Nenhum comando encontrado
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Tente ajustar os filtros ou termos de busca para encontrar comandos relevantes.
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters} className="mt-4">
                    <X className="h-4 w-4 mr-2" />
                    Limpar filtros
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" 
                : "space-y-3 sm:space-y-4"
            }>
              {filteredCommands.map((command) => (
                <ModernCommandCard
                  key={command.id}
                  id={command.id}
                  title={command.title}
                  description={command.description}
                  category={command.category_name}
                  level={command.level as 'iniciante' | 'intermediário' | 'avançado'}
                  prompt={command.prompt}
                  tags={command.tags || []}
                  popularity={command.popularity}
                  estimatedTime={command.estimated_time}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}

          {/* Command Detail Modal */}
          {selectedCommand && (
            <CommandDetailModal
              commandId={selectedCommand}
              isOpen={!!selectedCommand}
              onClose={handleCloseModal}
            />
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;