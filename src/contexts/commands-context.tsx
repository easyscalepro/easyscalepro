'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export type Command = {
  id: string
  title: string
  description: string
  category: string // Usando category ao invés de category_name para compatibilidade
  level: 'iniciante' | 'intermediário' | 'avançado'
  prompt: string
  usage?: string | null // Usando usage ao invés de usage_instructions
  tags: string[]
  estimatedTime: string // Usando estimatedTime ao invés de estimated_time
  views: number
  copies: number
  popularity: number
  isActive?: boolean
  createdBy?: string | null
  createdAt: string
  updatedAt?: string
}

type NewCommand = {
  title: string
  description: string
  category: string
  level: 'iniciante' | 'intermediário' | 'avançado'
  prompt: string
  usage?: string
  tags?: string[]
  estimatedTime?: string
}

const CommandsContext = createContext<{
  commands: Command[]
  loading: boolean
  addCommand: (command: NewCommand) => Promise<void>
  updateCommand: (id: string, command: Partial<NewCommand>) => Promise<void>
  deleteCommand: (id: string) => Promise<void>
  getCommandById: (id: string) => Command | undefined
  loadCommands: () => Promise<void>
  setCommands: (commands: Command[]) => void
  setLoading: (loading: boolean) => void
}>({ 
  commands: [], 
  loading: false,
  addCommand: async () => {}, 
  updateCommand: async () => {},
  deleteCommand: async () => {},
  getCommandById: () => undefined,
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
        // Mapear os dados do banco para o formato esperado pelo frontend
        const mappedCommands = data.map(cmd => ({
          id: cmd.id,
          title: cmd.title,
          description: cmd.description,
          category: cmd.category_name, // Mapear category_name para category
          level: cmd.level,
          prompt: cmd.prompt,
          usage: cmd.usage_instructions, // Mapear usage_instructions para usage
          tags: cmd.tags || [],
          estimatedTime: cmd.estimated_time || '10 min', // Mapear estimated_time para estimatedTime
          views: cmd.views || 0,
          copies: cmd.copies || 0,
          popularity: cmd.popularity || 0,
          isActive: cmd.is_active,
          createdBy: cmd.created_by,
          createdAt: cmd.created_at,
          updatedAt: cmd.updated_at
        }))
        setCommands(mappedCommands)
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
      
      // Mapear os dados do frontend para o formato do banco
      const commandData = {
        title: newCommand.title,
        description: newCommand.description,
        category_name: newCommand.category, // Mapear category para category_name
        level: newCommand.level,
        prompt: newCommand.prompt,
        usage_instructions: newCommand.usage || null, // Mapear usage para usage_instructions
        tags: newCommand.tags || [],
        estimated_time: newCommand.estimatedTime || '10 min', // Mapear estimatedTime para estimated_time
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
        throw error
      }

      if (data) {
        console.log('✅ Comando adicionado:', data.title)
        
        // Mapear os dados do banco para o formato do frontend
        const mappedCommand: Command = {
          id: data.id,
          title: data.title,
          description: data.description,
          category: data.category_name,
          level: data.level,
          prompt: data.prompt,
          usage: data.usage_instructions,
          tags: data.tags || [],
          estimatedTime: data.estimated_time || '10 min',
          views: data.views || 0,
          copies: data.copies || 0,
          popularity: data.popularity || 0,
          isActive: data.is_active,
          createdBy: data.created_by,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        }
        
        setCommands(prev => [mappedCommand, ...prev])
        toast.success('Comando adicionado com sucesso!')
      }
    } catch (err: any) {
      console.error('💥 Erro ao adicionar comando:', err)
      toast.error('Erro ao adicionar comando')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateCommand = async (id: string, updatedCommand: Partial<NewCommand>) => {
    try {
      setLoading(true)
      console.log('✏️ Atualizando comando:', id)

      // Mapear os dados do frontend para o formato do banco
      const commandData: any = {}
      if (updatedCommand.title) commandData.title = updatedCommand.title
      if (updatedCommand.description) commandData.description = updatedCommand.description
      if (updatedCommand.category) commandData.category_name = updatedCommand.category
      if (updatedCommand.level) commandData.level = updatedCommand.level
      if (updatedCommand.prompt) commandData.prompt = updatedCommand.prompt
      if (updatedCommand.usage !== undefined) commandData.usage_instructions = updatedCommand.usage
      if (updatedCommand.tags) commandData.tags = updatedCommand.tags
      if (updatedCommand.estimatedTime) commandData.estimated_time = updatedCommand.estimatedTime
      
      commandData.updated_at = new Date().toISOString()

      const { data, error } = await supabase
        .from('commands')
        .update(commandData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('❌ Erro ao atualizar comando:', error)
        toast.error('Erro ao atualizar comando')
        throw error
      }

      if (data) {
        console.log('✅ Comando atualizado:', data.title)
        
        // Mapear os dados do banco para o formato do frontend
        const mappedCommand: Command = {
          id: data.id,
          title: data.title,
          description: data.description,
          category: data.category_name,
          level: data.level,
          prompt: data.prompt,
          usage: data.usage_instructions,
          tags: data.tags || [],
          estimatedTime: data.estimated_time || '10 min',
          views: data.views || 0,
          copies: data.copies || 0,
          popularity: data.popularity || 0,
          isActive: data.is_active,
          createdBy: data.created_by,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        }
        
        setCommands(prev => prev.map(cmd => cmd.id === id ? mappedCommand : cmd))
        toast.success('Comando atualizado com sucesso!')
      }
    } catch (err: any) {
      console.error('💥 Erro ao atualizar comando:', err)
      toast.error('Erro ao atualizar comando')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteCommand = async (id: string) => {
    try {
      setLoading(true)
      console.log('🗑️ Deletando comando:', id)

      const { error } = await supabase
        .from('commands')
        .update({ is_active: false })
        .eq('id', id)

      if (error) {
        console.error('❌ Erro ao deletar comando:', error)
        toast.error('Erro ao deletar comando')
        throw error
      }

      console.log('✅ Comando deletado (desativado)')
      setCommands(prev => prev.filter(cmd => cmd.id !== id))
      toast.success('Comando deletado com sucesso!')
    } catch (err: any) {
      console.error('💥 Erro ao deletar comando:', err)
      toast.error('Erro ao deletar comando')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getCommandById = (id: string): Command | undefined => {
    return commands.find(cmd => cmd.id === id)
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
      updateCommand,
      deleteCommand,
      getCommandById,
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