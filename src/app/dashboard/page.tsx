'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@supabase/auth-helpers-react'
import { supabase } from '@/lib/supabase'
import { useCommands } from '@/contexts/commands-context'
import { useUsers } from '@/contexts/users-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export default function DashboardPage() {
  const session = useSession()
  const router = useRouter()
  const { commands, loading: commandsLoading } = useCommands()
  const { users, loading: usersLoading } = useUsers()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session) {
      router.push('/login')
      return
    }

    const loadProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (error) {
          console.error('Erro ao carregar perfil:', error)
          return
        }

        setProfile(data)
      } catch (err) {
        console.error('Erro ao carregar perfil:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [session, router])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Logout realizado com sucesso!')
      router.push('/login')
    } catch (error) {
      console.error('Erro no logout:', error)
      toast.error('Erro ao fazer logout')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">
                Bem-vindo, {profile?.name || session.user.email}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {profile?.role && (
                <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                  {profile.role}
                </Badge>
              )}
              <Button onClick={handleLogout} variant="outline">
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Estatísticas */}
          <Card>
            <CardHeader>
              <CardTitle>Comandos</CardTitle>
              <CardDescription>Total de comandos disponíveis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {commandsLoading ? '...' : commands.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usuários</CardTitle>
              <CardDescription>Total de usuários cadastrados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usersLoading ? '...' : users.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seu Perfil</CardTitle>
              <CardDescription>Informações da sua conta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Email:</span> {session.user.email}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Nome:</span> {profile?.name || 'Não informado'}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Comandos usados:</span> {profile?.commands_used || 0}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comandos Recentes */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Comandos Recentes</CardTitle>
              <CardDescription>Últimos comandos adicionados ao sistema</CardDescription>
            </CardHeader>
            <CardContent>
              {commandsLoading ? (
                <p className="text-gray-500">Carregando comandos...</p>
              ) : commands.length > 0 ? (
                <div className="space-y-3">
                  {commands.slice(0, 5).map((command) => (
                    <div key={command.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{command.title}</h4>
                        <p className="text-sm text-gray-600">{command.description}</p>
                      </div>
                      <Badge variant="outline">{command.level}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Nenhum comando encontrado</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}