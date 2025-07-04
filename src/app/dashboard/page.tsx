"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useCommands } from '@/contexts/commands-context';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ModernCommandFilters } from '@/components/dashboard/modern-command-filters';
import { ModernCommandCard } from '@/components/dashboard/modern-command-card';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { Search, Sparkles, TrendingUp, Zap, Star, Rocket, Target } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { commands, incrementViews } = useCommands();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedLevel, setSelectedLevel] = useState('Todos');
  const [filteredCommands, setFilteredCommands] = useState(commands);
  const [isGridVisible, setIsGridVisible] = useState(false);

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
      <DashboardHeader />
      
      <main className="container mx-auto px-6 py-12 max-w-7xl relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating geometric shapes */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full blur-xl animate-pulse delay-2000"></div>
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]"></div>
        </div>

        {/* Enhanced Hero Section */}
        <div className="relative text-center mb-20">
          {/* Animated badge */}
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-blue-900/30 border border-blue-200/50 dark:border-blue-700/50 text-blue-700 dark:text-blue-300 px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
            <div className="relative">
              <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              <div className="absolute inset-0 bg-blue-400 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
              Mais de {commands.length} comandos especializados
            </span>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <Star key={i} className="h-3 w-3 text-amber-400 fill-current animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
              ))}
            </div>
          </div>

          {/* Main title with enhanced typography */}
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-gray-100 mb-6 leading-tight tracking-tight">
            <span className="block">Comandos ChatGPT para</span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-600 bg-clip-text text-transparent animate-gradient bg-300% relative">
              PMEs
              {/* Underline decoration */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
            </span>
          </h1>

          {/* Enhanced description */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8 font-medium">
            Acelere seu negócio com prompts profissionais 
            <span className="text-blue-600 dark:text-blue-400 font-semibold"> testados e otimizados </span>
            para resultados reais
          </p>

          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {[
              { icon: Rocket, text: 'Resultados Imediatos', color: 'from-blue-500 to-blue-600' },
              { icon: Target, text: 'Focado em PMEs', color: 'from-emerald-500 to-emerald-600' },
              { icon: Zap, text: 'Fácil de Usar', color: 'from-amber-500 to-amber-600' }
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className={`p-2 rounded-full bg-gradient-to-r ${feature.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Animated scroll indicator */}
          <div className="flex justify-center">
            <div className="animate-bounce">
              <div className="w-6 h-10 border-2 border-gray-300 dark:border-gray-600 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <DashboardStats />

        {/* Filters */}
        <ModernCommandFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedLevel={selectedLevel}
          onLevelChange={setSelectedLevel}
        />

        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {filteredCommands.length} comandos encontrados
            </h2>
          </div>
          {searchTerm && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Resultados para "{searchTerm}"
            </div>
          )}
        </div>

        {/* Enhanced Commands Grid */}
        {filteredCommands.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                <ModernCommandCard
                  {...command}
                  onViewDetails={handleViewDetails}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Search className="h-12 w-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Nenhum comando encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
              Tente ajustar seus filtros ou buscar por outros termos para encontrar o comando perfeito
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Todas');
                setSelectedLevel('Todos');
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </main>
    </div>
  );
}