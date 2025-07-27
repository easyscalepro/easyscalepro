import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'easyscale-app'
    }
  }
})

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
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
        Insert: {
          id: string
          email: string
          name?: string | null
          company?: string | null
          phone?: string | null
          role?: 'admin' | 'user' | 'moderator'
          status?: 'ativo' | 'inativo' | 'suspenso'
          avatar_url?: string | null
          commands_used?: number
          last_access?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          company?: string | null
          phone?: string | null
          role?: 'admin' | 'user' | 'moderator'
          status?: 'ativo' | 'inativo' | 'suspenso'
          avatar_url?: string | null
          commands_used?: number
          last_access?: string
          created_at?: string
          updated_at?: string
        }
      }
      commands: {
        Row: {
          id: string
          title: string
          description: string
          category_id: string | null
          category_name: string
          level: 'iniciante' | 'intermediário' | 'avançado'
          prompt: string
          usage_instructions: string | null
          tags: string[]
          estimated_time: string
          views: number
          copies: number
          popularity: number
          is_active: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category_id?: string | null
          category_name: string
          level: 'iniciante' | 'intermediário' | 'avançado'
          prompt: string
          usage_instructions?: string | null
          tags?: string[]
          estimated_time?: string
          views?: number
          copies?: number
          popularity?: number
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category_id?: string | null
          category_name?: string
          level?: 'iniciante' | 'intermediário' | 'avançado'
          prompt?: string
          usage_instructions?: string | null
          tags?: string[]
          estimated_time?: string
          views?: number
          copies?: number
          popularity?: number
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          command_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          command_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          command_id?: string
          created_at?: string
        }
      }
    }
  }
}