import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wlynpcuqlqynsutkpvmq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndseW5wY3VxbHF5bnN1dGtwdm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NTE0MDYsImV4cCI6MjA2NzIyNzQwNn0.WgEKX9LB5gSPjWVwIdCVR-TZ3LR_uh2SodaKiX_Qdx4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
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