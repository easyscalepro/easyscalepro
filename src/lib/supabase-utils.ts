import { supabase } from '@/integrations/supabase/client';

// Função para verificar se há sessão válida
export const checkSession = async () => {
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

// Função wrapper para queries que requerem autenticação
export const withAuth = async <T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<T> => {
  try {
    const session = await checkSession();
    
    if (!session) {
      throw new Error('Sessão de autenticação ausente. Faça login novamente.');
    }
    
    return await operation();
  } catch (error: any) {
    if (error.message?.includes('Auth session missing') || 
        error.message?.includes('AuthSessionMissingError')) {
      throw new Error('Sessão de autenticação expirou. Faça login novamente.');
    }
    
    if (fallback !== undefined) {
      console.warn('Operação falhou, usando fallback:', error.message);
      return fallback;
    }
    
    throw error;
  }
};

// Função para queries que podem funcionar sem autenticação
export const withOptionalAuth = async <T>(
  operation: () => Promise<T>,
  fallback: T
): Promise<T> => {
  try {
    return await operation();
  } catch (error: any) {
    if (error.message?.includes('Auth session missing') || 
        error.message?.includes('AuthSessionMissingError') ||
        error.message?.includes('permission')) {
      console.warn('Operação sem autenticação, usando fallback:', error.message);
      return fallback;
    }
    
    throw error;
  }
};

// Função para verificar se o usuário atual é admin
export const isCurrentUserAdmin = async (): Promise<boolean> => {
  try {
    const session = await checkSession();
    if (!session) return false;
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
    
    return profile?.role === 'admin';
  } catch (error) {
    console.warn('Não foi possível verificar role do usuário:', error);
    return false;
  }
};

// Função para obter o perfil do usuário atual
export const getCurrentUserProfile = async () => {
  try {
    const session = await checkSession();
    if (!session) return null;
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (error) {
      console.warn('Erro ao buscar perfil:', error);
      return null;
    }
    
    return profile;
  } catch (error) {
    console.warn('Erro ao obter perfil do usuário:', error);
    return null;
  }
};