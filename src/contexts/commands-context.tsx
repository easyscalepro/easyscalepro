'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

type Command = {
  id: string
  title: string
  description: string
  category_name: string
  level: 'iniciante' | 'intermediário' | 'avançado'
  prompt: string
  usage_instructions?: string | null
  tags: string[]
  estimated_time: string
  views: number
  copies: number
  popularity: number
  is_active: boolean
  created_by?: string | null
  created_at: string
  updated_at: string
}

type NewCommand = {
  title: string
  description: string
  category_name: string
  level: 'iniciante' | 'intermediário' | 'avançado'
  prompt: string
  usage_instructions?: string
  tags?: string[]
  estimated_time?: string
}

const CommandsContext = createContext<{
  commands: Command[]
  loading: boolean
  addCommand: (command: NewCommand) => Promise<void>
  loadCommands: () => Promise<void>
  setCommands: (commands: Command[]) => void
  setLoading: (loading: boolean) => void
}>({ 
  commands: [], 
  loading: false,
  addCommand: async () => {}, 
  loadCommands: async () => {},
  setCommands: () => {},
  setLoading: () => {}
})

export const CommandsProvider = ({ children }: { children: ReactNode }) => {
  const [commands, setCommands] = useState<Command[]>([])
  const [loading, setLoading] = useState(false)

  const loadCommands = async () => {
    try {
      setLoading(true)
      console.log('🔄 Carregando comandos...')
      
      const { data, error } = await supabase
        .from('commands')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Erro ao carregar comandos:', error)
        toast.error('Erro ao carregar comandos')
        return
      }

      if (data) {
        console.log('✅ Comandos carregados:', data.length)
        setCommands(data)
      }
    } catch (err: any) {
      console.error('💥 Erro ao carregar comandos:', err)
      toast.error('Erro ao carregar comandos')
    } finally {
      setLoading(false)
    }
  }

  const addCommand = async (newCommand: NewCommand) => {
    try {
      setLoading(true)
      console.log('➕ Adicionando comando:', newCommand.title)

      // Obter usuário atual
      const { data: { session } } = await supabase.auth.getSession()
      
      const commandData = {
        title: newCommand.title,
        description: newCommand.description,
        category_name: newCommand.category_name,
        level: newCommand.level,
        prompt: newCommand.prompt,
        usage_instructions: newCommand.usage_instructions || null,
        tags: newCommand.tags || [],
        estimated_time: newCommand.estimated_time || '10 min',
        views: 0,
        copies: 0,
        popularity: 0,
        is_active: true,
        created_by: session?.user?.id || null
      }

      const { data, error } = await supabase
        .from('commands')
        .insert([commandData])
        .select()
        .single()

      if (error) {
        console.error('❌ Erro ao adicionar comando:', error)
        toast.error('Erro ao adicionar comando')
        return
      }

      if (data) {
        console.log('✅ Comando adicionado:', data.title)
        setCommands(prev => [data, ...prev])
        toast.success('Comando adicionado com sucesso!')
      }
    } catch (err: any) {
      console.error('💥 Erro ao adicionar comando:', err)
      toast.error('Erro ao adicionar comando')
    } finally {
      setLoading(false)
    }
  }

  // Carregar comandos na inicialização
  useEffect(() => {
    loadCommands()
  }, [])

  return (
    <CommandsContext.Provider value={{ 
      commands, 
      loading,
      addCommand, 
      loadCommands,
      setCommands,
      setLoading
    }}>
      {children}
    </CommandsContext.Provider>
  )
}

export const useCommands = () => {
  const context = useContext(CommandsContext)
  if (!context) {
    throw new Error('useCommands must be used within a CommandsProvider')
  }
  return context
}