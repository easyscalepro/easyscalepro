"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useCommands } from '@/contexts/commands-context';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ModernCommandFilters } from '@/components/dashboard/modern-command-filters';
import { ModernCommandCard } from '@/components/dashboard/modern-command-card';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { Search, Sparkles, TrendingUp, Zap, Target, Rocket } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { commands, incrementViews } = useCommands();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedLevel, setSelectedLevel] = useState('Todos');
  const [filteredCommands, setFilteredCommands] = useState(commands);

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
  }, [searchTerm, selectedCategory, selectedLevel, commands]);

  const handleViewDetails = (id: string) => {
    incrementViews(id);
    router.push(`/command/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-blue-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-6 text-white font-medium text-lg">Carregando sua experiência...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-blue-800">
      <DashboardHeader />
      
      <main className="relative">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-yellow-400/20"></div>
          
          <div className="relative container mx-auto px-6 py-20 max-w-7xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400/20 to-blue-600/20 backdrop-blur-sm border border-yellow-400/30 text-yellow-400 px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg">
                <Sparkles className="h-5 w-5" />
                Mais de {commands.length} comandos especializados
                <Rocket className="h-5 w-5" />
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="text-white">Comandos</span>
                <br />
                <span className="bg-gradient-to-r from-yellow-400 to-blue-600 bg-clip-text text-transparent">
                  ChatGPT
                </span>
                <br />
                <span className="text-white">para PMEs</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
                Acelere seu negócio com prompts profissionais testados e otimizados para 
                <span className="text-yellow-400 font-semibold"> resultados reais</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => document.getElementById('commands-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  <span className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Explorar Comandos
                    <Zap className="h-5 w-5 group-hover:animate-pulse" />
                  </span>
                </button>
                
                <button
                  onClick={() => router.push('/favorites')}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300"
                >
                  Ver Favoritos
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="relative -mt-10 z-10">
          <div className="container mx-auto px-6 max-w-7xl">
            <DashboardStats />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gradient-to-b from-transparent to-gray-50 pt-12">
          <div className="container mx-auto px-6 py-12 max-w-7xl" id="commands-section">
            <ModernCommandFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedLevel={selectedLevel}
              onLevelChange={setSelectedLevel}
            />

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-yellow-400 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {filteredCommands.length} comandos encontrados
                  </h2>
                  {searchTerm && (
                    <p className="text-gray-600 mt-1">
                      Resultados para "<span className="font-semibold text-blue-600">{searchTerm}</span>"
                    </p>
                  )}
                </div>
              </div>
            </div>

            {filteredCommands.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCommands.map((command) => (
                  <ModernCommandCard
                    key={command.id}
                    {...command}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-600/20 to-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Search className="h-16 w-16 text-blue-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Nenhum comando encontrado
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                  Tente ajustar seus filtros ou buscar por outros termos para encontrar o comando perfeito
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('Todas');
                    setSelectedLevel('Todos');
                  }}
                  className="bg-gradient-to-r from-blue-600 to-yellow-400 hover:from-blue-700 hover:to-yellow-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Limpar Filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}