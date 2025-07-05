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
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: 0
          }}>
            EasyScale Dashboard
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Bem-vindo, Admin!
            </span>
            <a 
              href="/login" 
              style={{
                color: '#2563eb',
                fontSize: '0.875rem',
                textDecoration: 'none'
              }}
            >
              Sair
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '32px 16px'
      }}>
        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1f2937',
              margin: '0 0 8px 0'
            }}>
              Total de Comandos
            </h3>
            <p style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: '#2563eb',
              margin: 0
            }}>
              {commands.length}
            </p>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1f2937',
              margin: '0 0 8px 0'
            }}>
              Usuários Ativos
            </h3>
            <p style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: '#10b981',
              margin: 0
            }}>
              1,247
            </p>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1f2937',
              margin: '0 0 8px 0'
            }}>
              Taxa de Sucesso
            </h3>
            <p style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: '#7c3aed',
              margin: 0
            }}>
              94.2%
            </p>
          </div>
        </div>

        {/* Search */}
        <div style={{ marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="Buscar comandos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '400px',
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none'
            }}
          />
        </div>

        {/* Commands Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {filteredCommands.map((command) => (
            <div 
              key={command.id} 
              style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '8px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                transition: 'box-shadow 0.2s'
              }}
            >
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: '0 0 8px 0'
                }}>
                  {command.title}
                </h3>
                <p style={{
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  margin: '0 0 12px 0'
                }}>
                  {command.description}
                </p>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    fontSize: '0.75rem',
                    borderRadius: '9999px'
                  }}>
                    {command.category}
                  </span>
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: '#f3f4f6',
                    color: '#1f2937',
                    fontSize: '0.75rem',
                    borderRadius: '9999px'
                  }}>
                    {command.level}
                  </span>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{
                    padding: '4px 12px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    fontSize: '0.875rem',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer'
                  }}>
                    Copiar
                  </button>
                  <button style={{
                    padding: '4px 12px',
                    border: '1px solid #d1d5db',
                    color: '#374151',
                    fontSize: '0.875rem',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}>
                    Ver
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCommands.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '48px 0'
          }}>
            <p style={{ color: '#6b7280' }}>Nenhum comando encontrado</p>
          </div>
        )}
      </main>
    </div>
  );
}