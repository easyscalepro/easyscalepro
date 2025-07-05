import { supabase } from '@/integrations/supabase/client'
import type { User } from '@supabase/supabase-js'

export interface UserProfile {
  id: string
  email: string
  name: string | null
  company: string | null
  phone: string | null
  role: 'admin' | 'user' | 'moderator'
  status: 'ativo' | 'inativo' | 'suspenso'
  avatar_url: string | null
  commands_used: number
  last_access: string
  created_at: string
  updated_at: string
}

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      console.error('Erro ao buscar usuário atual:', error)
      return null
    }
    return user
  } catch (error) {
    console.error('Erro inesperado ao buscar usuário:', error)
    return null
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Erro no signIn:', error)
    throw error
  }
}

export const signUp = async (email: string, password: string, name?: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0]
        }
      }
    })

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Erro no signUp:', error)
    throw error
  }
}

export const signOut = async () => {
  try {
    console.log('Executando signOut...')
    
    // Tentar fazer logout no Supabase
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Erro no Supabase signOut:', error)
      // Não lançar erro aqui, continuar com limpeza local
    }
    
    // Limpar localStorage como fallback
    try {
      localStorage.removeItem('supabase.auth.token')
      localStorage.removeItem('sb-wlynpcuqlqynsutkpvmq-auth-token')
      console.log('LocalStorage limpo')
    } catch (storageError) {
      console.warn('Erro ao limpar localStorage:', storageError)
    }
    
    // Limpar sessionStorage como fallback
    try {
      sessionStorage.clear()
      console.log('SessionStorage limpo')
    } catch (sessionError) {
      console.warn('Erro ao limpar sessionStorage:', sessionError)
    }
    
    console.log('SignOut concluído com sucesso')
    
  } catch (error) {
    console.error('Erro no signOut:', error)
    
    // Mesmo com erro, tentar limpar dados locais
    try {
      localStorage.clear()
      sessionStorage.clear()
    } catch (clearError) {
      console.warn('Erro ao limpar storage:', clearError)
    }
    
    // Não lançar erro para não bloquear o logout
    console.log('Logout forçado devido a erro')
  }
}