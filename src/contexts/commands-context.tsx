'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/auth/auth-provider'
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
  favorites: string[]
  loading: boolean
  addCommand: (command: NewCommand) => Promise<void>
  updateCommand: (id: string, command: Partial<NewCommand>) => Promise<void>
  deleteCommand: (id: string) => Promise<void>
  getCommandById: (id: string) => Command | undefined
  getRelatedCommands: (commandId: string) => Array<{
    id: string;
    title: string;
    category: string;
    level: string;
  }>
  loadCommands: () => Promise<void>
  setCommands: (commands: Command[]) => void
  setLoading: (loading: boolean) => void
  toggleFavorite: (commandId: string) => Promise<void>
  incrementViews: (commandId: string) => Promise<void>
  incrementCopies: (commandId: string) => Promise<void>
}>({ 
  commands: [], 
  favorites: [],
  loading: false,
  addCommand: async () => {}, 
  updateCommand: async () => {},
  deleteCommand: async () => {},
  getCommandById: () => undefined,
  getRelatedCommands: () => [],
  loadCommands: async () => {},
  setCommands: () => {},
  setLoading: () => {},
  toggleFavorite: async () => {},
  incrementViews: async () => {},
  incrementCopies: async () => {}
})

export const CommandsProvider = ({ children }: { children: ReactNode }) => {
  const [commands, setCommands] = useState<Command[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const loadCommands = useCallback(async () => {
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
  }, [])

  const loadFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([])
      return
    }

    try {
      console.log('🔄 Carregando favoritos do usuário:', user.id)
      
      const { data, error } = await supabase
        .from('favorites')
        .select('command_id')
        .eq('user_id', user.id)

      if (error) {
        console.error('❌ Erro ao carregar favoritos:', error)
        return
      }

      if (data) {
        const favoriteIds = data.map(fav => fav.command_id)
        console.log('✅ Favoritos carregados:', favoriteIds.length)
        setFavorites(favoriteIds)
      }
    } catch (err: any) {
      console.error('💥 Erro ao carregar favoritos:', err)
    }
  }, [user])

  const toggleFavorite = useCallback(async (commandId: string) => {
    if (!user) {
      toast.error('Faça login para favoritar comandos')
      return
    }

    try {
      const isFavorite = favorites.includes(commandId)
      
      if (isFavorite) {
        // Remover dos favoritos
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('command_id', commandId)

        if (error) {
          console.error('❌ Erro ao remover favorito:', error)
          toast.error('Erro ao remover favorito')
          return
        }

        setFavorites(prev => prev.filter(id => id !== commandId))
        toast.success('Removido dos favoritos')
      } else {
        // Adicionar aos favoritos
        const { error } = await supabase
          .from('favorites')
          .insert([{
            user_id: user.id,
            command_id: commandId
          }])

        if (error) {
          console.error('❌ Erro ao adicionar favorito:', error)
          toast.error('Erro ao adicionar favorito')
          return
        }

        setFavorites(prev => [...prev, commandId])
        toast.success('Adicionado aos favoritos')
      }
    } catch (err: any) {
      console.error('💥 Erro ao alterar favorito:', err)
      toast.error('Erro ao alterar favorito')
    }
  }, [user, favorites])

  const incrementViews = useCallback(async (commandId: string) => {
    try {
      console.log('👁️ Incrementando visualizações para:', commandId)
      
      const { error } = await supabase.rpc('increment_command_views', {
        command_uuid: commandId
      })

      if (error) {
        console.error('❌ Erro ao incrementar visualizações:', error)
        return
      }

      // Atualizar localmente
      setCommands(prev => prev.map(cmd => 
        cmd.id === commandId 
          ? { ...cmd, views: cmd.views + 1 }
          : cmd
      ))
    } catch (err: any) {
      console.error('💥 Erro ao incrementar visualizações:', err)
    }
  }, [])

  const incrementCopies = useCallback(async (commandId: string) => {
    try {
      console.log('📋 Incrementando cópias para:', commandId)
      
      const { error } = await supabase.rpc('increment_command_copies', {
        command_uuid: commandId
      })

      if (error) {
        console.error('❌ Erro ao incrementar cópias:', error)
        return
      }

      // Atualizar localmente
      setCommands(prev => prev.map(cmd => 
        cmd.id === commandId 
          ? { ...cmd, copies: cmd.copies + 1 }
          : cmd
      ))

      // Log da atividade do usuário se estiver logado
      if (user) {
        await supabase.rpc('log_user_activity', {
          p_user_id: user.id,
          p_command_id: commandId,
          p_activity_type: 'copy',
          p_metadata: { timestamp: new Date().toISOString() }
        })
      }
    } catch (err: any) {
      console.error('💥 Erro ao incrementar cópias:', err)
    }
  }, [user])

  const addCommand = useCallback(async (newCommand: NewCommand) => {
    try {
      setLoading(true)
      console.log('➕ Iniciando adição de comando:', newCommand.title)

      // Verificar se o usuário está autenticado
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('❌ Erro ao obter sessão:', sessionError)
        toast.error('Erro de autenticação')
        throw new Error('Erro de autenticação: ' + sessionError.message)
      }

      if (!session?.user) {
        console.error('❌ Usuário não autenticado')
        toast.error('Você precisa estar logado para adicionar comandos')
        throw new Error('Usuário não autenticado')
      }

      console.log('✅ Usuário autenticado:', session.user.email)
      
      // Mapear os dados do frontend para o formato do banco
      const commandData = {
        title: newCommand.title.trim(),
        description: newCommand.description.trim(),
        category_name: newCommand.category, // Mapear category para category_name
        level: newCommand.level,
        prompt: newCommand.prompt.trim(),
        usage_instructions: newCommand.usage?.trim() || null, // Mapear usage para usage_instructions
        tags: Array.isArray(newCommand.tags) ? newCommand.tags : [],
        estimated_time: newCommand.estimatedTime || '10 min', // Mapear estimatedTime para estimated_time
        views: 0,
        copies: 0,
        popularity: 0,
        is_active: true,
        created_by: session.user.id
      }

      console.log('📝 Dados preparados para inserção:', {
        title: commandData.title,
        category_name: commandData.category_name,
        level: commandData.level,
        tags: commandData.tags,
        created_by: commandData.created_by
      })

      const { data, error } = await supabase
        .from('commands')
        .insert([commandData])
        .select()
        .single()

      if (error) {
        console.error('❌ Erro detalhado ao adicionar comando:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        
        // Tratamento específico de erros
        if (error.code === '42501') {
          toast.error('Erro de permissão: Você não tem autorização para adicionar comandos')
          throw new Error('Erro de permissão: ' + error.message)
        } else if (error.code === '23505') {
          toast.error('Erro: Já existe um comando com este título')
          throw new Error('Comando duplicado: ' + error.message)
        } else if (error.code === '23502') {
          toast.error('Erro: Campos obrigatórios não preenchidos')
          throw new Error('Campos obrigatórios: ' + error.message)
        } else {
          toast.error('Erro ao adicionar comando: ' + error.message)
          throw new Error('Erro do banco: ' + error.message)
        }
      }

      if (data) {
        console.log('✅ Comando adicionado com sucesso:', {
          id: data.id,
          title: data.title,
          category_name: data.category_name
        })
        
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
      console.error('💥 Erro capturado ao adicionar comando:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      })
      
      // Re-throw o erro para que o formulário possa capturá-lo
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateCommand = useCallback(async (id: string, updatedCommand: Partial<NewCommand>) => {
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
  }, [])

  const deleteCommand = useCallback(async (id: string) => {
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
  }, [])

  const getCommandById = useCallback((id: string): Command | undefined => {
    return commands.find(cmd => cmd.id === id)
  }, [commands])

  const getRelatedCommands = useCallback((commandId: string) => {
    const currentCommand = getCommandById(commandId)
    if (!currentCommand) {
      return []
    }

    // Buscar comandos relacionados baseados na categoria e tags
    const relatedCommands = commands
      .filter(cmd => {
        // Excluir o comando atual
        if (cmd.id === commandId) return false
        
        // Priorizar comandos da mesma categoria
        if (cmd.category === currentCommand.category) return true
        
        // Ou comandos que compartilham tags
        const sharedTags = cmd.tags.some(tag => 
          currentCommand.tags.includes(tag)
        )
        return sharedTags
      })
      .sort((a, b) => {
        // Ordenar por categoria primeiro (mesma categoria tem prioridade)
        if (a.category === currentCommand.category && b.category !== currentCommand.category) {
          return -1
        }
        if (b.category === currentCommand.category && a.category !== currentCommand.category) {
          return 1
        }
        
        // Depois por popularidade
        return b.popularity - a.popularity
      })
      .slice(0, 4) // Limitar a 4 comandos relacionados
      .map(cmd => ({
        id: cmd.id,
        title: cmd.title,
        category: cmd.category,
        level: cmd.level
      }))

    console.log('🔗 Comandos relacionados encontrados:', relatedCommands.length)
    return relatedCommands
  }, [commands, getCommandById])

  // Carregar comandos na inicialização
  useEffect(() => {
    loadCommands()
  }, [loadCommands])

  // Carregar favoritos quando o usuário mudar
  useEffect(() => {
    loadFavorites()
  }, [loadFavorites])

  return (
    <CommandsContext.Provider value={{ 
      commands, 
      favorites,
      loading,
      addCommand, 
      updateCommand,
      deleteCommand,
      getCommandById,
      getRelatedCommands,
      loadCommands,
      setCommands,
      setLoading,
      toggleFavorite,
      incrementViews,
      incrementCopies
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