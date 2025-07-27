"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
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

// Função helper para converter erros do Supabase em Error objects
const createErrorFromSupabaseError = (error: any, defaultMessage: string = 'Erro desconhecido'): Error => {
  if (error instanceof Error) {
    return error;
  }
  
  if (typeof error === 'string') {
    return new Error(error);
  }
  
  if (error && typeof error === 'object') {
    const message = error.message || error.error_description || error.msg || defaultMessage;
    const newError = new Error(message);
    
    // Preservar propriedades importantes do erro original
    if (error.code) (newError as any).code = error.code;
    if (error.details) (newError as any).details = error.details;
    if (error.hint) (newError as any).hint = error.hint;
    
    return newError;
  }
  
  return new Error(defaultMessage);
};

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
      console.log('📋 Carregando perfil para usuário:', user.email);
      
      // Tentar buscar da tabela profiles
      const { data: dbProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!error && dbProfile) {
        console.log('✅ Perfil encontrado no banco:', dbProfile.email);
        setProfile(dbProfile);
      } else {
        console.log('📝 Criando perfil simples para:', user.email);
        // Se não encontrar no banco, criar perfil simples
        const simpleProfile = createSimpleProfile(user);
        setProfile(simpleProfile);
        
        // Tentar criar no banco em background (não bloquear)
        setTimeout(async () => {
          try {
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
            
            console.log('✅ Perfil salvo no banco em background');
          } catch (createError) {
            console.log('⚠️ Não foi possível salvar perfil no banco:', createError);
          }
        }, 1000);
      }
    } catch (error) {
      console.warn('⚠️ Erro ao carregar perfil (usando fallback):', error);
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
    let timeoutId: NodeJS.Timeout;

    // Timeout de segurança para evitar loading infinito
    const safetyTimeout = setTimeout(() => {
      if (mounted) {
        console.log('⏰ Timeout de segurança - finalizando loading de autenticação');
        setLoading(false);
      }
    }, 10000); // 10 segundos máximo

    // Verificar sessão atual
    const getInitialSession = async () => {
      try {
        console.log('🔍 Verificando sessão inicial...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('⚠️ Erro ao verificar sessão:', error.message);
          if (mounted) {
            setUser(null);
            setProfile(null);
            setLoading(false);
          }
          return;
        }
        
        if (session?.user && mounted) {
          console.log('✅ Sessão encontrada para:', session.user.email);
          setUser(session.user);
          await loadUserProfile(session.user);
        } else {
          console.log('ℹ️ Nenhuma sessão ativa encontrada');
          if (mounted) {
            setUser(null);
            setProfile(null);
          }
        }
      } catch (error) {
        console.warn('⚠️ Erro ao verificar sessão inicial:', error);
        if (mounted) {
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
          clearTimeout(safetyTimeout);
        }
      }
    };

    getInitialSession();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('🔄 Auth state changed:', event, session?.user?.email || 'sem usuário');
      
      // Limpar timeout anterior
      if (timeoutId) clearTimeout(timeoutId);
      
      try {
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('🔐 Usuário logado:', session.user.email);
          setLoading(true); // Mostrar loading durante carregamento do perfil
          setUser(session.user);
          await loadUserProfile(session.user);
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 Usuário deslogado, limpando estado...');
          setUser(null);
          setProfile(null);
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log('🔄 Token renovado para:', session.user.email);
          setUser(session.user);
          // Não recarregar perfil no refresh do token
        }
      } catch (error) {
        console.warn('⚠️ Erro ao processar mudança de auth:', error);
        // Em caso de erro, limpar estado e parar loading
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
      if (timeoutId) clearTimeout(timeoutId);
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
        console.log('⚠️ Não foi possível verificar perfil (continuando com login)');
      }

      // Tentar fazer login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('❌ Erro no login:', error.message);
        throw createErrorFromSupabaseError(error, 'Erro ao fazer login');
      }

      if (!data.user) {
        throw new Error('Falha na autenticação - usuário não retornado');
      }

      console.log('✅ Login realizado com sucesso para:', data.user.email);
      
      // O onAuthStateChange vai lidar com o resto
      
    } catch (error: any) {
      console.error('💥 Erro no login:', error);
      setLoading(false); // Parar loading em caso de erro
      
      if (error.message?.includes('Invalid login credentials')) {
        throw new Error('Email ou senha incorretos. Verifique suas credenciais e tente novamente.');
      } else if (error.message?.includes('Email not confirmed')) {
        throw new Error('Email não confirmado. Verifique sua caixa de entrada e confirme seu email.');
      } else if (error.message?.includes('Too many requests')) {
        throw new Error('Muitas tentativas de login. Aguarde alguns minutos e tente novamente.');
      } else if (error.message?.includes('inativa')) {
        throw new Error(error.message);
      } else {
        throw createErrorFromSupabaseError(error, 'Erro ao fazer login. Verifique sua conexão e tente novamente.');
      }
    }
  };

  const signOut = async () => {
    try {
      console.log('👋 Iniciando processo de logout no AuthProvider...');
      
      // Mostrar loading durante logout
      setLoading(true);
      
      // Limpar estado imediatamente para melhor UX
      setUser(null);
      setProfile(null);
      
      // Tentar fazer logout no Supabase
      await authSignOut();
      
      console.log('✅ Logout concluído com sucesso no AuthProvider');
      
    } catch (error: any) {
      console.warn('⚠️ Erro no logout (estado limpo mesmo assim):', error);
      
      // Mesmo com erro, garantir que o estado seja limpo
      setUser(null);
      setProfile(null);
      
      // Não lançar erro para não bloquear o logout
      console.log('🧹 Estado limpo mesmo com erro no logout');
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