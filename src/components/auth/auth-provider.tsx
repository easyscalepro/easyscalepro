"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { signIn as authSignIn, signOut as authSignOut } from '@/lib/auth';
import type { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Interface simplificada para perfil
interface SimpleProfile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  status: 'ativo';
}

interface AuthContextType {
  user: User | null;
  profile: SimpleProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<SimpleProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const createSimpleProfile = (user: User): SimpleProfile => {
    // Emails que devem ser admin
    const adminEmails = ['admin@easyscale.com', 'julionavyy@gmail.com'];
    const isAdmin = adminEmails.includes(user.email || '');
    
    return {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
      role: isAdmin ? 'admin' : 'user',
      status: 'ativo'
    };
  };

  const loadUserProfile = async (user: User) => {
    try {
      console.log('Carregando perfil para usuário:', user.email);
      
      // Tentar buscar da tabela profiles primeiro
      const { data: dbProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (dbProfile && !error) {
        console.log('Perfil encontrado no banco:', dbProfile);
        setProfile(dbProfile);
      } else {
        console.log('Perfil não encontrado no banco, criando perfil simples');
        // Se não encontrar no banco, criar perfil simples baseado nos dados do usuário
        const simpleProfile = createSimpleProfile(user);
        setProfile(simpleProfile);
        
        // Tentar criar no banco (se a tabela existir)
        try {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email || '',
              name: simpleProfile.name,
              role: simpleProfile.role,
              status: simpleProfile.status,
              commands_used: 0,
              last_access: new Date().toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          
          if (!insertError) {
            console.log('Perfil criado no banco com sucesso');
          }
        } catch (createError) {
          console.log('Não foi possível criar perfil no banco:', createError);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      // Em caso de erro, criar perfil simples
      const simpleProfile = createSimpleProfile(user);
      setProfile(simpleProfile);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await loadUserProfile(user);
    }
  };

  useEffect(() => {
    // Verificar sessão atual
    const getInitialSession = async () => {
      try {
        console.log('Verificando sessão inicial...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao verificar sessão:', error);
          setLoading(false);
          return;
        }
        
        if (session?.user) {
          console.log('Sessão encontrada para:', session.user.email);
          setUser(session.user);
          await loadUserProfile(session.user);
        } else {
          console.log('Nenhuma sessão ativa encontrada');
        }
      } catch (error) {
        console.error('Erro inesperado ao verificar sessão:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      try {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          await loadUserProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          console.log('Usuário deslogado, limpando estado...');
          setUser(null);
          setProfile(null);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          setUser(session.user);
          // Não recarregar perfil no refresh do token
        }
      } catch (error) {
        console.error('Erro ao processar mudança de auth:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Tentando fazer login com:', email);
      
      await authSignIn(email, password);
      // O onAuthStateChange vai lidar com o resto
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      if (error.message?.includes('Invalid login credentials')) {
        throw new Error('Email ou senha incorretos');
      } else if (error.message?.includes('Email not confirmed')) {
        throw new Error('Email não confirmado. Verifique sua caixa de entrada');
      } else if (error.message?.includes('Too many requests')) {
        throw new Error('Muitas tentativas. Aguarde alguns minutos e tente novamente');
      } else {
        throw new Error('Erro ao fazer login. Verifique sua conexão e tente novamente');
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('Iniciando processo de logout no AuthProvider...');
      
      // Limpar estado imediatamente para melhor UX
      setUser(null);
      setProfile(null);
      
      // Tentar fazer logout no Supabase
      await authSignOut();
      
      console.log('Logout concluído com sucesso');
      
    } catch (error: any) {
      console.error('Erro no logout do AuthProvider:', error);
      
      // Mesmo com erro, garantir que o estado seja limpo
      setUser(null);
      setProfile(null);
      
      // Não lançar erro para não bloquear o logout
      console.log('Estado limpo mesmo com erro no logout');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      signIn, 
      signOut, 
      refreshProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};