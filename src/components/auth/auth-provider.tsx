"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUser, getUserProfile, signIn as authSignIn, signOut as authSignOut, updateLastAccess } from '@/lib/auth';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '@/lib/auth';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = async (userId: string, retryCount = 0) => {
    try {
      console.log(`Carregando perfil do usuário (tentativa ${retryCount + 1}):`, userId);
      
      const userProfile = await getUserProfile(userId);
      
      if (userProfile) {
        setProfile(userProfile);
        console.log('Perfil carregado com sucesso:', userProfile);
        
        // Atualizar último acesso
        try {
          await updateLastAccess(userId);
        } catch (accessError) {
          console.warn('Erro ao atualizar último acesso (não crítico):', accessError);
        }
      } else {
        console.warn('Perfil não encontrado ou não pôde ser criado');
        
        // Retry logic - tentar novamente até 2 vezes
        if (retryCount < 2) {
          console.log('Tentando novamente em 2 segundos...');
          setTimeout(() => {
            loadUserProfile(userId, retryCount + 1);
          }, 2000);
          return;
        }
        
        // Se ainda não conseguiu após 3 tentativas, mostrar erro
        toast.error('Erro ao carregar perfil do usuário. Tente fazer login novamente.');
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      
      // Retry logic para erros de rede
      if (retryCount < 2) {
        console.log('Erro de rede, tentando novamente em 3 segundos...');
        setTimeout(() => {
          loadUserProfile(userId, retryCount + 1);
        }, 3000);
        return;
      }
      
      toast.error('Erro de conexão. Verifique sua internet e tente novamente.');
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await loadUserProfile(user.id);
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
          await loadUserProfile(session.user.id);
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
          await loadUserProfile(session.user.id);
          toast.success('Login realizado com sucesso!');
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          toast.success('Logout realizado com sucesso!');
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          setUser(session.user);
          // Não recarregar perfil no refresh do token para evitar requests desnecessários
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
      setLoading(true);
      console.log('Fazendo logout...');
      
      await authSignOut();
      // O onAuthStateChange vai lidar com o resto
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    } finally {
      setLoading(false);
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