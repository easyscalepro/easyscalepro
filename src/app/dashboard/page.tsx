"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ModernCommandFilters } from '@/components/dashboard/modern-command-filters';
import { ModernCommandCard } from '@/components/dashboard/modern-command-card';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { Search, Sparkles, TrendingUp } from 'lucide-react';

// Dados mockados para demonstração
const mockCommands = [
  {
    id: '1',
    title: 'Estratégia de Marketing Digital',
    description: 'Desenvolva uma estratégia completa de marketing digital para impulsionar o crescimento da sua empresa',
    category: 'Marketing',
    level: 'intermediário' as const,
    prompt: 'Crie uma estratégia de marketing digital completa para uma empresa de [SETOR] que quer aumentar suas vendas online em 50% nos próximos 6 meses...',
    tags: ['marketing', 'digital', 'estratégia', 'vendas'],
    popularity: 95,
    estimatedTime: '15 min'
  },
  {
    id: '2',
    title: 'Análise Financeira Mensal',
    description: 'Gere relatórios financeiros detalhados com insights acionáveis para tomada de decisão estratégica',
    category: 'Finanças',
    level: 'avançado' as const,
    prompt: 'Analise os dados financeiros da empresa e crie um relatório mensal com insights acionáveis...',
    tags: ['finanças', 'relatórios', 'análise', 'kpis'],
    popularity: 88,
    estimatedTime: '20 min'
  },
  {
    id: '3',
    title: 'Gestão de Equipe Remota',
    description: 'Otimize a produtividade e engajamento da sua equipe remota com metodologias comprovadas',
    category: 'Gestão',
    level: 'iniciante' as const,
    prompt: 'Desenvolva um plano de gestão para equipe remota focado em produtividade e engajamento...',
    tags: ['gestão', 'remoto', 'produtividade', 'equipe'],
    popularity: 92,
    estimatedTime: '10 min'
  },
  {
    id: '4',
    title: 'Script de Vendas Persuasivo',
    description: 'Crie scripts de vendas altamente eficazes que convertem prospects em clientes fiéis',
    category: 'Vendas',
    level: 'intermediário' as const,
    prompt: 'Desenvolva um script de vendas persuasivo para [PRODUTO/SERVIÇO] focado em objeções comuns...',
    tags: ['vendas', 'conversão', 'persuasão', 'script'],
    popularity: 90,
    estimatedTime: '12 min'
  },
  {
    id: '5',
    title: 'Plano de Conteúdo para Redes Sociais',
    description: 'Desenvolva um calendário editorial estratégico para maximizar o engajamento nas redes sociais',
    category: 'Marketing',
    level: 'iniciante' as const,
    prompt: 'Crie um plano de conteúdo para redes sociais com foco em engajamento e conversão...',
    tags: ['social media', 'conteúdo', 'engajamento', 'calendário'],
    popularity: 85,
    estimatedTime: '8 min'
  },
  {
    id: '6',
    title: 'Análise de Concorrência Completa',
    description: 'Realize uma análise profunda dos concorrentes para identificar oportunidades de mercado',
    category: 'Estratégia',
    level: 'avançado' as const,
    prompt: 'Faça uma análise detalhada da concorrência incluindo pontos fortes, fracos e oportunidades...',
    tags: ['concorrência', 'análise', 'mercado', 'oportunidades'],
    popularity: 87,
    estimatedTime: '25 min'
  }
];

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedLevel, setSelectedLevel] = useState('Todos');
  const [filteredCommands, setFilteredCommands] = useState(mockCommands);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    let filtered = mockCommands;

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
  }, [searchTerm, selectedCategory, selectedLevel]);

  const handleViewDetails = (id: string) => {
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
      
      <main className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Mais de 1.000 comandos especializados
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
            Comandos ChatGPT para
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> PMEs</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Acelere seu negócio com prompts profissionais testados e otimizados para resultados reais
          </p>
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
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </main>
    </div>
  );
}