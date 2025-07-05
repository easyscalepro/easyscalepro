"use client";

import { useState } from 'react';

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const commands = [
    {
      id: 1,
      title: 'Estratégia de Marketing Digital',
      description: 'Desenvolva uma estratégia completa de marketing digital',
      category: 'Marketing',
      level: 'Intermediário'
    },
    {
      id: 2,
      title: 'Análise Financeira Mensal',
      description: 'Gere relatórios financeiros detalhados',
      category: 'Finanças',
      level: 'Avançado'
    },
    {
      id: 3,
      title: 'Gestão de Equipe Remota',
      description: 'Otimize a produtividade da sua equipe remota',
      category: 'Gestão',
      level: 'Iniciante'
    }
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cmd.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">EasyScale Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Bem-vindo, Admin!</span>
              <a href="/login" className="text-blue-600 hover:text-blue-800 text-sm">
                Sair
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Total de Comandos</h3>
            <p className="text-3xl font-bold text-blue-600">{commands.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Usuários Ativos</h3>
            <p className="text-3xl font-bold text-green-600">1,247</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Taxa de Sucesso</h3>
            <p className="text-3xl font-bold text-purple-600">94.2%</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar comandos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Commands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommands.map((command) => (
            <div key={command.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {command.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {command.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {command.category}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                    {command.level}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                    Copiar
                  </button>
                  <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors">
                    Ver
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCommands.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum comando encontrado</p>
          </div>
        )}
      </main>
    </div>
  );
}