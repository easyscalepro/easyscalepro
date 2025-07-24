import { supabase } from '@/integrations/supabase/client';
import type { Session, User } from '@supabase/supabase-js';

/**
 * Verifica se há uma sessão ativa de forma segura
 */
export const checkSession = async (): Promise<Session | null> => {
  try {
    console.log('🔍 Verificando sessão...');
    
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.warn('⚠️ Erro ao verificar sessão:', error.message);
      return null;
    }
    
    if (session) {
      console.log('✅ Sessão ativa encontrada para:', session.user.email);
      return session;
    } else {
      console.log('ℹ️ Nenhuma sessão ativa encontrada');
      return null;
    }
  } catch (error) {
    console.error('💥 Erro inesperado ao verificar sessão:', error);
    return null;
  }
};

/**
 * Executa uma função com autenticação opcional
 * Se não houver sessão, retorna o fallback
 */
export const withOptionalAuth = async <T>(
  fn: () => Promise<T>,
  fallback: T
): Promise<T> => {
  try {
    const session = await checkSession();
    
    if (!session) {
      console.log('📝 Sem sessão - usando fallback');
      return fallback;
    }
    
    return await fn();
  } catch (error) {
    console.warn('⚠️ Erro na execução com auth opcional:', error);
    return fallback;
  }
};

/**
 * Executa uma função que requer autenticação
 * Lança erro se não houver sessão
 */
export const withRequiredAuth = async <T>(
  fn: () => Promise<T>
): Promise<T> => {
  const session = await checkSession();
  
  if (!session) {
    throw new Error('Autenticação necessária para esta operação');
  }
  
  return await fn();
};

/**
 * Verifica se o usuário atual é admin
 */
export const isCurrentUserAdmin = async (): Promise<boolean> => {
  try {
    const session = await checkSession();
    
    if (!session) {
      return false;
    }
    
    // Verificar na tabela profiles
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

/**
 * Obtém o usuário atual de forma segura
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const session = await checkSession();
    return session?.user || null;
  } catch (error) {
    console.error('💥 Erro ao obter usuário atual:', error);
    return null;
  }
};

/**
 * Verifica se há conexão com o Supabase
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    return !error;
  } catch (error) {
    console.error('💥 Erro de conexão com Supabase:', error);
    return false;
  }
};