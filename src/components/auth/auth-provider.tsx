"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { signIn as authSignIn, signOut as authSignOut } from '@/lib/auth';
import { checkSession, withOptionalAuth } from '@/lib/supabase-utils';
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
      
      // Tentar buscar da tabela profiles usando withOptionalAuth
      const dbProfile = await withOptionalAuth(
        async () => {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) throw error;
          return data;
        },
        null // fallback para null
      );

      if (dbProfile) {
        console.log('✅ Perfil encontrado no banco:', dbProfile);
        setProfile(dbProfile);
      } else {
        console.log('📝 Criando perfil simples');
        // Se não encontrar no banco, criar perfil simples
        const simpleProfile = createSimpleProfile(user);
        setProfile(simpleProfile);
        
        // Tentar criar no banco se possível
        try {
          const session = await checkSession();
          if (session) {
            await supabase
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
            
            console.log('✅ Perfil criado no banco com sucesso');
          }
        } catch (createError) {
          console.log('⚠️ Não foi possível criar perfil no banco:', createError);
        }
      }
    } catch (error) {
      console.error('❌ Erro ao carregar perfil:', error);
      // Em caso de erro, sempre criar perfil simples
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
    let mounted = true;

    // Verificar sessão atual
    const getInitialSession = async () => {
      try {
        console.log('🔍 Verificando sessão inicial...');
        
        const session = await checkSession();
        
        if (session?.user && mounted) {
          console.log('✅ Sessão encontrada para:', session.user.email);
          setUser(session.user);
          await loadUserProfile(session.user);
        } else {
          console.log('⚠️ Nenhuma sessão ativa encontrada');
          if (mounted) {
            setUser(null);
            setProfile(null);
          }
        }
      } catch (error) {
        console.error('💥 Erro inesperado ao verificar sessão:', error);
        if (mounted) {
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('🔄 Auth state changed:', event, session?.user?.email);
      
      try {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          await loadUserProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 Usuário deslogado, limpando estado...');
          setUser(null);
          setProfile(null);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          setUser(session.user);
          // Não recarregar perfil no refresh do token para evitar chamadas desnecessárias
        }
      } catch (error) {
        console.error('💥 Erro ao processar mudança de auth:', error);
        // Em caso de erro, limpar estado
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔐 Tentando fazer login com:', email);
      
      // Verificar se o usuário existe primeiro (apenas se conseguirmos acessar)
      try {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('email, status')
          .eq('email', email)
          .single();

        if (existingProfile && existingProfile.status !== 'ativo') {
          throw new Error('Sua conta está inativa. Entre em contato com o administrador.');
        }
      } catch (profileError) {
        // Se não conseguir verificar o perfil, continuar com o login
        console.log('⚠️ Não foi possível verificar perfil (continuando com login):', profileError);
      }

      // Tentar fazer login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('❌ Erro no login:', error);
        throw error;
      }

      if (!data.user) {
        throw new Error('Falha na autenticação');
      }

      console.log('✅ Login realizado com sucesso para:', data.user.email);
      
    } catch (error: any) {
      console.error('💥 Erro no login:', error);
      
      if (error.message?.includes('Invalid login credentials')) {
        throw new Error('Email ou senha incorretos. Verifique suas credenciais e tente novamente.');
      } else if (error.message?.includes('Email not confirmed')) {
        throw new Error('Email não confirmado. Verifique sua caixa de entrada e confirme seu email.');
      } else if (error.message?.includes('Too many requests')) {
        throw new Error('Muitas tentativas de login. Aguarde alguns minutos e tente novamente.');
      } else if (error.message?.includes('inativa')) {
        throw new Error(error.message);
      } else {
        throw new Error('Erro ao fazer login. Verifique sua conexão e tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('👋 Iniciando processo de logout no AuthProvider...');
      
      // Limpar estado imediatamente para melhor UX
      setUser(null);
      setProfile(null);
      
      // Tentar fazer logout no Supabase
      await authSignOut();
      
      console.log('✅ Logout concluído com sucesso');
      
    } catch (error: any) {
      console.error('💥 Erro no logout do AuthProvider:', error);
      
      // Mesmo com erro, garantir que o estado seja limpo
      setUser(null);
      setProfile(null);
      
      // Não lançar erro para não bloquear o logout
      console.log('🧹 Estado limpo mesmo com erro no logout');
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