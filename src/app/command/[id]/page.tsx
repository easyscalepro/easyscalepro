"use client";

import React, { useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useCommands } from '@/contexts/commands-context';
import { useRouter, useParams } from 'next/navigation';
import { CommandDetail } from '@/components/command/command-detail';

export default function CommandDetailPage() {
  const { user, loading } = useAuth();
  const { getCommandById, getRelatedCommands } = useCommands();
  const router = useRouter();
  const params = useParams();
  const commandId = params.id as string;

  const command = getCommandById(commandId);
  const relatedCommands = getRelatedCommands(commandId);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

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

  if (!command) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Comando não encontrado</h1>
          <p className="text-gray-600 mb-4">O comando que você está procurando não existe.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Voltar ao Dashboard
          </button>
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