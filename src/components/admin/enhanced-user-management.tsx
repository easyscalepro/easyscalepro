"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, UserCheck, UserX, Mail, RefreshCw, Users, Filter, X, Eye, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUsers } from '@/contexts/users-context';
import { supabase } from '@/integrations/supabase/client';

export const EnhancedUserManagement: React.FC = () => {
  const { users, loading, error, updateUser, deleteUser, toggleUserStatus, refreshUsers } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [authUsers, setAuthUsers] = useState<any[]>([]);
  const [loadingAuth, setLoadingAuth] = useState(false);

  // Carregar usuários do Auth (se possível)
  const loadAuthUsers = async () => {
    try {
      setLoadingAuth(true);
      console.log('🔍 Tentando carregar usuários do Auth...');
      
      // Tentar usar Admin API (pode não funcionar sem service role)
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      
      if (!authError && authData?.users) {
        console.log('✅ Usuários do Auth carregados:', authData.users.length);
        setAuthUsers(authData.users);
      } else {
        console.warn('⚠️ Não foi possível carregar usuários do Auth:', authError);
        setAuthUsers([]);
      }
    } catch (error) {
      console.warn('⚠️ Erro ao carregar usuários do Auth:', error);
      setAuthUsers([]);
    } finally {
      setLoadingAuth(false);
    }
  };

  useEffect(() => {
    loadAuthUsers();
  }, []);

  // Combinar dados do Auth com Profiles
  const combinedUsers = users.map(profileUser => {
    const authUser = authUsers.find(au => au.id === profileUser.id);
    return {
      ...profileUser,
      authData: authUser ? {
        email_confirmed_at: authUser.email_confirmed_at,
        last_sign_in_at: authUser.last_sign_in_at,
        created_at: authUser.created_at,
        phone: authUser.phone,
        email_confirmed: !!authUser.email_confirmed_at
      } : null
    };
  });

  // Filtrar usuários
  const filteredUsers = combinedUsers.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    try {
      await toggleUserStatus(userId);
      toast.success(`Usuário ${currentStatus === 'ativo' ? 'desativado' : 'ativado'} com sucesso`);
    } catch (error) {
      toast.error('Erro ao alterar status do usuário');
    }
  };

  const handleSendEmail = (userEmail: string) => {
    window.location.href = `mailto:${userEmail}`;
    toast.info(`Abrindo cliente de email para ${userEmail}`);
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o usuário ${userName}? Esta ação não pode ser desfeita.`)) {
      try {
        await deleteUser(userId);
        toast.success('Usuário excluído com sucesso');
      } catch (error) {
        toast.error('Erro ao excluir usuário');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      ativo: "bg-green-100 text-green-800 border-green-200",
      inativo: "bg-red-100 text-red-800 border-red-200",
      suspenso: "bg-yellow-100 text-yellow-800 border-yellow-200"
    };
    
    return (
      <Badge className={`${variants[status as keyof typeof variants] || variants.inativo} border`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: "bg-purple-100 text-purple-800 border-purple-200",
      user: "bg-blue-100 text-blue-800 border-blue-200",
      moderator: "bg-orange-100 text-orange-800 border-orange-200"
    };
    
    return (
      <Badge className={`${variants[role as keyof typeof variants] || variants.user} border`}>
        {role === 'admin' ? 'Admin' : role === 'user' ? 'Usuário' : 'Moderador'}
      </Badge>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Data inválida';
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setRoleFilter('all');
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || roleFilter !== 'all';

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="text-red-600 text-lg font-medium">Erro ao carregar usuários</div>
            <p className="text-gray-600">{error}</p>
            <Button onClick={refreshUsers} className="bg-red-600 hover:bg-red-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                <p className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.status === 'ativo').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserX className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Usuários Inativos</p>
                <p className="text-2xl font-bold text-red-600">
                  {users.filter(u => u.status !== 'ativo').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Administradores</p>
                <p className="text-2xl font-bold text-purple-600">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e busca */}
      <Card className="border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-[#0F1115] flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gerenciar Usuários
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={refreshUsers}
                disabled={loading}
                variant="outline"
                size="sm"
                className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <Button
                onClick={loadAuthUsers}
                disabled={loadingAuth}
                variant="outline"
                size="sm"
              >
                <Eye className={`h-4 w-4 mr-2 ${loadingAuth ? 'animate-spin' : ''}`} />
                Sync Auth
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 pt-0 lasy-highlight">
          <div className="space-y-4">
            {/* Barra de busca */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-gray-200 focus:border-[#2563EB] focus:ring-[#2563EB]"
              />
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Status:</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Todos os Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                    <SelectItem value="suspenso">Suspenso</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Função:</label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Todas as Funções" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Funções</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="user">Usuário</SelectItem>
                    <SelectItem value="moderator">Moderador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {hasActiveFilters && (
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  size="sm"
                  className="text-gray-600 hover:text-gray-800"
                >
                  <X className="h-4 w-4 mr-1" />
                  Limpar Filtros
                </Button>
              )}
            </div>

            {/* Resultados */}
            <div className="text-sm text-gray-600">
              Mostrando {filteredUsers.length} de {users.length} usuários
              {hasActiveFilters && ' (filtrado)'}
            </div>
          </div>

          {/* Tabela de usuários */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <RefreshCw className="h-8 w-8 animate-spin text-[#2563EB] mx-auto" />
                <p className="text-gray-600">Carregando usuários...</p>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {hasActiveFilters ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
              </h3>
              <p className="text-gray-600">
                {hasActiveFilters 
                  ? 'Tente ajustar os filtros para encontrar usuários.'
                  : 'Quando usuários se cadastrarem, eles aparecerão aqui.'
                }
              </p>
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Último Acesso</TableHead>
                    <TableHead>Comandos Usados</TableHead>
                    <TableHead>Email Confirmado</TableHead>
                    <TableHead>Membro desde</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          {user.company && (
                            <div className="text-xs text-gray-400">{user.company}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user.status)}
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {user.authData?.last_sign_in_at 
                            ? formatDate(user.authData.last_sign_in_at)
                            : user.lastAccess
                          }
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {user.commandsUsed}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {user.authData?.email_confirmed ? (
                            <Badge className="bg-green-100 text-green-800 border-green-200 border">
                              ✓ Confirmado
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 border">
                              ⚠ Pendente
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(user.authData?.created_at || user.joinedAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            onClick={() => handleToggleStatus(user.id, user.status)}
                            size="sm"
                            variant="outline"
                            className={user.status === 'ativo' 
                              ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                              : "border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                            }
                            title={user.status === 'ativo' ? 'Desativar usuário' : 'Ativar usuário'}
                          >
                            {user.status === 'ativo' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </Button>
                          <Button
                            onClick={() => handleSendEmail(user.email)}
                            size="sm"
                            variant="outline"
                            className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white"
                            title="Enviar email"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};