"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { CommandFilters } from '@/components/dashboard/command-filters';
import { CommandCard } from '@/components/dashboard/command-card';

// Dados mockados para demonstração
const mockCommands = [
  {
    id: '1',
    title: 'Estratégia de Marketing Digital',
    description: 'Crie uma estratégia completa de marketing digital para sua empresa',
    category: 'Marketing',
    level: 'intermediário' as const,
    prompt: 'Crie uma estratégia de marketing digital completa para uma empresa de [SETOR] que quer aumentar suas vendas online em 50% nos próximos 6 meses...'
  },
  {
    id: '2',
    title: 'Análise Financeira Mensal',
    description: 'Gere relatórios financeiros detalhados para tomada de decisão',
    category: 'Finanças',
    level: 'avançado' as const,
    prompt: 'Analise os dados financeiros da empresa e crie um relatório mensal com insights acionáveis...'
  },
  {
    id: '3',
    title: 'Gestão de Equipe Remota',
    description: 'Melhore a produtividade da sua equipe remota',
    category: 'Gestão',
    level: 'iniciante' as const,
    prompt: 'Desenvolva um plano de gestão para equipe remota focado em produtividade e engajamento...'
  },
  {
    id: '4',
    title: 'Script de Vendas Persuasivo',
    description: 'Crie scripts de vendas que convertem mais clientes',
    category: 'Vendas',
    level: 'intermediário' as const,
    prompt: 'Desenvolva um script de vendas persuasivo para [PRODUTO/SERVIÇO] focado em objeções comuns...'
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
        command.description.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0F1115] mb-2">
            Comandos ChatGPT para PMEs
          </h1>
          <p className="text-gray-600">
            Acesse mais de 1.000 comandos especializados para impulsionar seu negócio
          </p>
        </div>

        <CommandFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedLevel={selectedLevel}
          onLevelChange={setSelectedLevel}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommands.map((command) => (
            <CommandCard
              key={command.id}
              {...command}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        {filteredCommands.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Nenhum comando encontrado com os filtros selecionados.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}