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

// Função helper para converter erros do Supabase em Error instances
const createErrorFromSupabase = (error: any, defaultMessage: string): Error => {
  if (error instanceof Error) {
    return error;
  }
  
  if (error && typeof error === 'object') {
    const message = error.message || error.error_description || error.msg || defaultMessage;
    const newError = new Error(message);
    
    // Preservar propriedades úteis do erro original
    if (error.code) (newError as any).code = error.code;
    if (error.details) (newError as any).details = error.details;
    if (error.hint) (newError as any).hint = error.hint;
    
    return newError;
  }
  
  return new Error(defaultMessage);
};

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
  const { user, profile } = useAuth()

  // Função helper para encontrar comando por ID (não usar useCallback para evitar dependências circulares)
  const findCommandById = (id: string): Command | undefined => {
    return commands.find(cmd => cmd.id === id)
  }

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
        const errorInstance = createErrorFromSupabase(error, 'Erro ao carregar comandos');
        toast.error(errorInstance.message)
        throw errorInstance;
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
      const errorInstance = err instanceof Error ? err : createErrorFromSupabase(err, 'Erro inesperado ao carregar comandos');
      toast.error(errorInstance.message)
      // Não re-throw aqui para não quebrar a aplicação
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
        const errorInstance = createErrorFromSupabase(error, 'Erro ao carregar favoritos');
        // Não mostrar toast para favoritos, é menos crítico
        console.warn('⚠️ Favoritos não carregados:', errorInstance.message);
        return
      }

      if (data) {
        const favoriteIds = data.map(fav => fav.command_id)
        console.log('✅ Favoritos carregados:', favoriteIds.length)
        setFavorites(favoriteIds)
      }
    } catch (err: any) {
      console.error('💥 Erro ao carregar favoritos:', err)
      const errorInstance = err instanceof Error ? err : createErrorFromSupabase(err, 'Erro inesperado ao carregar favoritos');
      console.warn('⚠️ Favoritos não carregados:', errorInstance.message);
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
          const errorInstance = createErrorFromSupabase(error, 'Erro ao remover favorito');
          toast.error(errorInstance.message)
          throw errorInstance;
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
          const errorInstance = createErrorFromSupabase(error, 'Erro ao adicionar favorito');
          toast.error(errorInstance.message)
          throw errorInstance;
        }

        setFavorites(prev => [...prev, commandId])
        toast.success('Adicionado aos favoritos')
      }
    } catch (err: any) {
      console.error('💥 Erro ao alterar favorito:', err)
      const errorInstance = err instanceof Error ? err : createErrorFromSupabase(err, 'Erro inesperado ao alterar favorito');
      toast.error(errorInstance.message)
      // Não re-throw para não quebrar a UI
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
        const errorInstance = createErrorFromSupabase(error, 'Erro ao incrementar visualizações');
        console.warn('⚠️ Visualizações não incrementadas:', errorInstance.message);
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
      const errorInstance = err instanceof Error ? err : createErrorFromSupabase(err, 'Erro inesperado ao incrementar visualizações');
      console.warn('⚠️ Visualizações não incrementadas:', errorInstance.message);
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
        const errorInstance = createErrorFromSupabase(error, 'Erro ao incrementar cópias');
        console.warn('⚠️ Cópias não incrementadas:', errorInstance.message);
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
        try {
          await supabase.rpc('log_user_activity', {
            p_user_id: user.id,
            p_command_id: commandId,
            p_activity_type: 'copy',
            p_metadata: { timestamp: new Date().toISOString() }
          })
        } catch (logError) {
          // Log de atividade é opcional, não quebrar se falhar
          console.warn('⚠️ Erro ao registrar atividade:', logError);
        }
      }
    } catch (err: any) {
      console.error('💥 Erro ao incrementar cópias:', err)
      const errorInstance = err instanceof Error ? err : createErrorFromSupabase(err, 'Erro inesperado ao incrementar cópias');
      console.warn('⚠️ Cópias não incrementadas:', errorInstance.message);
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
        const errorInstance = createErrorFromSupabase(sessionError, 'Erro de autenticação');
        toast.error(errorInstance.message)
        throw errorInstance;
      }

      if (!session?.user) {
        const errorInstance = new Error('Você precisa estar logado para adicionar comandos');
        console.error('❌ Usuário não autenticado')
        toast.error(errorInstance.message)
        throw errorInstance;
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
        let errorMessage = 'Erro ao adicionar comando';
        if (error.code === '42501') {
          errorMessage = 'Erro de permissão: Você não tem autorização para adicionar comandos';
        } else if (error.code === '23505') {
          errorMessage = 'Erro: Já existe um comando com este título';
        } else if (error.code === '23502') {
          errorMessage = 'Erro: Campos obrigatórios não preenchidos';
        } else if (error.message) {
          errorMessage = `Erro ao adicionar comando: ${error.message}`;
        }
        
        const errorInstance = createErrorFromSupabase(error, errorMessage);
        toast.error(errorInstance.message)
        throw errorInstance;
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
      console.error('💥 Erro capturado ao adicionar comando:', err)
      
      // Garantir que sempre lançamos um Error instance
      const errorInstance = err instanceof Error ? err : createErrorFromSupabase(err, 'Erro inesperado ao adicionar comando');
      throw errorInstance;
    } finally {
      setLoading(false)
    }
  }, [])

  const updateCommand = useCallback(async (id: string, updatedCommand: Partial<NewCommand>) => {
    try {
      setLoading(true)
      console.log('✏️ Atualizando comando:', id)

      // Verificar se o usuário está autenticado
      if (!user) {
        const errorInstance = new Error('Você precisa estar logado para atualizar comandos');
        toast.error(errorInstance.message)
        throw errorInstance;
      }

      // Verificar se o comando existe e se o usuário tem permissão
      const command = findCommandById(id);
      if (!command) {
        const errorInstance = new Error('Comando não encontrado');
        toast.error(errorInstance.message)
        throw errorInstance;
      }

      // Verificar permissões: usuário deve ser o criador ou admin
      const isOwner = command.createdBy === user.id;
      const isAdmin = profile?.role === 'admin';
      
      if (!isOwner && !isAdmin) {
        const errorInstance = new Error('Você não tem permissão para atualizar este comando');
        toast.error(errorInstance.message)
        throw errorInstance;
      }

      console.log('✅ Permissões verificadas - usuário pode atualizar comando');

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
        const errorInstance = createErrorFromSupabase(error, 'Erro ao atualizar comando');
        toast.error(errorInstance.message)
        throw errorInstance;
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
      const errorInstance = err instanceof Error ? err : createErrorFromSupabase(err, 'Erro inesperado ao atualizar comando');
      toast.error(errorInstance.message)
      throw errorInstance;
    } finally {
      setLoading(false)
    }
  }, [user, profile, commands]) // Usar commands ao invés de getCommandById

  const deleteCommand = useCallback(async (id: string) => {
    try {
      setLoading(true)
      console.log('🗑️ Deletando comando:', id)

      // Verificar se o usuário está autenticado
      if (!user) {
        const errorInstance = new Error('Você precisa estar logado para deletar comandos');
        toast.error(errorInstance.message)
        throw errorInstance;
      }

      // Verificar se o comando existe e se o usuário tem permissão
      const command = findCommandById(id);
      if (!command) {
        const errorInstance = new Error('Comando não encontrado');
        toast.error(errorInstance.message)
        throw errorInstance;
      }

      // Debug detalhado das permissões
      const isOwner = command.createdBy === user.id;
      const isAdmin = profile?.role === 'admin';
      
      console.log('🔍 Debug de permissões:', {
        commandId: id,
        commandTitle: command.title,
        commandCreatedBy: command.createdBy,
        currentUserId: user.id,
        currentUserEmail: user.email,
        userProfile: profile,
        isOwner,
        isAdmin,
        hasPermission: isOwner || isAdmin
      });

      if (!isOwner && !isAdmin) {
        const errorInstance = new Error('Você não tem permissão para deletar este comando');
        toast.error(errorInstance.message)
        throw errorInstance;
      }

      console.log('✅ Permissões verificadas - usuário pode deletar comando');

      // Tentar a operação de update
      console.log('📝 Executando UPDATE para desativar comando...');
      const { data, error } = await supabase
        .from('commands')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()

      // Debug detalhado do erro
      if (error) {
        console.error('❌ Erro detalhado ao deletar comando:', {
          error,
          errorType: typeof error,
          errorKeys: Object.keys(error || {}),
          errorMessage: error?.message,
          errorCode: error?.code,
          errorDetails: error?.details,
          errorHint: error?.hint
        })
        
        // Verificar se é erro vazio
        if (!error.message && !error.code && Object.keys(error).length === 0) {
          const errorInstance = new Error('Erro desconhecido ao deletar comando. Verifique suas permissões.');
          toast.error(errorInstance.message)
          throw errorInstance;
        }
        
        // Tratamento específico para erro de RLS
        if (error.code === '42501' || error.message?.includes('row-level security policy')) {
          const errorInstance = new Error('Erro de permissão: Você não tem autorização para deletar este comando. Verifique se você é o criador ou tem privilégios de administrador.');
          toast.error(errorInstance.message)
          throw errorInstance;
        }
        
        const errorInstance = createErrorFromSupabase(error, 'Erro ao deletar comando');
        toast.error(errorInstance.message)
        throw errorInstance;
      }

      console.log('✅ Comando deletado (desativado):', data)
      setCommands(prev => prev.filter(cmd => cmd.id !== id))
      toast.success('Comando deletado com sucesso!')
    } catch (err: any) {
      console.error('💥 Erro ao deletar comando:', err)
      const errorInstance = err instanceof Error ? err : createErrorFromSupabase(err, 'Erro inesperado ao deletar comando');
      toast.error(errorInstance.message)
      throw errorInstance;
    } finally {
      setLoading(false)
    }
  }, [user, profile, commands]) // Usar commands ao invés de getCommandById

  // Definir getCommandById como useCallback DEPOIS das outras funções
  const getCommandById = useCallback((id: string): Command | undefined => {
    return findCommandById(id)
  }, [commands])

  const getRelatedCommands = useCallback((commandId: string) => {
    const currentCommand = findCommandById(commandId)
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
  }, [commands])

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