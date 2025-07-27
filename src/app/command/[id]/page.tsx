"use client";

import React, { useEffect, useRef } from 'react';
import { useCommands } from '@/contexts/commands-context';
import { useParams } from 'next/navigation';
import { CommandDetail } from '@/components/command/command-detail';
import { useAuth } from '@/components/auth/auth-provider';

export default function CommandDetailPage() {
  const { getCommandById, getRelatedCommands, incrementViews } = useCommands();
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const commandId = params.id as string;
  
  // Usar useRef para controlar se já incrementou as visualizações
  const hasIncrementedViews = useRef(false);

  const command = getCommandById(commandId);
  const relatedCommands = getRelatedCommands(commandId);

  // Incrementar visualizações apenas uma vez quando a página carregar
  useEffect(() => {
    if (command && !authLoading && !hasIncrementedViews.current) {
      console.log('👁️ Incrementando visualizações para comando:', command.title);
      incrementViews(commandId);
      hasIncrementedViews.current = true;
    }
  }, [command, commandId, authLoading]); // Removido incrementViews das dependências

  // Reset do flag quando o commandId mudar (navegação para outro comando)
  useEffect(() => {
    hasIncrementedViews.current = false;
  }, [commandId]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acesso restrito</h1>
          <p className="text-gray-600 mb-4">Faça login para visualizar os comandos.</p>
        </div>
      </div>
    );
  }

  if (!command) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Comando não encontrado</h1>
          <p className="text-gray-600 mb-4">O comando que você está procurando não existe.</p>
        </div>
      </div>
    );
  }

  return (
    <CommandDetail 
      command={command} 
      relatedCommands={relatedCommands} 
    />
  );
}