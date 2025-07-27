"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  phone?: string;
  role: string;
  status: string;
  commandsUsed: number;
  lastAccess: string;
  joinedAt: string;
  commands_used?: number;
  last_access?: string;
  created_at?: string;
}

interface UsersContextType {
  users: User[];
  loading: boolean;
  error: string | null;
  setUsers: (users: User[]) => void;
  setLoading: (loading: boolean) => void;
  refreshUsers: () => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  toggleUserStatus: (id: string) => Promise<void>;
  createUser: (userData: Partial<User>) => Promise<void>;
  updateUser: (id: string, userData: Partial<User>) => Promise<void>;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};

export const UsersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para formatar dados do usuário
  const formatUser = (user: any): User => {
    return {
      id: user.id,
      email: user.email,
      name: user.name || user.email,
      company: user.company,
      phone: user.phone,
      role: user.role || 'user',
      status: user.status || 'ativo',
      commandsUsed: user.commands_used || user.commandsUsed || 0,
      lastAccess: user.last_access || user.lastAccess || 'Nunca',
      joinedAt: user.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'N/A'
    };
  };

  // Verificar se o usuário atual é admin
  const checkIsAdmin = async (): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return false;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      return profile?.role === 'admin';
    } catch (error) {
      console.warn('⚠️ Erro ao verificar se é admin:', error);
      return false;
    }
  };

  // Carregar usuários com diferentes estratégias baseadas em permissões
  const refreshUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Carregando usuários...');
      
      // Verificar se é admin primeiro
      const isAdmin = await checkIsAdmin();
      console.log('👤 É admin:', isAdmin);

      let data, fetchError;

      if (isAdmin) {
        // Se for admin, tentar usar service role ou função específica
        try {
          // Tentar usar a função get_users_by_status que tem SECURITY DEFINER
          const { data: functionData, error: functionError } = await supabase
            .rpc('get_users_by_status');

          if (!functionError && functionData) {
            data = functionData;
            console.log('✅ Usuários carregados via função admin');
          } else {
            throw functionError || new Error('Função não retornou dados');
          }
        } catch (adminError) {
          console.warn('⚠️ Erro ao usar função admin, tentando query normal:', adminError);
          
          // Fallback para query normal
          const result = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });
          
          data = result.data;
          fetchError = result.error;
        }
      } else {
        // Se não for admin, carregar apenas perfis ativos
        const result = await supabase
          .from('profiles')
          .select('*')
          .eq('status', 'ativo')
          .order('created_at', { ascending: false });
        
        data = result.data;
        fetchError = result.error;
      }

      if (fetchError) {
        console.error('❌ Erro ao carregar usuários:', fetchError);
        
        // Tratamento específico para erros de RLS
        if (fetchError.message?.includes('infinite recursion') || 
            fetchError.message?.includes('policy')) {
          throw new Error('Erro de configuração de segurança. Entre em contato com o administrador.');
        } else if (fetchError.message?.includes('permission denied')) {
          throw new Error('Sem permissão para visualizar usuários. Verifique suas credenciais.');
        } else {
          throw new Error(`Erro ao carregar usuários: ${fetchError.message}`);
        }
      }

      if (data) {
        const formattedUsers = data.map(formatUser);
        console.log('✅ Usuários carregados:', formattedUsers.length);
        setUsers(formattedUsers);
      } else {
        console.log('ℹ️ Nenhum usuário encontrado');
        setUsers([]);
      }
    } catch (err: any) {
      console.error('💥 Erro ao carregar usuários:', err);
      setError(err.message || 'Erro desconhecido ao carregar usuários');
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  // Deletar usuário usando service role
  const deleteUser = async (id: string) => {
    try {
      setLoading(true);
      
      // Verificar se é admin
      const isAdmin = await checkIsAdmin();
      if (!isAdmin) {
        throw new Error('Apenas administradores podem deletar usuários');
      }

      // Usar service role para deletar
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw new Error(`Erro ao deletar usuário: ${deleteError.message}`);
      }

      // Atualizar lista local
      setUsers(prev => prev.filter(user => user.id !== id));
      toast.success('Usuário deletado com sucesso');
    } catch (err: any) {
      console.error('❌ Erro ao deletar usuário:', err);
      toast.error(err.message || 'Erro ao deletar usuário');
    } finally {
      setLoading(false);
    }
  };

  // Alternar status do usuário
  const toggleUserStatus = async (id: string) => {
    try {
      const user = users.find(u => u.id === id);
      if (!user) return;

      const newStatus = user.status === 'ativo' ? 'inativo' : 'ativo';

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (updateError) {
        throw new Error(`Erro ao atualizar status: ${updateError.message}`);
      }

      // Atualizar lista local
      setUsers(prev => prev.map(u => 
        u.id === id ? { ...u, status: newStatus } : u
      ));

      toast.success(`Usuário ${newStatus === 'ativo' ? 'ativado' : 'desativado'} com sucesso`);
    } catch (err: any) {
      console.error('❌ Erro ao alterar status:', err);
      toast.error(err.message || 'Erro ao alterar status do usuário');
    }
  };

  // Criar usuário
  const createUser = async (userData: Partial<User>) => {
    try {
      setLoading(true);

      const { data, error: insertError } = await supabase
        .from('profiles')
        .insert([{
          email: userData.email,
          name: userData.name,
          company: userData.company,
          phone: userData.phone,
          role: userData.role || 'user',
          status: userData.status || 'ativo',
          commands_used: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (insertError) {
        throw new Error(`Erro ao criar usuário: ${insertError.message}`);
      }

      if (data) {
        const newUser = formatUser(data);
        setUsers(prev => [newUser, ...prev]);
        toast.success('Usuário criado com sucesso');
      }
    } catch (err: any) {
      console.error('❌ Erro ao criar usuário:', err);
      toast.error(err.message || 'Erro ao criar usuário');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar usuário
  const updateUser = async (id: string, userData: Partial<User>) => {
    try {
      setLoading(true);

      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({
          name: userData.name,
          company: userData.company,
          phone: userData.phone,
          role: userData.role,
          status: userData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw new Error(`Erro ao atualizar usuário: ${updateError.message}`);
      }

      if (data) {
        const updatedUser = formatUser(data);
        setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
        toast.success('Usuário atualizado com sucesso');
      }
    } catch (err: any) {
      console.error('❌ Erro ao atualizar usuário:', err);
      toast.error(err.message || 'Erro ao atualizar usuário');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Carregar usuários na inicialização
  useEffect(() => {
    refreshUsers();
  }, []);

  return (
    <UsersContext.Provider value={{
      users,
      loading,
      error,
      setUsers,
      setLoading,
      refreshUsers,
      deleteUser,
      toggleUserStatus,
      createUser,
      updateUser
    }}>
      {children}
    </UsersContext.Provider>
  );
};