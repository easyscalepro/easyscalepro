import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wlynpcuqlqynsutkpvmq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndseW5wY3VxbHF5bnN1dGtwdm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NTE0MDYsImV4cCI6MjA2NzIyNzQwNn0.WgEKX9LB5gSPjWVwIdCVR-TZ3LR_uh2SodaKiX_Qdx4'

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

// Interceptar erros de sessão ausente
const originalFrom = supabase.from.bind(supabase);
supabase.from = function(table: string) {
  const query = originalFrom(table);
  
  // Interceptar métodos que fazem queries
  const originalSelect = query.select.bind(query);
  const originalInsert = query.insert.bind(query);
  const originalUpdate = query.update.bind(query);
  const originalDelete = query.delete.bind(query);
  
  query.select = function(...args: any[]) {
    return originalSelect(...args).then(
      (result: any) => result,
      (error: any) => {
        if (error.message?.includes('Auth session missing')) {
          console.warn('Sessão ausente detectada em SELECT:', table);
          // Não lançar erro, retornar resultado vazio
          return { data: null, error: { ...error, handled: true } };
        }
        throw error;
      }
    );
  };
  
  query.insert = function(...args: any[]) {
    return originalInsert(...args).then(
      (result: any) => result,
      (error: any) => {
        if (error.message?.includes('Auth session missing')) {
          console.warn('Sessão ausente detectada em INSERT:', table);
          throw new Error('Sessão de autenticação ausente. Faça login novamente.');
        }
        throw error;
      }
    );
  };
  
  query.update = function(...args: any[]) {
    return originalUpdate(...args).then(
      (result: any) => result,
      (error: any) => {
        if (error.message?.includes('Auth session missing')) {
          console.warn('Sessão ausente detectada em UPDATE:', table);
          throw new Error('Sessão de autenticação ausente. Faça login novamente.');
        }
        throw error;
      }
    );
  };
  
  query.delete = function(...args: any[]) {
    return originalDelete(...args).then(
      (result: any) => result,
      (error: any) => {
        if (error.message?.includes('Auth session missing')) {
          console.warn('Sessão ausente detectada em DELETE:', table);
          throw new Error('Sessão de autenticação ausente. Faça login novamente.');
        }
        throw error;
      }
    );
  };
  
  return query;
};

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