"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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

  // Verificar se há sessão válida
  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Erro ao verificar sessão:', error);
        return null;
      }
      
      return session;
    } catch (error) {
      console.error('Erro inesperado ao verificar sessão:', error);
      return null;
    }
  };

  // Carregar usuários do Supabase
  const loadUsers = async () => {
    try {
      console.log('🔄 Carregando usuários do Supabase...');
      setError(null);
      
      // Verificar se há sessão válida antes de tentar acessar dados
      const session = await checkSession();
      
      if (!session) {
        console.log('⚠️ Nenhuma sessão ativa - não é possível carregar usuários');
        setError('Sessão de autenticação ausente. Faça login para acessar os dados.');
        setUsers([]);
        return;
      }

      console.log('✅ Sessão válida encontrada para:', session.user.email);

      // Tentar carregar perfis
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('❌ Erro ao carregar perfis:', profilesError);
        
        // Se for erro de permissão, tentar carregar apenas o perfil do usuário atual
        if (profilesError.code === 'PGRST301' || profilesError.message?.includes('permission')) {
          console.log('🔄 Tentando carregar apenas perfil do usuário atual...');
          
          const { data: userProfile, error: userProfileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userProfileError) {
            console.error('❌ Erro ao carregar perfil do usuário:', userProfileError);
            setError('Sem permissão para acessar dados de usuários');
            setUsers([]);
            return;
          }

          if (userProfile) {
            console.log('✅ Perfil do usuário carregado:', userProfile.email);
            const formattedUser = formatUser(userProfile);
            setUsers([formattedUser]);
            return;
          }
        }
        
        setError(`Erro ao carregar usuários: ${profilesError.message}`);
        setUsers([]);
        return;
      }

      console.log('✅ Perfis carregados:', profiles?.length || 0);

      // Converter dados do Supabase para formato do contexto
      const formattedUsers: User[] = (profiles || []).map(formatUser);
      setUsers(formattedUsers);

    } catch (error: any) {
      console.error('💥 Erro inesperado ao carregar usuários:', error);
      
      // Verificar se é erro de sessão ausente
      if (error.message?.includes('Auth session missing') || error.message?.includes('AuthSessionMissingError')) {
        setError('Sessão de autenticação expirou. Faça login novamente.');
      } else {
        setError(`Erro inesperado: ${error.message || 'Erro desconhecido'}`);
      }
      setUsers([]);
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
      
      // Verificar sessão antes de recarregar
      const session = await checkSession();
      if (!session) {
        throw new Error('Sessão de autenticação ausente');
      }
      
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
      
      // Verificar sessão antes de atualizar
      const session = await checkSession();
      if (!session) {
        throw new Error('Sessão de autenticação ausente');
      }
      
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
      
      // Verificar sessão antes de deletar
      const session = await checkSession();
      if (!session) {
        throw new Error('Sessão de autenticação ausente');
      }
      
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