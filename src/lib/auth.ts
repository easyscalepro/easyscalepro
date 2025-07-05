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
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Erro ao buscar perfil:', error)
    return null
  }

  return data
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    throw error
  }

  return data
}

export const signUp = async (email: string, password: string, name?: string) => {
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
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw error
  }
}

export const updateLastAccess = async (userId: string) => {
  const { error } = await supabase
    .from('profiles')
    .update({ last_access: new Date().toISOString() })
    .eq('id', userId)

  if (error) {
    console.error('Erro ao atualizar último acesso:', error)
  }
}