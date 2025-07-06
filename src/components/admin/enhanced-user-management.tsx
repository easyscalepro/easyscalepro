"use client";

import React, { useState, useEffect } from 'react';
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
  Upload,
  AlertTriangle,
  CheckCircle,
  Database,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { useUsers } from '@/contexts/users-context';
import { UserFormModal } from './user-form-modal';
import { UserSyncButton } from './user-sync-button';
import { ManualUserSync } from './manual-user-sync';
import { UserCreationTest } from './user-creation-test';
import { LoginTest } from './login-test';
import { DatabaseCheck } from './database-check';
import { EmailConfirmationTool } from './email-confirmation-tool';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/auth-provider';

export const EnhancedUserManagement: React.FC = () => {
  const { users, deleteUser, toggleUserStatus } = useUsers();
  const { profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [roleFilter, setRoleFilter] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState(undefined);
  const [syncStatus, setSyncStatus] = useState<{
    authUsers: number;
    profiles: number;
    needsSync: boolean;
    hasAdminAccess: boolean;
  } | null>(null);

  // Verificar status de sincronização ao carregar
  useEffect(() => {
    checkSyncStatus();
  }, []);

  const checkSyncStatus = async () => {
    try {
      let authCount = 0;
      let hasAdminAccess = false;

      // Tentar acessar Admin API
      try {
        const { data: authResponse, error: authError } = await supabase.auth.admin.listUsers();
        
        if (!authError && authResponse) {
          authCount = authResponse.users?.length || 0;
          hasAdminAccess = true;
        }
      } catch (error) {
        console.warn('Sem acesso à Admin API:', error);
      }

      // Buscar perfis existentes
      const { data: profiles } = await supabase.from('profiles').select('id');
      const profileCount = profiles?.length || 0;
      
      setSyncStatus({
        authUsers: authCount,
        profiles: profileCount,
        needsSync: hasAdminAccess && authCount > profileCount,
        hasAdminAccess
      });
    } catch (error) {
      console.warn('Não foi possível verificar status de sincronização:', error);
      setSyncStatus({
        authUsers: 0,
        profiles: 0,
        needsSync: false,
        hasAdminAccess: false
      });
    }
  };

  // Filtrar usuários
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.company && user.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'todos' || user.status === statusFilter;
    const matchesRole = roleFilter === 'todos' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleCreateUser = () => {
    setModalMode('create');
    setSelectedUser(undefined);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: any) => {
    setModalMode('edit');
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir o usuário "${name}"?\n\nEsta ação não pode ser desfeita.`)) {
      deleteUser(id);
    }
  };

  const handleToggleStatus = (id: string, currentStatus: string, name: string) => {
    const newStatus = currentStatus === 'ativo' ? 'inativo' : 'ativo';
    if (confirm(`Deseja ${newStatus === 'ativo' ? 'ativar' : 'desativar'} o usuário "${name}"?`)) {
      toggleUserStatus(id);
    }
  };

  const handleSendEmail = (email: string, name: string) => {
    toast.info(`Email enviado para ${name} (${email})`);
  };

  const handleExportUsers = () => {
    const csvContent = [
      ['Nome', 'Email', 'Status', 'Função', 'Empresa', 'Telefone', 'Comandos Usados', 'Último Acesso', 'Membro desde'],
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        user.status,
        user.role,
        user.company || '',
        user.phone || '',
        user.commandsUsed.toString(),
        user.lastAccess,
        user.joinedAt
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `usuarios_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Lista de usuários exportada com sucesso!');
  };

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

  // Estatísticas
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'ativo').length,
    inactive: users.filter(u => u.status === 'inativo').length,
    suspended: users.filter(u => u.status === 'suspenso').length
  };

  return (
    <div className="space-y-6">
      {/* Componente de sincronização manual */}
      <ManualUserSync />

      {/* Componente de verificação do banco */}
      <DatabaseCheck />

      {/* Ferramenta de confirmação de email */}
      <EmailConfirmationTool />

      {/* Componentes de teste */}
      {profile?.role === 'admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UserCreationTest />
          <LoginTest />
        </div>
      )}

      {/* Alerta de sincronização se necessário */}
      {syncStatus?.needsSync && syncStatus.hasAdminAccess && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <div className="flex-1">
              <h4 className="font-semibold text-amber-900 dark:text-amber-100">
                Usuários não sincronizados detectados
              </h4>
              <p className="text-amber-700 dark:text-amber-300 text-sm">
                Existem {syncStatus.authUsers - syncStatus.profiles} usuários no sistema de autenticação 
                que não estão na tabela de perfis. Use o botão "Sincronizar Usuários" para importá-los.
              </p>
            </div>
            <UserSyncButton />
          </div>
        </div>
      )}

      {/* Aviso sobre limitações de acesso */}
      {syncStatus && !syncStatus.hasAdminAccess && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-blue-600" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">
                Acesso Limitado ao Sistema de Autenticação
              </h4>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Sem acesso à Admin API. Apenas sincronização manual disponível.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status de sincronização */}
      {syncStatus && syncStatus.hasAdminAccess && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-blue-600" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">
                Status de Sincronização
              </h4>
              <div className="flex items-center gap-4 text-sm text-blue-700 dark:text-blue-300 mt-1">
                <span>Auth: {syncStatus.authUsers} usuários</span>
                <span>Perfis: {syncStatus.profiles} usuários</span>
                {!syncStatus.needsSync && (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-3 w-3" />
                    <span>Sincronizado</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600" />
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
              <div className="p-2 bg-gray-100 rounded-lg">
                <UserX className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#0F1115]">{stats.inactive}</div>
                <div className="text-sm text-gray-600">Usuários Inativos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <UserX className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#0F1115]">{stats.suspended}</div>
                <div className="text-sm text-gray-600">Usuários Suspensos</div>
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
              Gerenciar Usuários ({filteredUsers.length} de {users.length})
            </CardTitle>
            <div className="flex gap-2">
              {syncStatus?.hasAdminAccess && <UserSyncButton />}
              <Button
                onClick={handleExportUsers}
                variant="outline"
                size="sm"
                className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              {profile?.role === 'admin' && (
                <Button 
                  onClick={handleCreateUser}
                  size="sm"
                  className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0F1115] font-medium"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Novo Usuário
                </Button>
              )}
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
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-[#0F1115]">{user.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatus Badge(user.status)}
                    </TableCell>
                    <TableCell>
                      {getRoleBadge(user.role)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Building className="h-3 w-3 text-gray-400" />
                        {user.company || 'Não informado'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Activity className="h-3 w-3" />
                          {user.commandsUsed} comandos
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {user.lastAccess}
                        </div>
                        <div className="text-xs text-gray-400">
                          Desde {user.joinedAt}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          onClick={() => handleEditUser(user)}
                          size="sm"
                          variant="outline"
                          className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white"
                          title="Editar usuário"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleToggleStatus(user.id, user.status, user.name)}
                          size="sm"
                          variant="outline"
                          className={user.status === 'ativo' 
                            ? "border-orange-500 text-orange-600 hover:bg-orange-50"
                            : "border-green-500 text-green-600 hover:bg-green-50"
                          }
                          title={user.status === 'ativo' ? 'Desativar usuário' : 'Ativar usuário'}
                        >
                          {user.status === 'ativo' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </Button>
                        <Button
                          onClick={() => handleSendEmail(user.email, user.name)}
                          size="sm"
                          variant="outline"
                          className="border-blue-300 text-blue-600 hover:bg-blue-50"
                          title="Enviar email"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        {profile?.role === 'admin' && (
                          <Button
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                            title="Excluir usuário"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
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
              {(!searchTerm && statusFilter === 'todos' && roleFilter === 'todos' && profile?.role === 'admin') && (
                <Button 
                  onClick={handleCreateUser}
                  className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0F1115]"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Criar Primeiro Usuário
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de formulário */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        mode={modalMode}
      />
    </div>
  );
};