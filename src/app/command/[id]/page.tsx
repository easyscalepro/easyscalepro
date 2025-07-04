"use client";

import React, { useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useRouter, useParams } from 'next/navigation';
import { CommandDetail } from '@/components/command/command-detail';

export default function CommandDetailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const commandId = params.id as string;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Mock data para demonstração
  const mockCommand = {
    id: commandId,
    title: 'Estratégia de Marketing Digital Completa',
    description: 'Desenvolva uma estratégia abrangente de marketing digital para impulsionar o crescimento da sua empresa',
    category: 'Marketing',
    level: 'intermediário' as const,
    prompt: `Atue como um especialista em marketing digital com mais de 10 anos de experiência. 

Crie uma estratégia completa de marketing digital para uma empresa do setor [INSERIR SETOR] que tem como objetivo aumentar suas vendas online em 50% nos próximos 6 meses.

A estratégia deve incluir:

1. ANÁLISE SITUACIONAL
- Análise SWOT da empresa
- Análise da concorrência
- Identificação do público-alvo

2. OBJETIVOS SMART
- Objetivos específicos, mensuráveis, atingíveis, relevantes e temporais
- KPIs principais para acompanhamento

3. ESTRATÉGIAS POR CANAL
- SEO e Marketing de Conteúdo
- Google Ads e Facebook Ads
- Email Marketing
- Redes Sociais (Instagram, LinkedIn, TikTok)
- Marketing de Influência

4. CRONOGRAMA DE EXECUÇÃO
- Plano de 6 meses dividido por etapas
- Priorização de ações
- Recursos necessários

5. ORÇAMENTO ESTIMADO
- Distribuição de investimento por canal
- ROI esperado por estratégia

6. MÉTRICAS E ACOMPANHAMENTO
- Dashboard de KPIs
- Relatórios mensais
- Ajustes estratégicos

Formate a resposta de forma estruturada e actionable, com exemplos práticos e ferramentas recomendadas.`,
    usage: `Este prompt é ideal para empresários e profissionais de marketing que precisam desenvolver uma estratégia digital robusta. 

**Como usar:**
1. Substitua [INSERIR SETOR] pelo setor da sua empresa
2. Ajuste o percentual de crescimento conforme seu objetivo
3. Adapte o prazo (6 meses) conforme necessário
4. Use o resultado como base para seu planejamento estratégico

**Dica:** Execute este prompt em sessões separadas para cada seção, aprofundando os detalhes conforme necessário.`,
    tags: ['marketing', 'estratégia', 'digital', 'vendas', 'crescimento', 'ROI'],
    createdAt: '2024-01-15',
    views: 245,
    copies: 89
  };

  const mockRelatedCommands = [
    {
      id: '2',
      title: 'Análise de Concorrência Digital',
      category: 'Marketing',
      level: 'intermediário'
    },
    {
      id: '3',
      title: 'Criação de Personas de Cliente',
      category: 'Marketing',
      level: 'iniciante'
    },
    {
      id: '4',
      title: 'Otimização de Campanhas Google Ads',
      category: 'Marketing',
      level: 'avançado'
    }
  ];

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
    <CommandDetail 
      command={mockCommand} 
      relatedCommands={mockRelatedCommands} 
    />
  );
}