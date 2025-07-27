"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Profile {
  id: string;
  email: string;
  name?: string;
  company?: string;
  phone?: string;
  role: 'user' | 'admin';
  status: 'ativo' | 'inativo';
  avatar_url?: string;
  commands_used: number;
  last_access?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (userId: string) => {
    try {
      console.log('👤 Carregando perfil do usuário:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Erro ao carregar perfil:', error);
        return null;
      }

      if (data) {
        console.log('✅ Perfil carregado:', data.email, '| Role:', data.role);
        return data as Profile;
      }

      return null;
    } catch (err) {
      console.error('💥 Erro inesperado ao carregar perfil:', err);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await loadProfile(user.id);
      setProfile(profileData);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Iniciando login para:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) {
        console.error('❌ Erro no login:', error);
        
        // Tratamento específico de erros
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Email ou senha incorretos');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Email não confirmado. Verifique sua caixa de entrada.');
        } else if (error.message.includes('Too many requests')) {
          throw new Error('Muitas tentativas de login. Aguarde alguns minutos.');
        } else {
          throw new Error(error.message || 'Erro no login');
        }
      }

      if (data.user) {
        console.log('✅ Login realizado com sucesso:', data.user.email);
        
        // Carregar perfil do usuário
        const profileData = await loadProfile(data.user.id);
        
        if (!profileData) {
          throw new Error('Perfil do usuário não encontrado');
        }

        // Verificar se a conta está ativa
        if (profileData.status !== 'ativo') {
          throw new Error('Conta inativa. Entre em contato com o administrador.');
        }

        setUser(data.user);
        setProfile(profileData);
        
        console.log('✅ Usuário autenticado com sucesso');
      }
    } catch (error: any) {
      console.error('💥 Erro no signIn:', error);
      throw error;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔐 Inicializando autenticação...');
        
        // Verificar sessão atual
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Erro ao obter sessão:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          console.log('✅ Sessão encontrada:', session.user.email);
          setUser(session.user);
          
          // Carregar perfil
          const profileData = await loadProfile(session.user.id);
          setProfile(profileData);
        } else {
          console.log('ℹ️ Nenhuma sessão ativa encontrada');
        }
      } catch (err) {
        console.error('💥 Erro na inicialização:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Mudança de autenticação:', event);
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('✅ Usuário logado:', session.user.email);
        setUser(session.user);
        
        // Carregar perfil
        const profileData = await loadProfile(session.user.id);
        setProfile(profileData);
      } else if (event === 'SIGNED_OUT') {
        console.log('👋 Usuário deslogado');
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log('🚪 Fazendo logout...');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Erro no logout:', error);
        throw error;
      }
      
      console.log('✅ Logout realizado com sucesso');
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('💥 Erro no signOut:', error);
      throw error;
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};