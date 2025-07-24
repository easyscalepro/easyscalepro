"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { checkSession, withRequiredAuth, withOptionalAuth } from '@/lib/supabase-utils';

export interface User {
  id: string;
  name: string;
  email: string;
  status: 'ativo' | 'inativo' | 'suspenso';
  role: 'admin' | 'user' | 'moderator';
  lastAccess: string;
  commandsUsed: number;
  joinedAt: string;
  avatar?: string;
  phone?: string;
  company?: string;
}

interface UsersContextType {
  users: User[];
  loading: boolean;
  error: string | null;
  addUser: (user: Omit<User, 'id' | 'joinedAt' | 'commandsUsed' | 'lastAccess'>) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  getUserById: (id: string) => User | undefined;
  toggleUserStatus: (id: string) => Promise<void>;
  refreshUsers: () => Promise<void>;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar usuários do Supabase
  const loadUsers = async () => {
    try {
      console.log('🔄 Iniciando carregamento de usuários...');
      setError(null);
      setLoading(true);
      
      // Primeiro, verificar se temos uma sessão válida
      const session = await checkSession();
      console.log('📋 Sessão verificada:', session ? 'Válida' : 'Inválida');
      
      // Tentar carregar usuários com diferentes estratégias
      let profiles: any[] = [];
      let loadMethod = '';
      
      // Estratégia 1: Tentar carregar todos os perfis (se tiver permissão)
      try {
        console.log('🔍 Tentando carregar todos os perfis...');
        
        const { data: allProfiles, error: allProfilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (!allProfilesError && allProfiles && allProfiles.length > 0) {
          profiles = allProfiles;
          loadMethod = 'todos_perfis';
          console.log('✅ Carregados todos os perfis:', profiles.length);
        } else if (allProfilesError) {
          console.warn('⚠️ Erro ao carregar todos os perfis:', allProfilesError);
          throw allProfilesError;
        }
      } catch (allProfilesError: any) {
        console.warn('⚠️ Falha ao carregar todos os perfis:', allProfilesError.message);
        
        // Estratégia 2: Carregar apenas perfil do usuário atual (se houver sessão)
        if (session) {
          try {
            console.log('🔍 Tentando carregar perfil do usuário atual...');
            
            const { data: userProfile, error: userProfileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (!userProfileError && userProfile) {
              profiles = [userProfile];
              loadMethod = 'perfil_atual';
              console.log('✅ Carregado perfil do usuário atual:', userProfile.email);
            } else {
              console.warn('⚠️ Erro ao carregar perfil do usuário:', userProfileError);
              throw userProfileError;
            }
          } catch (userProfileError: any) {
            console.warn('⚠️ Falha ao carregar perfil do usuário:', userProfileError.message);
            
            // Estratégia 3: Criar perfil básico se não existir
            try {
              console.log('🔧 Tentando criar perfil básico...');
              
              const basicProfile = {
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário',
                role: 'user' as const,
                status: 'ativo' as const,
                commands_used: 0,
                last_access: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              };

              const { data: createdProfile, error: createError } = await supabase
                .from('profiles')
                .insert(basicProfile)
                .select()
                .single();

              if (!createError && createdProfile) {
                profiles = [createdProfile];
                loadMethod = 'perfil_criado';
                console.log('✅ Perfil básico criado:', createdProfile.email);
              } else {
                throw createError;
              }
            } catch (createError: any) {
              console.error('❌ Falha ao criar perfil básico:', createError.message);
              // Não lançar erro aqui - continuar sem perfis
              console.log('⚠️ Continuando sem perfis devido a erro na criação');
            }
          }
        } else {
          // Estratégia 4: Sem sessão - tentar carregar perfis públicos ou continuar vazio
          console.log('ℹ️ Sem sessão ativa - tentando carregar dados públicos...');
          
          try {
            // Tentar uma consulta simples para verificar se consegue acessar a tabela
            const { data: publicProfiles, error: publicError } = await supabase
              .from('profiles')
              .select('id, email, name, role, status, created_at')
              .limit(5);

            if (!publicError && publicProfiles) {
              profiles = publicProfiles;
              loadMethod = 'perfis_publicos';
              console.log('✅ Carregados perfis públicos:', profiles.length);
            } else {
              console.warn('⚠️ Não foi possível carregar perfis públicos:', publicError);
              // Não lançar erro - continuar com lista vazia
              profiles = [];
              loadMethod = 'lista_vazia';
              console.log('ℹ️ Continuando com lista vazia de usuários');
            }
          } catch (publicError) {
            console.warn('⚠️ Erro ao tentar carregar perfis públicos:', publicError);
            // Não lançar erro - continuar com lista vazia
            profiles = [];
            loadMethod = 'lista_vazia_erro';
            console.log('ℹ️ Continuando com lista vazia devido a erro');
          }
        }
      }

      // Converter dados do Supabase para formato do contexto
      if (profiles.length > 0) {
        const formattedUsers: User[] = profiles.map(formatUser);
        setUsers(formattedUsers);
        console.log(`✅ ${formattedUsers.length} usuário(s) carregado(s) via ${loadMethod}`);
      } else {
        console.log('ℹ️ Nenhum perfil encontrado - lista vazia');
        setUsers([]);
      }

    } catch (error: any) {
      console.error('💥 Erro ao carregar usuários:', error);
      
      // Tratamento específico de erros - não falhar completamente
      let errorMessage = 'Não foi possível carregar usuários';
      
      if (error.message?.includes('permission') || error.message?.includes('RLS')) {
        errorMessage = 'Sem permissão para acessar dados de usuários. Faça login como administrador.';
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      } else if (error.message?.includes('table') || error.message?.includes('relation')) {
        errorMessage = 'Tabela de usuários não encontrada. Entre em contato com o administrador.';
      } else if (error.message?.includes('auth') || error.message?.includes('session')) {
        errorMessage = 'Problemas de autenticação. Tente fazer login novamente.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setUsers([]); // Lista vazia em caso de erro
    } finally {
      setLoading(false);
    }
  };

  // Função para formatar dados do usuário
  const formatUser = (profile: any): User => {
    return {
      id: profile.id,
      name: profile.name || profile.email || 'Usuário',
      email: profile.email || '',
      status: profile.status || 'ativo',
      role: profile.role || 'user',
      lastAccess: formatLastAccess(profile.last_access),
      commandsUsed: profile.commands_used || 0,
      joinedAt: formatDate(profile.created_at),
      avatar: profile.avatar_url,
      phone: profile.phone,
      company: profile.company
    };
  };

  // Formatar data de último acesso
  const formatLastAccess = (timestamp: string | null): string => {
    if (!timestamp) return 'Nunca';
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return 'Agora';
      if (diffMins < 60) return `${diffMins} min atrás`;
      if (diffHours < 24) return `${diffHours}h atrás`;
      if (diffDays < 7) return `${diffDays} dias atrás`;
      
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      return 'Data inválida';
    }
  };

  // Formatar data de criação
  const formatDate = (timestamp: string | null): string => {
    if (!timestamp) return new Date().toISOString().split('T')[0];
    try {
      return new Date(timestamp).toISOString().split('T')[0];
    } catch (error) {
      return new Date().toISOString().split('T')[0];
    }
  };

  // Carregar usuários ao inicializar
  useEffect(() => {
    loadUsers();
  }, []);

  const addUser = async (userData: Omit<User, 'id' | 'joinedAt' | 'commandsUsed' | 'lastAccess'>) => {
    try {
      console.log('➕ Adicionando usuário ao contexto:', userData.email);
      
      // Recarregar a lista de usuários
      await loadUsers();
      
      toast.success('Usuário adicionado com sucesso!');
    } catch (error: any) {
      console.error('❌ Erro ao adicionar usuário:', error);
      toast.error('Erro ao adicionar usuário: ' + error.message);
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    try {
      console.log('✏️ Atualizando usuário:', id, updates);
      
      await withRequiredAuth(async () => {
        // Preparar dados para o Supabase
        const supabaseUpdates: any = {
          updated_at: new Date().toISOString()
        };

        if (updates.name !== undefined) supabaseUpdates.name = updates.name;
        if (updates.status !== undefined) supabaseUpdates.status = updates.status;
        if (updates.role !== undefined) supabaseUpdates.role = updates.role;
        if (updates.phone !== undefined) supabaseUpdates.phone = updates.phone;
        if (updates.company !== undefined) supabaseUpdates.company = updates.company;
        if (updates.avatar !== undefined) supabaseUpdates.avatar_url = updates.avatar;
        if (updates.commandsUsed !== undefined) supabaseUpdates.commands_used = updates.commandsUsed;

        const { error } = await supabase
          .from('profiles')
          .update(supabaseUpdates)
          .eq('id', id);

        if (error) {
          console.error('❌ Erro ao atualizar no Supabase:', error);
          throw error;
        }

        return true;
      });

      // Atualizar estado local
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === id ? { ...user, ...updates } : user
        )
      );

      console.log('✅ Usuário atualizado com sucesso');
      toast.success('Usuário atualizado com sucesso!');
    } catch (error: any) {
      console.error('💥 Erro ao atualizar usuário:', error);
      toast.error('Erro ao atualizar usuário: ' + error.message);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      console.log('🗑️ Deletando usuário:', id);
      
      await withRequiredAuth(async () => {
        // Deletar do Supabase
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('❌ Erro ao deletar do Supabase:', error);
          throw error;
        }

        // Tentar deletar do Auth também (pode falhar se não tiver Admin API)
        try {
          const { error: authError } = await supabase.auth.admin.deleteUser(id);
          if (authError) {
            console.warn('⚠️ Não foi possível deletar do Auth:', authError);
          } else {
            console.log('✅ Usuário deletado do Auth também');
          }
        } catch (authError) {
          console.warn('⚠️ Erro ao deletar do Auth (sem Admin API):', authError);
        }

        return true;
      });

      // Atualizar estado local
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));

      console.log('✅ Usuário deletado com sucesso');
      toast.success('Usuário excluído com sucesso!');
    } catch (error: any) {
      console.error('💥 Erro ao deletar usuário:', error);
      toast.error('Erro ao excluir usuário: ' + error.message);
    }
  };

  const getUserById = (id: string) => {
    return users.find(user => user.id === id);
  };

  const toggleUserStatus = async (id: string) => {
    const user = getUserById(id);
    if (user) {
      const newStatus = user.status === 'ativo' ? 'inativo' : 'ativo';
      await updateUser(id, { status: newStatus });
    }
  };

  const refreshUsers = async () => {
    console.log('🔄 Atualizando lista de usuários...');
    setLoading(true);
    await loadUsers();
  };

  return (
    <UsersContext.Provider value={{
      users,
      loading,
      error,
      addUser,
      updateUser,
      deleteUser,
      getUserById,
      toggleUserStatus,
      refreshUsers
    }}>
      {children}
    </UsersContext.Provider>
  );
};