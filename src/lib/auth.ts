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
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Erro no signOut:', error)
    throw error
  }
}