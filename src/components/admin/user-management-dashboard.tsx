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
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Users
} from 'lucide-react';
import { toast } from 'sonner';
import { useUsers } from '@/contexts/users-context';
import { useAuth } from '@/components/auth/auth-provider';

export const UserManagementDashboard: React.FC = () => {
  const { users, loading, error, deleteUser, toggleUserStatus, refreshUsers } = useUsers();
  const { profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [roleFilter, setRoleFilter] = useState('todos');

  // Filtrar usuários
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.company && user.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'todos' || user.status === statusFilter;
    const matchesRole = roleFilter === 'todos' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

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

  // Se há erro, mostrar interface de erro
  if (error) {
    return (
      <div className="space-y-6">
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
                  onClick={refreshUsers}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Tentar Novamente
                </Button>
                
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="border-red-300 text-red-600"
                >
                  Recarregar Página
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status de sucesso */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <div className="font-semibold text-green-800 dark:text-green-200">
                Sistema Conectado
              </div>
              <div className="text-sm text-green-600 dark:text-green-300">
                {users.length} usuário(s) carregado(s) com sucesso
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
                <div className="text-2xl font-bold text-[#0F1115] dark:text-white">{stats.total}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total de Usuários</div>
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
                <div className="text-2xl font-bold text-[#0F1115] dark:text-white">{stats.active}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Usuários Ativos</div>
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
                <div className="text-2xl font-bold text-[#0F1115] dark:text-white">{stats.inactive}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Usuários Inativos</div>
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
                <div className="text-2xl font-bold text-[#0F1115] dark:text-white">{stats.suspended}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Usuários Suspensos</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <Card className="border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-[#0F1115] dark:text-white flex items-center gap-2">
              <Filter className="h-5 w-5 text-[#2563EB]" />
              Gerenciar Usuários ({filteredUsers.length} de {users.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={refreshUsers}
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
                <TableRow className="bg-gray-50 dark:bg-gray-800">
                  <TableHead className="font-semibold text-[#0F1115] dark:text-white">Usuário</TableHead>
                  <TableHead className="font-semibold text-[#0F1115] dark:text-white">Status</TableHead>
                  <TableHead className="font-semibold text-[#0F1115] dark:text-white">Função</TableHead>
                  <TableHead className="font-semibold text-[#0F1115] dark:text-white">Empresa</TableHead>
                  <TableHead className="font-semibold text-[#0F1115] dark:text-white">Atividade</TableHead>
                  <TableHead className="font-semibold text-[#0F1115] dark:text-white">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-[#0F1115] dark:text-white">{user.name}</div>
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
                      {getStatusBadge(user.status)}
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

          {filteredUsers.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchTerm || statusFilter !== 'todos' || roleFilter !== 'todos' 
                  ? 'Nenhum usuário encontrado' 
                  : 'Nenhum usuário cadastrado'
                }
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm || statusFilter !== 'todos' || roleFilter !== 'todos'
                  ? 'Tente ajustar os filtros para encontrar usuários'
                  : 'Comece criando o primeiro usuário da plataforma'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};