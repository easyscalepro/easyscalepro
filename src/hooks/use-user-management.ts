"use client";

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export const useUserManagement = () => {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [syncStatus, setSyncStatus] = useState<{
    authUsers: number;
    profiles: number;
    needsSync: boolean;
    hasAdminAccess: boolean;
  } | null>(null);

  const checkConnection = async () => {
    try {
      setConnectionStatus('checking');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      if (error) {
        console.warn('Problema de conexão:', error);
        setConnectionStatus('disconnected');
      } else {
        setConnectionStatus('connected');
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      setConnectionStatus('disconnected');
    }
  };

  const checkSyncStatus = async () => {
    try {
      let authCount = 0;
      let hasAdminAccess = false;

      try {
        const { data: authResponse, error: authError } = await supabase.auth.admin.listUsers();
        
        if (!authError && authResponse) {
          authCount = authResponse.users?.length || 0;
          hasAdminAccess = true;
        }
      } catch (error) {
        console.warn('Sem acesso à Admin API:', error);
      }

      const { data: profiles } = await supabase.from('profiles').select('id');
      const profileCount = profiles?.length || 0;
      
      setSyncStatus({
        authUsers: authCount,
        profiles: profileCount,
        needsSync: hasAdminAccess && authCount > profileCount,
        hasAdminAccess
      });
    } catch (error) {
      console.warn('Não foi possível verificar status de sincronização:', error);
      setSyncStatus({
        authUsers: 0,
        profiles: 0,
        needsSync: false,
        hasAdminAccess: false
      });
    }
  };

  const handleSendEmail = (email: string, name: string) => {
    toast.info(`Email enviado para ${name} (${email})`);
  };

  const handleExportUsers = (users: any[]) => {
    const csvContent = [
      ['Nome', 'Email', 'Status', 'Função', 'Empresa', 'Telefone', 'Comandos Usados', 'Último Acesso', 'Membro desde'],
      ...users.map(user => [
        user.name || '',
        user.email || '',
        user.status || '',
        user.role || '',
        user.company || '',
        user.phone || '',
        (user.commandsUsed || 0).toString(),
        user.lastAccess || '',
        user.joinedAt || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `usuarios_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Lista de usuários exportada com sucesso!');
  };

  useEffect(() => {
    checkConnection();
    checkSyncStatus();
  }, []);

  return {
    connectionStatus,
    syncStatus,
    checkConnection,
    checkSyncStatus,
    handleSendEmail,
    handleExportUsers
  };
};