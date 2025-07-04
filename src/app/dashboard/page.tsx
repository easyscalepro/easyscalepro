"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useCommands } from '@/contexts/commands-context';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ModernCommandFilters } from '@/components/dashboard/modern-command-filters';
import { ModernCommandCard } from '@/components/dashboard/modern-command-card';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { Search, Sparkles, TrendingUp, Zap, Target, Rocket, Star, ArrowRight } from 'lucide-react';

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
          <div className="relative">
            <div className="w-20 h-20 border-4 border-[#FBBF24]/30 rounded-full animate-spin"></div>
            <div className="absolute top-2 left-2 w-16 h-16 border-4 border-[#FBBF24] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-8 text-white font-semibold text-xl">Preparando sua experiência...</p>
          <p className="text-white/70 text-sm mt-2">Carregando comandos especializados</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1115] via-[#1a1f2e] to-[#2563EB] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23FBBF24" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#FBBF24]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl"></div>
      
      <DashboardHeader />
      
      <main className="relative z-10">
        {/* Hero Section Premium */}
        <div className="relative overflow-hidden">
          <div className="container mx-auto px-6 py-16 max-w-7xl">
            <div className="text-center mb-12">
              {/* Badge Premium */}
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FBBF24]/20 to-[#2563EB]/20 backdrop-blur-sm border border-[#FBBF24]/30 text-[#FBBF24] px-6 py-3 rounded-full text-sm font-bold mb-8 shadow-2xl">
                <Star className="h-5 w-5 animate-pulse" />
                <span className="bg-gradient-to-r from-[#FBBF24] to-white bg-clip-text text-transparent">
                  PREMIUM COLLECTION
                </span>
                <span className="text-white/90">•</span>
                <span>{commands.length}+ Comandos</span>
                <Sparkles className="h-5 w-5 animate-pulse" />
              </div>
              
              {/* Main Title */}
              <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
                <span className="block text-white drop-shadow-2xl">Comandos</span>
                <span className="block bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#FBBF24] bg-clip-text text-transparent animate-pulse">
                  ChatGPT
                </span>
                <span className="block text-white drop-shadow-2xl">Profissionais</span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-2xl md:text-3xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12 font-light">
                Transforme seu negócio com 
                <span className="text-[#FBBF24] font-bold"> prompts testados </span>
                por especialistas e otimizados para 
                <span className="text-[#FBBF24] font-bold"> resultados extraordinários</span>
              </p>

              {/* CTA Buttons Premium */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <button
                  onClick={() => document.getElementById('commands-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group relative bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#FBBF24] text-[#0F1115] px-10 py-5 rounded-2xl font-black text-xl transition-all duration-500 transform hover:scale-110 shadow-2xl hover:shadow-[#FBBF24]/25 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#F59E0B] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative flex items-center gap-3">
                    <Rocket className="h-6 w-6 group-hover:animate-bounce" />
                    Explorar Comandos
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                </button>
                
                <button
                  onClick={() => router.push('/favorites')}
                  className="group bg-white/10 backdrop-blur-xl border-2 border-white/20 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/20 hover:border-[#FBBF24]/50 transition-all duration-500 shadow-xl"
                >
                  <span className="flex items-center gap-3">
                    <Target className="h-6 w-6 group-hover:animate-pulse" />
                    Meus Favoritos
                  </span>
                </button>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Resultados Imediatos</h3>
                  <p className="text-gray-300 text-sm">Prompts testados que geram resultados desde o primeiro uso</p>
                </div>
                
                <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Especializado para PMEs</h3>
                  <p className="text-gray-300 text-sm">Comandos criados especificamente para pequenas e médias empresas</p>
                </div>
                
                <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Qualidade Premium</h3>
                  <p className="text-gray-300 text-sm">Cada comando é revisado e otimizado por especialistas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="relative -mt-8 z-20">
          <div className="container mx-auto px-6 max-w-7xl">
            <DashboardStats />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gradient-to-b from-transparent via-gray-50/5 to-gray-50 pt-16">
          <div className="container mx-auto px-6 py-12 max-w-7xl" id="commands-section">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Encontre o Comando
                <span className="block bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] bg-clip-text text-transparent">
                  Perfeito
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Use nossos filtros inteligentes para descobrir exatamente o que seu negócio precisa
              </p>
            </div>

            <ModernCommandFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedLevel={selectedLevel}
              onLevelChange={setSelectedLevel}
            />

            {/* Results Header */}
            <div className="flex items-center justify-between mb-12 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-[#2563EB] to-[#FBBF24] rounded-xl shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">
                    {filteredCommands.length} comandos encontrados
                  </h3>
                  {searchTerm && (
                    <p className="text-gray-300 mt-1">
                      Resultados para "<span className="font-bold text-[#FBBF24]">{searchTerm}</span>"
                    </p>
                  )}
                </div>
              </div>
              
              {filteredCommands.length > 0 && (
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-300">
                  <Star className="h-4 w-4 text-[#FBBF24]" />
                  <span>Ordenado por relevância</span>
                </div>
              )}
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
                <div className="relative mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-[#2563EB]/20 to-[#FBBF24]/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm border border-white/10">
                    <Search className="h-16 w-16 text-[#FBBF24]" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#FBBF24] rounded-full flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-[#0F1115]" />
                  </div>
                </div>
                <h3 className="text-4xl font-bold text-white mb-4">
                  Nenhum comando encontrado
                </h3>
                <p className="text-xl text-gray-300 mb-8 max-w-md mx-auto">
                  Tente ajustar seus filtros ou buscar por outros termos
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('Todas');
                    setSelectedLevel('Todos');
                  }}
                  className="bg-gradient-to-r from-[#2563EB] to-[#FBBF24] hover:from-[#1d4ed8] hover:to-[#F59E0B] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  <span className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Limpar Filtros
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}