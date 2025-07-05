"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const UserSyncButton: React.FC = () => {
  const [syncing, setSyncing] = useState(false);

  const syncUsers = async () => {
    setSyncing(true);
    try {
      // Buscar usuários do auth.users que não estão na tabela profiles
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        throw authError;
      }

      // Buscar usuários existentes na tabela profiles
      const { data: existingProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id');

      if (profilesError) {
        throw profilesError;
      }

      const existingIds = new Set(existingProfiles?.map(p => p.id) || []);
      const usersToSync = authUsers.users.filter(user => !existingIds.has(user.id));

      console.log(`Encontrados ${usersToSync.length} usuários para sincronizar`);

      if (usersToSync.length === 0) {
        toast.success('Todos os usuários já estão sincronizados!');
        return;
      }

      // Inserir usuários faltantes na tabela profiles
      const profilesData = usersToSync.map(user => ({
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
        role: ['admin@easyscale.com', 'julionavyy@gmail.com'].includes(user.email || '') ? 'admin' : 'user',
        status: 'ativo',
        phone: user.user_metadata?.phone || null,
        company: user.user_metadata?.company || null,
        commands_used: 0,
        last_access: new Date().toISOString(),
        created_at: user.created_at,
        updated_at: new Date().toISOString()
      }));

      const { error: insertError } = await supabase
        .from('profiles')
        .insert(profilesData);

      if (insertError) {
        throw insertError;
      }

      toast.success(`${usersToSync.length} usuários sincronizados com sucesso!`);
      
      // Recarregar a página para mostrar os novos usuários
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error: any) {
      console.error('Erro ao sincronizar usuários:', error);
      toast.error('Erro ao sincronizar usuários: ' + error.message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Button
      onClick={syncUsers}
      disabled={syncing}
      variant="outline"
      size="sm"
      className="border-green-300 text-green-600 hover:bg-green-50"
    >
      {syncing ? (
        <>
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          Sincronizando...
        </>
      ) : (
        <>
          <Database className="h-4 w-4 mr-2" />
          Sincronizar Usuários
        </>
      )}
    </Button>
  );
};