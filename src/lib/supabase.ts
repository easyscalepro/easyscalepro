import { createClient } from '@supabase/supabase-js'

// Valores padrão para build
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wlynpcuqlqynsutkpvmq.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndseW5wY3VxbHF5bnN1dGtwdm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NTE0MDYsImV4cCI6MjA2NzIyNzQwNn0.WgEKX9LB5gSPjWVwIdCVR-TZ3LR_uh2SodaKiX_Qdx4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})