'use client'

import { AuthProvider } from '@/components/auth/auth-provider'
import { CommandsProvider } from '@/contexts/commands-context'
import { UsersProvider } from '@/contexts/users-context'
import { ReactNode } from 'react'

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <UsersProvider>
        <CommandsProvider>
          {children}
        </CommandsProvider>
      </UsersProvider>
    </AuthProvider>
  )
}