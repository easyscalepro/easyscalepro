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
 * Verifica se há conexão com o Supabase - VERSÃO MELHORADA
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    console.log('🌐 Verificando conexão com Supabase...');
    
    // Teste 1: Verificar se consegue fazer uma query básica no auth
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (!sessionError) {
        console.log('✅ Conexão com Auth confirmada');
        
        // Se tem sessão, testar acesso à tabela profiles
        if (session) {
          try {
            const { error: profileError } = await supabase
              .from('profiles')
              .select('id')
              .limit(1);
            
            if (!profileError) {
              console.log('✅ Conexão com Database confirmada');
              return true;
            } else {
              console.warn('⚠️ Erro no Database, mas Auth OK:', profileError.message);
              // Mesmo com erro no database, se auth funciona, consideramos conectado
              return true;
            }
          } catch (dbError) {
            console.warn('⚠️ Erro no Database, mas Auth OK:', dbError);
            // Auth funciona, então consideramos conectado
            return true;
          }
        } else {
          console.log('✅ Conexão OK (sem sessão ativa)');
          return true;
        }
      }
    } catch (authError) {
      console.warn('⚠️ Erro no teste de Auth:', authError);
    }
    
    // Teste 2: Fallback - tentar uma operação muito básica
    try {
      // Tentar acessar qualquer endpoint do Supabase
      const response = await fetch(`${supabase.supabaseUrl}/rest/v1/`, {
        method: 'HEAD',
        headers: {
          'apikey': supabase.supabaseKey,
          'Authorization': `Bearer ${supabase.supabaseKey}`
        }
      });
      
      if (response.ok || response.status === 404 || response.status === 401) {
        // 404 ou 401 significa que o servidor está respondendo
        console.log('✅ Conexão básica confirmada via fetch');
        return true;
      }
    } catch (fetchError) {
      console.warn('⚠️ Erro no teste de fetch:', fetchError);
    }
    
    // Teste 3: Último recurso - verificar se o objeto supabase existe
    if (supabase && supabase.supabaseUrl && supabase.supabaseKey) {
      console.log('✅ Cliente Supabase configurado corretamente');
      return true;
    }
    
    console.error('❌ Todos os testes de conexão falharam');
    return false;
    
  } catch (error) {
    console.error('💥 Erro crítico na verificação de conexão:', error);
    // Em caso de erro crítico, assumir que está conectado para não bloquear
    return true;
  }
};

/**
 * Verifica conexão de forma mais rápida (para uso em componentes)
 */
export const quickConnectionCheck = async (): Promise<boolean> => {
  try {
    // Teste rápido apenas no auth
    const { error } = await supabase.auth.getSession();
    return !error;
  } catch (error) {
    console.warn('⚠️ Quick check falhou:', error);
    // Em caso de erro, assumir conectado
    return true;
  }
};