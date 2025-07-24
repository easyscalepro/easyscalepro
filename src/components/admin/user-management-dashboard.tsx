"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  UserPlus, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX, 
  Mail, 
  Phone, 
  Building,
  Calendar,
  Activity,
  Filter,
  Download,
  RefreshCw,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle,
  Database,
  Wifi,
  WifiOff
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/auth-provider';
import { UserFormDialog } from './user-form-dialog';

interface Profile {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  phone: string | null;
  role: 'admin' | 'user' | 'moderator';
  status: 'ativo' | 'inativo' | 'suspenso';
  avatar_url: string | null;
  commands_used: number;
  last_access: string | null;
  created_at: string;
  updated_at: string;
}

export const UserManagementDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [roleFilter, setRoleFilter] = useState('todos');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedProfile, setSelectedProfile] = useState<Profile | undefined>(undefined);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  // Verificar conexão
  const checkConnection = useCallback(async () => {
    try {
      setConnectionStatus('checking');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      if (error) {
        console.warn('Problema de conexão:', error);
        setConnectionStatus('disconnected');
        return false;
      } else {
        setConnectionStatus('connected');
        return true;
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      setConnectionStatus('disconnected');
      return false;
    }
  }, []);

  // Carregar perfis do Supabase
  const loadProfiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Carregando perfis da tabela profiles...');

      // Verificar conexão primeiro
      const isConnected = await checkConnection();
      if (!isConnected) {
        throw new Error('Sem conexão com o banco de dados');
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro detalhado ao carregar perfis:', {
          error: error,
          message: error?.message || 'Erro desconhecido',
          details: error?.details || 'Sem detalhes',
          hint: error?.hint || 'Sem dicas',
          code: error?.code || 'Sem código'
        });

        let errorMessage = 'Erro ao carregar usuários';
        
        if (error.code === '42501') {
          errorMessage = 'Sem permissão para acessar a tabela de usuários. Verifique as políticas RLS.';
        } else if (error.code === '42P01') {
          errorMessage = 'Tabela profiles não encontrada. Entre em contato com o administrador.';
        } else if (error.message?.includes('permission')) {
          errorMessage = 'Sem permissão para acessar dados de usuários';
        } else if (error.message?.includes('relation') || error.message?.includes('table')) {
          errorMessage = 'Tabela de usuários não configurada corretamente';
        } else if (error.message) {
          errorMessage = error.message;
        }

        throw new Error(errorMessage);
      }

      console.log('✅ Perfis carregados:', data?.length || 0);
      setProfiles(data || []);

      if (!data || data.length === 0) {
        console.log('ℹ️ Tabela profiles está vazia');
        toast.info('Nenhum usuário encontrado. Crie o primeiro usuário!');
      }

    } catch (error: any) {
      console.error('💥 Erro geral ao carregar perfis:', error);
      setError(error.message || 'Erro desconhecido ao carregar usuários');
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, [checkConnection]);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  // Filtrar perfis
  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = 
      (profile.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      profile.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (profile.company?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesStatus = statusFilter === 'todos' || profile.status === statusFilter;
    const matchesRole = roleFilter === 'todos' || profile.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Estatísticas
  const stats = {
    total: profiles.length,
    active: profiles.filter(p => p.status === 'ativo').length,
    inactive: profiles.filter(p => p.status === 'inativo').length,
    suspended: profiles.filter(p => p.status === 'suspenso').length,
    admins: profiles.filter(p => p.role === 'admin').length,
    users: profiles.filter(p => p.role === 'user').length,
    moderators: profiles.filter(p => p.role === 'moderator').length
  };

  // Ações
  const handleCreateUser = () => {
    setDialogMode('create');
    setSelectedProfile(undefined);
    setIsDialogOpen(true);
  };

  const handleEditUser = (profile: Profile) => {
    setDialogMode('edit');
    setSelectedProfile(profile);
    setIsDialogOpen(true);
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário "${name || 'Sem nome'}"?\n\nEsta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Erro ao excluir perfil:', error);
        toast.error('Erro ao excluir usuário: ' + error.message);
        return;
      }

      toast.success('Usuário excluído com sucesso!');
      await loadProfiles();

    } catch (error: any) {
      console.error('💥 Erro ao excluir usuário:', error);
      toast.error('Erro ao excluir usuário');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string, name: string) => {
    const newStatus = currentStatus === 'ativo' ? 'inativo' : 'ativo';
    
    if (!confirm(`Deseja ${newStatus === 'ativo' ? 'ativar' : 'desativar'} o usuário "${name || 'Sem nome'}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('❌ Erro ao atualizar status:', error);
        toast.error('Erro ao atualizar status: ' + error.message);
        return;
      }

      toast.success(`Usuário ${newStatus === 'ativo' ? 'ativado' : 'desativado'} com sucesso!`);
      await loadProfiles();

    } catch (error: any) {
      console.error('💥 Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  // Exportar sem usar clipboard - usar download direto
  const handleExportUsers = () => {
    try {
      const csvContent = [
        ['Nome', 'Email', 'Status', 'Função', 'Empresa', 'Telefone', 'Comandos Usados', 'Último Acesso', 'Criado em'],
        ...filteredProfiles.map(profile => [
          profile.name || '',
          profile.email,
          profile.status,
          profile.role,
          profile.company || '',
          profile.phone || '',
          profile.commands_used?.toString() || '0',
          profile.last_access ? new Date(profile.last_access).toLocaleString('pt-BR') : 'Nunca',
          new Date(profile.created_at).toLocaleString('pt-BR')
        ])
      ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `usuarios_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Lista de usuários exportada com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast.error('Erro ao exportar lista de usuários');
    }
  };

  // Badges
  const getStatusBadge = (status: string) => {
    const styles = {
      ativo: 'bg-green-100 text-green-800 border-green-200',
      inativo: 'bg-gray-100 text-gray-800 border-gray-200',
      suspenso: 'bg-red-100 text-red-800 border-red-200'
    };
    return <Badge className={`${styles[status as keyof typeof styles]} border`}>{status}</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: 'bg-purple-100 text-purple-800 border-purple-200',
      moderator: 'bg-blue-100 text-blue-800 border-blue-200',
      user: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    const labels = {
      admin: 'Administrador',
      moderator: 'Moderador',
      user: 'Usuário'
    };
    return <Badge className={`${styles[role as keyof typeof styles]} border text-xs`}>
      {labels[role as keyof typeof labels]}
    </Badge>;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  const formatLastAccess = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Hoje';
      if (diffDays === 1) return 'Ontem';
      if (diffDays < 7) return `${diffDays} dias atrás`;
      
      return date.toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  // Se há erro, mostrar interface de erro
  if (error) {
    return (
      <div className="space-y-6">
        {/* Status de conexão */}
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
              {connectionStatus === 'connected' ? (
                <Wifi className="h-5 w-5 text-green-600" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-600" />
              )}
              Status da Conexão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' : 
                connectionStatus === 'checking' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
              }`}></div>
              <span className="text-sm">
                {connectionStatus === 'connected' && 'Conectado ao Supabase'}
                {connectionStatus === 'checking' && 'Verificando conexão...'}
                {connectionStatus === 'disconnected' && 'Problema de conexão'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <AlertTriangle className="h-5 w-5" />
              Erro ao Carregar Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">
                <p className="text-red-700 dark:text-red-300 font-medium">
                  {error}
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={loadProfiles}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Tentar Novamente
                </Button>
                
                <Button
                  onClick={checkConnection}
                  variant="outline"
                  className="border-red-300 text-red-600"
                >
                  <Wifi className="h-4 w-4 mr-2" />
                  Verificar Conexão
                </Button>
                
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="border-red-300 text-red-600"
                >
                  Recarregar Página
                </Button>
              </div>
              
              <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">
                <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                  Possíveis Soluções:
                </h4>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  <li>• Verifique se você está logado corretamente</li>
                  <li>• Confirme se tem permissões adequadas</li>
                  <li>• Verifique sua conexão com a internet</li>
                  <li>• Tente fazer logout e login novamente</li>
                  <li>• Entre em contato com o administrador se o problema persistir</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botão para criar primeiro usuário mesmo com erro */}
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="p-6 text-center">
            <Database className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Tabela Vazia ou Inacessível
            </h3>
            <p className="text-blue-700 dark:text-blue-300 mb-4">
              A tabela de usuários pode estar vazia ou com problemas de acesso.
            </p>
            <Button 
              onClick={handleCreateUser}
              className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0F1115]"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Tentar Criar Usuário
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status de conexão */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Wifi className="h-5 w-5 text-green-600" />
            <div>
              <div className="font-semibold text-green-800 dark:text-green-200">
                Sistema Conectado
              </div>
              <div className="text-sm text-green-600 dark:text-green-300">
                {profiles.length} usuário(s) carregado(s) com sucesso
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#0F1115]">{stats.total}</div>
                <div className="text-sm text-gray-600">Total de Usuários</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#0F1115]">{stats.active}</div>
                <div className="text-sm text-gray-600">Usuários Ativos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#0F1115]">{stats.admins}</div>
                <div className="text-sm text-gray-600">Administradores</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Activity className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#0F1115]">
                  {profiles.reduce((sum, p) => sum + (p.commands_used || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Comandos Usados</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <Card className="border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-[#0F1115] flex items-center gap-2">
              <Filter className="h-5 w-5 text-[#2563EB]" />
              Usuários Cadastrados ({filteredProfiles.length} de {profiles.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={loadProfiles}
                variant="outline"
                size="sm"
                disabled={loading}
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <Button
                onClick={handleExportUsers}
                variant="outline"
                size="sm"
                className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button 
                onClick={handleCreateUser}
                size="sm"
                className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0F1115] font-medium"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Novo Usuário
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-gray-200 focus:border-[#2563EB] focus:ring-[#2563EB]"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-12 border-gray-200 focus:border-[#2563EB] focus:ring-[#2563EB]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
                <SelectItem value="suspenso">Suspenso</SelectItem>
              </SelectContent>
            </Select>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="h-12 border-gray-200 focus:border-[#2563EB] focus:ring-[#2563EB]">
                <SelectValue placeholder="Função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as Funções</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="moderator">Moderador</SelectItem>
                <SelectItem value="user">Usuário</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('todos');
                setRoleFilter('todos');
              }}
              variant="outline"
              className="h-12 border-gray-200"
            >
              Limpar Filtros
            </Button>
          </div>

          {/* Tabela */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-[#0F1115]">Usuário</TableHead>
                  <TableHead className="font-semibold text-[#0F1115]">Status</TableHead>
                  <TableHead className="font-semibold text-[#0F1115]">Função</TableHead>
                  <TableHead className="font-semibold text-[#0F1115]">Empresa</TableHead>
                  <TableHead className="font-semibold text-[#0F1115]">Atividade</TableHead>
                  <TableHead className="font-semibold text-[#0F1115]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfiles.map((profile) => (
                  <TableRow key={profile.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {(profile.name || profile.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-[#0F1115]">
                            {profile.name || 'Sem nome'}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {profile.email}
                          </div>
                          {profile.phone && (
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {profile.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(profile.status)}
                    </TableCell>
                    <TableCell>
                      {getRoleBadge(profile.role)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Building className="h-3 w-3 text-gray-400" />
                        {profile.company || 'Não informado'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Activity className="h-3 w-3" />
                          {profile.commands_used || 0} comandos
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {formatLastAccess(profile.last_access)}
                        </div>
                        <div className="text-xs text-gray-400">
                          Desde {formatDate(profile.created_at)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          onClick={() => handleEditUser(profile)}
                          size="sm"
                          variant="outline"
                          className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white"
                          title="Editar usuário"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleToggleStatus(profile.id, profile.status, profile.name || profile.email)}
                          size="sm"
                          variant="outline"
                          className={profile.status === 'ativo' 
                            ? "border-orange-500 text-orange-600 hover:bg-orange-50"
                            : "border-green-500 text-green-600 hover:bg-green-50"
                          }
                          title={profile.status === 'ativo' ? 'Desativar usuário' : 'Ativar usuário'}
                        >
                          {profile.status === 'ativo' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </Button>
                        <Button
                          onClick={() => handleDeleteUser(profile.id, profile.name || profile.email)}
                          size="sm"
                          variant="outline"
                          className="border-red-300 text-red-600 hover:bg-red-50"
                          title="Excluir usuário"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredProfiles.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== 'todos' || roleFilter !== 'todos' 
                  ? 'Nenhum usuário encontrado' 
                  : 'Nenhum usuário cadastrado'
                }
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'todos' || roleFilter !== 'todos'
                  ? 'Tente ajustar os filtros para encontrar usuários'
                  : 'Comece criando o primeiro usuário da plataforma'
                }
              </p>
              <Button 
                onClick={handleCreateUser}
                className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0F1115]"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Criar Primeiro Usuário
              </Button>
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando usuários...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de formulário */}
      <UserFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        profile={selectedProfile}
        mode={dialogMode}
        onSuccess={loadProfiles}
      />
    </div>
  );
};