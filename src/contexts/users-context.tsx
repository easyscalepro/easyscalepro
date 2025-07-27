'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

type User = {
  id: string
  email: string
  name: string
  company?: string
  phone?: string
  role: 'admin' | 'user' | 'moderator'
  status: 'ativo' | 'inativo' | 'suspenso'
  commands_used: number
  last_access: string
  created_at: string
}

type NewUser = {
  email: string
  name: string
  company?: string
  phone?: string
  role?: 'admin' | 'user' | 'moderator'
  status?: 'ativo' | 'inativo' | 'suspenso'
}

const UsersContext = createContext<{
  users: User[]
  loading: boolean
  addUser: (user: NewUser) => Promise<void>
  loadUsers: () => Promise<void>
  deleteUser: (id: string) => Promise<void>
  updateUser: (id: string, userData: Partial<User>) => Promise<void>
}>({ 
  users: [], 
  loading: false,
  addUser: async () => {},
  loadUsers: async () => {},
  deleteUser: async () => {},
  updateUser: async () => {}
})

export const UsersProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)

  const loadUsers = async () => {
    try {
      setLoading(true)
      console.log('🔄 Carregando usuários...')
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Erro ao carregar usuários:', error)
        toast.error('Erro ao carregar usuários')
        return
      }

      if (data) {
        console.log('✅ Usuários carregados:', data.length)
        setUsers(data)
      }
    } catch (err: any) {
      console.error('💥 Erro ao carregar usuários:', err)
      toast.error('Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }

  const addUser = async (newUser: NewUser) => {
    try {
      setLoading(true)
      console.log('➕ Adicionando usuário:', newUser.email)

      const userData = {
        email: newUser.email,
        name: newUser.name,
        company: newUser.company || null,
        phone: newUser.phone || null,
        role: newUser.role || 'user',
        status: newUser.status || 'ativo',
        commands_used: 0,
        last_access: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert([userData])
        .select()
        .single()

      if (error) {
        console.error('❌ Erro ao adicionar usuário:', error)
        toast.error('Erro ao adicionar usuário')
        return
      }

      if (data) {
        console.log('✅ Usuário adicionado:', data.email)
        setUsers(prev => [data, ...prev])
        toast.success('Usuário adicionado com sucesso!')
      }
    } catch (err: any) {
      console.error('💥 Erro ao adicionar usuário:', err)
      toast.error('Erro ao adicionar usuário')
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (id: string) => {
    try {
      setLoading(true)
      console.log('🗑️ Deletando usuário:', id)

      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('❌ Erro ao deletar usuário:', error)
        toast.error('Erro ao deletar usuário')
        return
      }

      console.log('✅ Usuário deletado')
      setUsers(prev => prev.filter(user => user.id !== id))
      toast.success('Usuário deletado com sucesso!')
    } catch (err: any) {
      console.error('💥 Erro ao deletar usuário:', err)
      toast.error('Erro ao deletar usuário')
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (id: string, userData: Partial<User>) => {
    try {
      setLoading(true)
      console.log('✏️ Atualizando usuário:', id)

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...userData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('❌ Erro ao atualizar usuário:', error)
        toast.error('Erro ao atualizar usuário')
        return
      }

      if (data) {
        console.log('✅ Usuário atualizado')
        setUsers(prev => prev.map(user => user.id === id ? data : user))
        toast.success('Usuário atualizado com sucesso!')
      }
    } catch (err: any) {
      console.error('💥 Erro ao atualizar usuário:', err)
      toast.error('Erro ao atualizar usuário')
    } finally {
      setLoading(false)
    }
  }

  // Carregar usuários na inicialização
  useEffect(() => {
    loadUsers()
  }, [])

  return (
    <UsersContext.Provider value={{ 
      users, 
      loading,
      addUser,
      loadUsers,
      deleteUser,
      updateUser
    }}>
      {children}
    </UsersContext.Provider>
  )
}

export const useUsers = () => {
  const context = useContext(UsersContext)
  if (!context) {
    throw new Error('useUsers must be used within a UsersProvider')
  }
  return context
}