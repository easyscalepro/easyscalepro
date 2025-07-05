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

export const createUserProfile = async (user: User): Promise<UserProfile | null> => {
  try {
    console.log('Criando perfil para usuário:', user.email)
    
    const profileData = {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
      company: null,
      phone: null,
      role: (user.email === 'admin@easyscale.com' || user.email === 'julionavyy@gmail.com') ? 'admin' as const : 'user' as const,
      status: 'ativo' as const,
      avatar_url: user.user_metadata?.avatar_url || null,
      commands_used: 0,
      last_access: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar perfil:', error)
      return null
    }

    console.log('Perfil criado com sucesso:', data)
    return data
  } catch (error) {
    console.error('Erro inesperado ao criar perfil:', error)
    return null
  }
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    console.log('Buscando perfil para usuário:', userId)
    
    // Primeiro, tentar buscar o perfil existente
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (fetchError) {
      console.log('Perfil não encontrado, erro:', fetchError.message)
      
      // Se o perfil não existe (erro PGRST116), tentar criar um novo
      if (fetchError.code === 'PGRST116') {
        console.log('Perfil não existe, tentando criar...')
        
        // Buscar dados do usuário atual para criar o perfil
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          console.error('Erro ao buscar dados do usuário para criar perfil:', userError)
          return null
        }

        // Criar novo perfil
        const newProfile = await createUserProfile(user)
        return newProfile
      }
      
      console.error('Erro ao buscar perfil:', fetchError)
      return null
    }

    console.log('Perfil encontrado:', profile)
    return profile
  } catch (error) {
    console.error('Erro inesperado ao buscar perfil:', error)
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

export const updateLastAccess = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        last_access: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      console.error('Erro ao atualizar último acesso:', error)
    } else {
      console.log('Último acesso atualizado com sucesso')
    }
  } catch (error) {
    console.error('Erro inesperado ao atualizar último acesso:', error)
  }
}

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar perfil:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Erro inesperado ao atualizar perfil:', error)
    throw error
  }
}