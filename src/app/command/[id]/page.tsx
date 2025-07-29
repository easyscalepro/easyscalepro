"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCommands } from '@/contexts/commands-context';
import { useAuth } from '@/components/auth/auth-provider';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { CommandDetail } from '@/components/command/command-detail';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CommandPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { 
    getCommandById, 
    getCommandByIdFromDB, 
    getRelatedCommands,
    incrementViews
  } = useCommands();
  
  const [command, setCommand] = useState<any>(null);
  const [relatedCommands, setRelatedCommands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const commandId = params.id as string;

  useEffect(() => {
    const loadCommand = async () => {
      if (!commandId) return;

      try {
        setLoading(true);
        console.log('🔍 Carregando comando:', commandId);

        // Tentar buscar do contexto primeiro
        let commandData = getCommandById(commandId);
        
        // Se não encontrar no contexto, buscar do banco
        if (!commandData) {
          console.log('⚠️ Comando não encontrado no contexto, buscando do banco...');
          commandData = await getCommandByIdFromDB(commandId);
        }

        if (!commandData) {
          console.error('❌ Comando não encontrado');
          toast.error('Comando não encontrado');
          router.push('/dashboard');
          return;
        }

        // Incrementar visualizações
        await incrementViews(commandId);

        setCommand(commandData);
        
        // Carregar comandos relacionados
        const related = getRelatedCommands(commandId);
        setRelatedCommands(related);

        console.log('✅ Comando carregado:', commandData.title);
      } catch (error) {
        console.error('💥 Erro ao carregar comando:', error);
        toast.error('Erro ao carregar comando');
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadCommand();
  }, [commandId]); // Apenas commandId como dependência

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Carregando comando...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!command) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Comando não encontrado</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">O comando que você está procurando não existe ou foi removido.</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <CommandDetail 
        command={command} 
        relatedCommands={relatedCommands} 
      />
    </ProtectedRoute>
  );
}