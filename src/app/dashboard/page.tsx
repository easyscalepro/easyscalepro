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
      <div className="min-h-screen bg-gradient-to-br from-[#0F1115] via-[#1a1f2e] to-[#2563EB] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FBBF24] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-6 text-white font-medium text-lg">Carregando sua experiência...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1115] via-[#1a1f2e] to-[#2563EB]">
      <DashboardHeader />
      
      <main className="relative">
        {/* Hero Section com Gradiente */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB]/20 to-[#FBBF24]/20"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23FBBF24" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
          
          <div className="relative container mx-auto px-6 py-20 max-w-7xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FBBF24]/20 to-[#2563EB]/20 backdrop-blur-sm border border-[#FBBF24]/30 text-[#FBBF24] px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg">
                <Sparkles className="h-5 w-5" />
                Mais de {commands.length} comandos especializados
                <Rocket className="h-5 w-5" />
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="text-white">Comandos</span>
                <br />
                <span className="bg-gradient-to-r from-[#FBBF24] to-[#2563EB] bg-clip-text text-transparent">
                  ChatGPT
                </span>
                <br />
                <span className="text-white">para PMEs</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
                Acelere seu negócio com prompts profissionais testados e otimizados para 
                <span className="text-[#FBBF24] font-semibold"> resultados reais</span>
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => document.getElementById('commands-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] hover:from-[#F59E0B] hover:to-[#FBBF24] text-[#0F1115] px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
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
                <div className="p-2 bg-gradient-to-r from-[#2563EB] to-[#FBBF24] rounded-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-[#0F1115]">
                    {filteredCommands.length} comandos encontrados
                  </h2>
                  {searchTerm && (
                    <p className="text-gray-600 mt-1">
                      Resultados para "<span className="font-semibold text-[#2563EB]">{searchTerm}</span>"
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Commands Grid */}
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
                <div className="w-32 h-32 bg-gradient-to-br from-[#2563EB]/20 to-[#FBBF24]/20 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Search className="h-16 w-16 text-[#2563EB]" />
                </div>
                <h3 className="text-3xl font-bold text-[#0F1115] mb-4">
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
                  className="bg-gradient-to-r from-[#2563EB] to-[#FBBF24] hover:from-[#1d4ed8] hover:to-[#F59E0B] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
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