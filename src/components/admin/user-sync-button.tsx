"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database, CheckCircle, AlertTriangle, Users } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const UserSyncButton: React.FC = () => {
  const [syncing, setSyncing] = useState(false);

  const syncUsers = async () => {
    setSyncing(true);
    
    try {
      console.log('🔄 Iniciando sincronização de usuários...');
      
      // Mostrar progresso
      toast.loading('Verificando usuários no sistema...', { id: 'sync-users' });

      // 1. Buscar todos os usuários do Supabase Auth
      const { data: authResponse, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('❌ Erro ao buscar usuários do Auth:', authError);
        throw new Error('Erro ao acessar sistema de autenticação: ' + authError.message);
      }

      const authUsers = authResponse.users || [];
      console.log(`📊 Encontrados ${authUsers.length} usuários no Auth`);

      // 2. Buscar usuários existentes na tabela profiles
      const { data: existingProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email');

      if (profilesError) {
        console.error('❌ Erro ao buscar profiles:', profilesError);
        throw new Error('Erro ao acessar tabela de perfis: ' + profilesError.message);
      }

      const existingIds = new Set((existingProfiles || []).map(p => p.id));
      console.log(`📋 Encontrados ${existingProfiles?.length || 0} perfis existentes`);

      // 3. Identificar usuários que precisam ser sincronizados
      const usersToSync = authUsers.filter(user => !existingIds.has(user.id));
      
      console.log(`🔍 Usuários para sincronizar: ${usersToSync.length}`);

      if (usersToSync.length === 0) {
        toast.dismiss('sync-users');
        toast.success('✅ Todos os usuários já estão sincronizados!', {
          description: `${authUsers.length} usuários verificados`
        });
        return;
      }

      // 4. Mostrar progresso da sincronização
      toast.loading(`Sincronizando ${usersToSync.length} usuários...`, { id: 'sync-users' });

      // 5. Criar perfis para usuários não sincronizados
      const profilesData = usersToSync.map(user => {
        // Determinar role baseado no email
        const isAdmin = ['admin@easyscale.com', 'julionavyy@gmail.com'].includes(user.email || '');
        
        return {
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || 
                user.user_metadata?.full_name || 
                user.email?.split('@')[0] || 
                'Usuário',
          role: isAdmin ? 'admin' : 'user',
          status: 'ativo',
          phone: user.user_metadata?.phone || null,
          company: user.user_metadata?.company || null,
          commands_used: 0,
          last_access: user.last_sign_in_at || user.created_at,
          created_at: user.created_at,
          updated_at: new Date().toISOString()
        };
      });

      console.log('📝 Dados dos perfis a serem criados:', profilesData);

      // 6. Inserir perfis em lote
      const { data: insertedProfiles, error: insertError } = await supabase
        .from('profiles')
        .insert(profilesData)
        .select();

      if (insertError) {
        console.error('❌ Erro ao inserir perfis:', insertError);
        throw new Error('Erro ao criar perfis: ' + insertError.message);
      }

      console.log('✅ Perfis criados com sucesso:', insertedProfiles?.length);

      // 7. Mostrar resultado
      toast.dismiss('sync-users');
      toast.success(`✅ ${usersToSync.length} usuários sincronizados com sucesso!`, {
        description: `Total de usuários: ${authUsers.length}`
      });

      // 8. Recarregar a página para mostrar os novos usuários
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error: any) {
      console.error('💥 Erro na sincronização:', error);
      
      toast.dismiss('sync-users');
      
      if (error.message?.includes('JWT')) {
        toast.error('❌ Erro de autenticação', {
          description: 'Você não tem permissão para sincronizar usuários'
        });
      } else if (error.message?.includes('network')) {
        toast.error('❌ Erro de conexão', {
          description: 'Verifique sua conexão com a internet'
        });
      } else {
        toast.error('❌ Erro na sincronização', {
          description: error.message || 'Tente novamente em alguns instantes'
        });
      }
    } finally {
      setSyncing(false);
    }
  };

  const checkSyncStatus = async () => {
    try {
      // Verificar rapidamente se há usuários para sincronizar
      const { data: authResponse } = await supabase.auth.admin.listUsers();
      const { data: profiles } = await supabase.from('profiles').select('id');
      
      const authCount = authResponse?.users?.length || 0;
      const profileCount = profiles?.length || 0;
      
      return {
        authUsers: authCount,
        profiles: profileCount,
        needsSync: authCount > profileCount
      };
    } catch (error) {
      return { authUsers: 0, profiles: 0, needsSync: false };
    }
  };

  return (
    <div className="relative group">
      <Button
        onClick={syncUsers}
        disabled={syncing}
        variant="outline"
        size="sm"
        className="border-green-300 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 hover:scale-105 hover:shadow-md"
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
      
      {/* Tooltip explicativo */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
        <div className="text-center">
          <div className="font-semibold">Sincronizar Usuários</div>
          <div className="text-gray-300 dark:text-gray-600">
            Importa usuários do Auth para a tabela de perfis
          </div>
        </div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-100 rotate-45"></div>
      </div>
    </div>
  );
};