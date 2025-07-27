import { supabase } from './supabase';

export const signUp = async (email: string, password: string, name: string) => {
  try {
    console.log('📝 Iniciando cadastro para:', email);
    
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        data: {
          name: name.trim()
        }
      }
    });

    if (error) {
      console.error('❌ Erro no cadastro:', error);
      
      // Tratamento específico de erros
      if (error.message.includes('User already registered')) {
        throw new Error('Este email já está cadastrado');
      } else if (error.message.includes('Password should be at least 6 characters')) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      } else if (error.message.includes('Invalid email')) {
        throw new Error('Email inválido');
      } else {
        throw new Error(error.message || 'Erro no cadastro');
      }
    }

    if (data.user) {
      console.log('✅ Cadastro realizado com sucesso:', data.user.email);
      return data.user;
    }

    throw new Error('Erro inesperado no cadastro');
  } catch (error: any) {
    console.error('💥 Erro no signUp:', error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    console.log('🔄 Enviando email de recuperação para:', email);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      console.error('❌ Erro ao enviar email de recuperação:', error);
      
      if (error.message.includes('User not found')) {
        throw new Error('Email não encontrado');
      } else if (error.message.includes('Email rate limit exceeded')) {
        throw new Error('Muitas tentativas. Aguarde alguns minutos.');
      } else {
        throw new Error(error.message || 'Erro ao enviar email');
      }
    }

    console.log('✅ Email de recuperação enviado');
  } catch (error: any) {
    console.error('💥 Erro no resetPassword:', error);
    throw error;
  }
};