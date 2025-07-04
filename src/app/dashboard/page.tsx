"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useCommands } from '@/contexts/commands-context';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ModernCommandFilters } from '@/components/dashboard/modern-command-filters';
import { ModernCommandCard } from '@/components/dashboard/modern-command-card';
import { ModernStats } from '@/components/dashboard/modern-stats';
import { Search, TrendingUp, Filter, Sparkles } from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-blue-950/20 dark:to-indigo-950/30 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-16 h-16 border-4 border-blue-100 dark:border-blue-900/50 rounded-full animate-spin"></div>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-full animate-pulse"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Preparando sua experiência
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Carregando comandos especializados...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-blue-950/20 dark:to-indigo-950/30">
      <DashboardHeader />
      
      <main className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Hero Section Moderno */}
        <div className="text-center mb-16 relative">
          {/* Background decorativo sutil */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-indigo-400/5 rounded-full blur-3xl"></div>
            <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-indigo-400/5 to-purple-400/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 text-blue-700 dark:text-blue-300 px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Mais de {commands.length} comandos especializados para PMEs</span>
            <Sparkles className="h-4 w-4" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
            <span className="block">Comandos</span>
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ChatGPT
            </span>
            <span className="block text-3xl md:text-4xl mt-2 text-gray-700 dark:text-gray-300 font-medium">
              para Empresários
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-10">
            Acelere seu negócio com prompts profissionais testados e otimizados para 
            <span className="font-semibold text-blue-600 dark:text-blue-400"> resultados mensuráveis</span>
          </p>

          {/* CTA elegante */}
          <button 
            onClick={() => setSearchTerm('marketing')}
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <TrendingUp className="h-5 w-5 group-hover:rotate-12 transition-transform" />
            Explorar Comandos
            <div className="w-2 h-2 bg-white/50 rounded-full group-hover:animate-ping"></div>
          </button>
        </div>

        {/* Stats modernos */}
        <div className="mb-16">
          <ModernStats />
        </div>

        {/* Filtros elegantes */}
        <div className="mb-12">
          <ModernCommandFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedLevel={selectedLevel}
            onLevelChange={setSelectedLevel}
          />
        </div>

        {/* Results Header moderno */}
        <div className="flex items-center justify-between mb-10 p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Filter className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {filteredCommands.length} comandos encontrados
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Prontos para impulsionar seu negócio
              </p>
            </div>
          </div>
          {searchTerm && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-xl text-sm font-medium border border-blue-200/50 dark:border-blue-700/50">
              Resultados para "{searchTerm}"
            </div>
          )}
        </div>

        {/* Commands Grid com animação elegante */}
        {filteredCommands.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCommands.map((command, index) => (
              <div
                key={command.id}
                className="animate-fade-in-up"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
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
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                <Search className="h-12 w-12 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Nenhum comando encontrado
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
              Ajuste os filtros ou termos de busca para encontrar comandos relevantes
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Todas');
                setSelectedLevel('Todos');
              }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <TrendingUp className="h-4 w-4" />
              Limpar Filtros
            </button>
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}