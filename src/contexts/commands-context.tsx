"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

export interface Command {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'iniciante' | 'intermediário' | 'avançado';
  prompt: string;
  usage: string;
  tags: string[];
  createdAt: string;
  views: number;
  copies: number;
  popularity: number;
  estimatedTime: string;
}

interface CommandsContextType {
  commands: Command[];
  favorites: string[];
  addCommand: (command: Omit<Command, 'id' | 'createdAt' | 'views' | 'copies' | 'popularity'>) => void;
  updateCommand: (id: string, command: Partial<Command>) => void;
  deleteCommand: (id: string) => void;
  toggleFavorite: (id: string) => void;
  incrementViews: (id: string) => void;
  incrementCopies: (id: string) => void;
  getCommandById: (id: string) => Command | undefined;
  getRelatedCommands: (id: string) => Command[];
}

const CommandsContext = createContext<CommandsContextType | undefined>(undefined);

export const useCommands = () => {
  const context = useContext(CommandsContext);
  if (!context) {
    throw new Error('useCommands must be used within a CommandsProvider');
  }
  return context;
};

const initialCommands: Command[] = [
  {
    id: '1',
    title: 'Estratégia de Marketing Digital Completa',
    description: 'Desenvolva uma estratégia abrangente de marketing digital para impulsionar o crescimento da sua empresa',
    category: 'Marketing',
    level: 'intermediário',
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
    usage: 'Este prompt é ideal para empresários e profissionais de marketing que precisam desenvolver uma estratégia digital robusta. Substitua [INSERIR SETOR] pelo setor da sua empresa e ajuste conforme necessário.',
    tags: ['marketing', 'digital', 'estratégia', 'vendas', 'crescimento'],
    createdAt: '2024-01-15',
    views: 245,
    copies: 89,
    popularity: 95,
    estimatedTime: '15 min'
  },
  {
    id: '2',
    title: 'Análise Financeira Mensal Detalhada',
    description: 'Gere relatórios financeiros detalhados com insights acionáveis para tomada de decisão estratégica',
    category: 'Finanças',
    level: 'avançado',
    prompt: `Atue como um CFO experiente e analise os dados financeiros da empresa.

Crie um relatório financeiro mensal completo incluindo:

1. ANÁLISE DE RECEITAS
- Receita bruta vs líquida
- Análise por produto/serviço
- Comparativo com mês anterior
- Tendências e sazonalidade

2. ANÁLISE DE CUSTOS
- Custos fixos vs variáveis
- Margem de contribuição
- Análise de eficiência operacional
- Oportunidades de redução

3. FLUXO DE CAIXA
- Entradas e saídas
- Projeção para próximos 3 meses
- Capital de giro necessário
- Pontos de atenção

4. INDICADORES FINANCEIROS
- ROI, ROE, EBITDA
- Liquidez corrente
- Endividamento
- Rentabilidade

5. INSIGHTS E RECOMENDAÇÕES
- Principais achados
- Ações recomendadas
- Alertas e riscos
- Oportunidades identificadas

Use os dados: [INSERIR DADOS FINANCEIROS]`,
    usage: 'Substitua [INSERIR DADOS FINANCEIROS] pelos dados reais da sua empresa. Ideal para gestores que precisam de análises financeiras profissionais.',
    tags: ['finanças', 'relatórios', 'análise', 'kpis', 'gestão'],
    createdAt: '2024-01-10',
    views: 189,
    copies: 67,
    popularity: 88,
    estimatedTime: '20 min'
  },
  {
    id: '3',
    title: 'Gestão de Equipe Remota Eficiente',
    description: 'Otimize a produtividade e engajamento da sua equipe remota com metodologias comprovadas',
    category: 'Gestão',
    level: 'iniciante',
    prompt: `Atue como um especialista em gestão de equipes remotas.

Desenvolva um plano completo de gestão para uma equipe remota de [NÚMERO] pessoas, focado em produtividade e engajamento.

O plano deve incluir:

1. ESTRUTURA DE COMUNICAÇÃO
- Ferramentas de comunicação
- Frequência de reuniões
- Protocolos de comunicação
- Canais para diferentes tipos de conversa

2. METODOLOGIAS DE TRABALHO
- Framework ágil adaptado
- Gestão de projetos
- Definição de metas e OKRs
- Acompanhamento de resultados

3. CULTURA E ENGAJAMENTO
- Rituais de equipe
- Reconhecimento e feedback
- Desenvolvimento profissional
- Work-life balance

4. FERRAMENTAS E TECNOLOGIA
- Stack tecnológico recomendado
- Segurança da informação
- Backup e contingência
- Treinamento em ferramentas

5. MÉTRICAS E ACOMPANHAMENTO
- KPIs de produtividade
- Indicadores de engajamento
- Pesquisas de satisfação
- Relatórios de performance

Inclua cronograma de implementação e melhores práticas.`,
    usage: 'Substitua [NÚMERO] pela quantidade de pessoas da sua equipe. Adapte as metodologias conforme o perfil da sua empresa.',
    tags: ['gestão', 'remoto', 'produtividade', 'equipe', 'liderança'],
    createdAt: '2024-01-08',
    views: 156,
    copies: 45,
    popularity: 92,
    estimatedTime: '10 min'
  },
  {
    id: '4',
    title: 'Script de Vendas Persuasivo e Eficaz',
    description: 'Crie scripts de vendas altamente eficazes que convertem prospects em clientes fiéis',
    category: 'Vendas',
    level: 'intermediário',
    prompt: `Atue como um especialista em vendas com histórico comprovado de alta conversão.

Crie um script de vendas persuasivo para [PRODUTO/SERVIÇO] direcionado ao público [PÚBLICO-ALVO].

O script deve incluir:

1. ABERTURA IMPACTANTE
- Hook inicial
- Apresentação pessoal
- Quebra de objeções iniciais
- Criação de rapport

2. DESCOBERTA DE NECESSIDADES
- Perguntas qualificadoras
- Identificação de dores
- Mapeamento de motivações
- Urgência e importância

3. APRESENTAÇÃO DA SOLUÇÃO
- Benefícios vs características
- Prova social e cases
- Demonstração de valor
- ROI esperado

4. TRATAMENTO DE OBJEÇÕES
- Objeções mais comuns
- Respostas preparadas
- Técnicas de reversão
- Reforço de benefícios

5. FECHAMENTO
- Técnicas de fechamento
- Criação de urgência
- Próximos passos
- Follow-up

Inclua variações para diferentes perfis de cliente e situações.`,
    usage: 'Substitua [PRODUTO/SERVIÇO] e [PÚBLICO-ALVO] pelas informações específicas do seu negócio. Pratique o script antes de usar.',
    tags: ['vendas', 'conversão', 'persuasão', 'script', 'fechamento'],
    createdAt: '2024-01-05',
    views: 198,
    copies: 76,
    popularity: 90,
    estimatedTime: '12 min'
  },
  {
    id: '5',
    title: 'Plano de Conteúdo para Redes Sociais',
    description: 'Desenvolva um calendário editorial estratégico para maximizar o engajamento nas redes sociais',
    category: 'Marketing',
    level: 'iniciante',
    prompt: `Atue como um especialista em marketing de conteúdo e redes sociais.

Crie um plano de conteúdo mensal para [EMPRESA/MARCA] nas redes sociais [PLATAFORMAS].

O plano deve incluir:

1. ESTRATÉGIA DE CONTEÚDO
- Objetivos por plataforma
- Tom de voz e personalidade
- Pilares de conteúdo
- Frequência de postagem

2. CALENDÁRIO EDITORIAL
- 30 dias de conteúdo
- Tipos de post por dia
- Horários otimizados
- Hashtags estratégicas

3. TIPOS DE CONTEÚDO
- Posts educativos
- Entretenimento
- Promocional
- User-generated content
- Behind the scenes

4. ENGAJAMENTO
- Estratégias de interação
- Resposta a comentários
- Stories e reels
- Lives e eventos

5. MÉTRICAS E ANÁLISE
- KPIs por plataforma
- Ferramentas de monitoramento
- Relatórios semanais
- Otimizações baseadas em dados

Inclua exemplos de posts e templates reutilizáveis.`,
    usage: 'Substitua [EMPRESA/MARCA] e [PLATAFORMAS] pelas informações do seu negócio. Adapte o tom de voz conforme sua marca.',
    tags: ['social media', 'conteúdo', 'engajamento', 'calendário', 'marketing'],
    createdAt: '2024-01-03',
    views: 167,
    copies: 54,
    popularity: 85,
    estimatedTime: '8 min'
  },
  {
    id: '6',
    title: 'Análise de Concorrência Completa',
    description: 'Realize uma análise profunda dos concorrentes para identificar oportunidades de mercado',
    category: 'Estratégia',
    level: 'avançado',
    prompt: `Atue como um consultor estratégico especializado em análise competitiva.

Faça uma análise detalhada da concorrência para [EMPRESA] no setor [SETOR].

A análise deve incluir:

1. MAPEAMENTO COMPETITIVO
- Concorrentes diretos e indiretos
- Posicionamento no mercado
- Share de mercado estimado
- Força competitiva

2. ANÁLISE DE PRODUTOS/SERVIÇOS
- Portfolio de ofertas
- Preços e estratégias
- Diferenciais competitivos
- Gaps identificados

3. ESTRATÉGIAS DE MARKETING
- Canais utilizados
- Mensagens principais
- Investimento estimado
- Efetividade das campanhas

4. ANÁLISE DIGITAL
- Presença online
- SEO e palavras-chave
- Redes sociais
- User experience

5. SWOT COMPETITIVA
- Forças de cada concorrente
- Fraquezas identificadas
- Oportunidades de mercado
- Ameaças potenciais

6. RECOMENDAÇÕES ESTRATÉGICAS
- Posicionamento recomendado
- Estratégias de diferenciação
- Oportunidades de nicho
- Plano de ação

Inclua matriz competitiva e benchmarking detalhado.`,
    usage: 'Substitua [EMPRESA] e [SETOR] pelas informações específicas. Use ferramentas como SimilarWeb e SEMrush para dados complementares.',
    tags: ['concorrência', 'análise', 'mercado', 'estratégia', 'benchmarking'],
    createdAt: '2024-01-01',
    views: 134,
    copies: 41,
    popularity: 87,
    estimatedTime: '25 min'
  }
];

export const CommandsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [commands, setCommands] = useState<Command[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Carregar dados do localStorage ou usar dados iniciais
    const savedCommands = localStorage.getItem('easyscale_commands');
    const savedFavorites = localStorage.getItem('easyscale_favorites');
    
    if (savedCommands) {
      setCommands(JSON.parse(savedCommands));
    } else {
      setCommands(initialCommands);
      localStorage.setItem('easyscale_commands', JSON.stringify(initialCommands));
    }
    
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const saveCommands = (newCommands: Command[]) => {
    setCommands(newCommands);
    localStorage.setItem('easyscale_commands', JSON.stringify(newCommands));
  };

  const saveFavorites = (newFavorites: string[]) => {
    setFavorites(newFavorites);
    localStorage.setItem('easyscale_favorites', JSON.stringify(newFavorites));
  };

  const addCommand = (commandData: Omit<Command, 'id' | 'createdAt' | 'views' | 'copies' | 'popularity'>) => {
    const newCommand: Command = {
      ...commandData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      views: 0,
      copies: 0,
      popularity: Math.floor(Math.random() * 100)
    };
    
    const newCommands = [...commands, newCommand];
    saveCommands(newCommands);
    toast.success('Comando criado com sucesso!');
  };

  const updateCommand = (id: string, updates: Partial<Command>) => {
    const newCommands = commands.map(cmd => 
      cmd.id === id ? { ...cmd, ...updates } : cmd
    );
    saveCommands(newCommands);
    toast.success('Comando atualizado com sucesso!');
  };

  const deleteCommand = (id: string) => {
    const newCommands = commands.filter(cmd => cmd.id !== id);
    saveCommands(newCommands);
    
    // Remover dos favoritos também
    const newFavorites = favorites.filter(fav => fav !== id);
    saveFavorites(newFavorites);
    
    toast.success('Comando excluído com sucesso!');
  };

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id];
    
    saveFavorites(newFavorites);
    
    const action = favorites.includes(id) ? 'removido dos' : 'adicionado aos';
    toast.success(`Comando ${action} favoritos!`);
  };

  const incrementViews = (id: string) => {
    const newCommands = commands.map(cmd => 
      cmd.id === id ? { ...cmd, views: cmd.views + 1 } : cmd
    );
    saveCommands(newCommands);
  };

  const incrementCopies = (id: string) => {
    const newCommands = commands.map(cmd => 
      cmd.id === id ? { ...cmd, copies: cmd.copies + 1 } : cmd
    );
    saveCommands(newCommands);
  };

  const getCommandById = (id: string) => {
    return commands.find(cmd => cmd.id === id);
  };

  const getRelatedCommands = (id: string) => {
    const command = getCommandById(id);
    if (!command) return [];
    
    return commands
      .filter(cmd => cmd.id !== id && cmd.category === command.category)
      .slice(0, 3);
  };

  return (
    <CommandsContext.Provider value={{
      commands,
      favorites,
      addCommand,
      updateCommand,
      deleteCommand,
      toggleFavorite,
      incrementViews,
      incrementCopies,
      getCommandById,
      getRelatedCommands
    }}>
      {children}
    </CommandsContext.Provider>
  );
};