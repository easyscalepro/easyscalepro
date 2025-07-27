'use client'

import { createContext, useContext } from 'react'
import { SessionContextProvider, useSessionContext } from '@supabase/auth-helpers-react'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      {children}
    </SessionContextProvider>
  )
}

export const useAuth = () => {
  const { session, isLoading } = useSessionContext()
  return {
    user: session?.user ?? null,
    loading: isLoading,
  }
}