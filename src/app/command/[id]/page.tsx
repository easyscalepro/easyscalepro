"use client";

import React from 'react';
import { useCommands } from '@/contexts/commands-context';
import { useParams } from 'next/navigation';
import { CommandDetail } from '@/components/command/command-detail';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function CommandDetailPage() {
  const { getCommandById, getRelatedCommands } = useCommands();
  const params = useParams();
  const commandId = params.id as string;

  const command = getCommandById(commandId);
  const relatedCommands = getRelatedCommands(commandId);

  if (!command) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Comando não encontrado</h1>
            <p className="text-gray-600 mb-4">O comando que você está procurando não existe.</p>
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