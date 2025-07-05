"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database, CheckCircle, AlertTriangle, Users, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const UserSyncButton: React.FC = () => {
  const [syncing, setSyncing] = useState(false);

  const syncUsers = async () => {
    setSyncing(true);
    
    try {
      console.log('🔄 Iniciando sincronização de usuários...');
      
      // Mostrar progresso
      toast.loading('Verificando permissões e usuários...', { id: 'sync-users' });

      // 1. Primeiro, verificar se temos acesso admin
      let authUsers = [];
      let hasAdminAccess = false;

      try {
        const { data: authResponse, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) {
          console.warn('⚠️ Erro ao acessar Auth Admin API:', authError);
          throw new Error('Sem permissão para acessar sistema de autenticação');
        }

        authUsers = authResponse.users || [];
        hasAdminAccess = true;
        console.log(`📊 Encontrados ${authUsers.length} usuários no Auth`);

      } catch (authError: any) {
        console.warn('⚠️ Não foi possível acessar Auth Admin API:', authError);
        
        // Fallback: tentar buscar usuário atual
        try {
          const { data: { user: currentUser }, error: currentUserError } = await supabase.auth.getUser();
          
          if (currentUserError || !currentUser) {
            throw new Error('Usuário não autenticado');
          }

          // Se não conseguir acessar admin API, pelo menos sincronizar o usuário atual
          authUsers = [currentUser];
          console.log('📋 Usando fallback: sincronizando apenas usuário atual');
          
        } catch (fallbackError) {
          throw new Error('Não foi possível acessar sistema de autenticação. Verifique suas permissões.');
        }
      }

      // 2. Buscar usuários existentes na tabela profiles
      toast.loading('Verificando perfis existentes...', { id: 'sync-users' });
      
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
          description: hasAdminAccess 
            ? `${authUsers.length} usuários verificados`
            : 'Usuário atual já sincronizado'
        });
        return;
      }

      // 4. Mostrar progresso da sincronização
      toast.loading(`Sincronizando ${usersToSync.length} usuário(s)...`, { id: 'sync-users' });

      // 5. Criar perfis para usuários não sincronizados
      const profilesData = usersToSync.map(user => {
        // Determinar role baseado no email
        const adminEmails = ['admin@easyscale.com', 'julionavyy@gmail.com'];
        const isAdmin = adminEmails.includes(user.email || '');
        
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
          last_access: user.last_sign_in_at || user.created_at || new Date().toISOString(),
          created_at: user.created_at || new Date().toISOString(),
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
        
        // Tentar inserir um por vez se falhar em lote
        if (profilesData.length > 1) {
          console.log('🔄 Tentando inserção individual...');
          let successCount = 0;
          
          for (const profileData of profilesData) {
            try {
              const { error: singleInsertError } = await supabase
                .from('profiles')
                .insert(profileData);
              
              if (!singleInsertError) {
                successCount++;
              } else {
                console.warn('⚠️ Erro ao inserir perfil individual:', singleInsertError);
              }
            } catch (singleError) {
              console.warn('⚠️ Erro na inserção individual:', singleError);
            }
          }
          
          if (successCount > 0) {
            toast.dismiss('sync-users');
            toast.success(`✅ ${successCount} de ${profilesData.length} usuários sincronizados!`, {
              description: successCount < profilesData.length ? 'Alguns usuários já existiam ou tiveram erro' : 'Sincronização concluída'
            });
            
            setTimeout(() => {
              window.location.reload();
            }, 1500);
            return;
          }
        }
        
        throw new Error('Erro ao criar perfis: ' + insertError.message);
      }

      console.log('✅ Perfis criados com sucesso:', insertedProfiles?.length);

      // 7. Mostrar resultado
      toast.dismiss('sync-users');
      toast.success(`✅ ${usersToSync.length} usuário(s) sincronizado(s) com sucesso!`, {
        description: hasAdminAccess 
          ? `Total de usuários: ${authUsers.length}`
          : 'Sincronização do usuário atual concluída'
      });

      // 8. Recarregar a página para mostrar os novos usuários
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error: any) {
      console.error('💥 Erro na sincronização:', error);
      
      toast.dismiss('sync-users');
      
      // Tratamento de erros mais específico
      if (error.message?.includes('permissão') || error.message?.includes('permission')) {
        toast.error('❌ Erro de permissão', {
          description: 'Você não tem permissão para sincronizar usuários. Entre em contato com o administrador.'
        });
      } else if (error.message?.includes('autenticação') || error.message?.includes('authentication')) {
        toast.error('❌ Erro de autenticação', {
          description: 'Faça login novamente e tente sincronizar'
        });
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        toast.error('❌ Erro de conexão', {
          description: 'Verifique sua conexão com a internet e tente novamente'
        });
      } else if (error.message?.includes('tabela') || error.message?.includes('profiles')) {
        toast.error('❌ Erro na base de dados', {
          description: 'Problema ao acessar a tabela de perfis'
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