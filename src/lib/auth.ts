import { supabase } from '@/lib/supabase';

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw error;
  }

  return data;
};

export const signOut = async () => {
  console.log('🔄 Executando signOut no auth.ts...');
  
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.warn('⚠️ Erro no logout do Supabase:', error);
      // Não lançar erro para não bloquear o logout
    } else {
      console.log('✅ Logout do Supabase executado com sucesso');
    }
    
    return true;
  } catch (error) {
    console.warn('⚠️ Erro inesperado no logout:', error);
    // Mesmo com erro, retornar true para não bloquear o logout
    return true;
  }
};

export const signUp = async (email: string, password: string, metadata?: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  });

  if (error) {
    throw error;
  }

  return data;
};

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    throw error;
  }

  return data;
};