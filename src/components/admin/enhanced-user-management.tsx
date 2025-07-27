"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  UserPlus, 
  Filter,
  Download,
  RefreshCw,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  Database
} from 'lucide-react';
import { toast } from 'sonner';
import { useUsers } from '@/contexts/users-context';
import { useAuth } from '@/components/auth/auth-provider';
import { useUserManagement } from '@/hooks/use-user-management';

// Componentes modulares
import { UserFormModal } from './user-form-modal';
import { UserSyncButton } from './user-sync-button';
import { ManualUserSync } from './manual-user-sync';
import { UserCreationTest } from './user-creation-test';
import { LoginTest } from './login-test';
import { DatabaseCheck } from './database-check';
import { EmailConfirmationTool } from './email-confirmation-tool';
import { ImprovedUserCreator } from './improved-user-creator';

// Componentes modulares criados
import { UserPasswordModal } from './modals/user-password-modal';
import { UserQuickEditModal } from './modals/user-quick-edit-modal';
import { UserStatsCards } from './components/user-stats-cards';
import { UserFilters } from './components/user-filters';
import { UserTable } from './components/user-table';

export const EnhancedUserManagement: React.FC = () => {
  const { users, loading, error, deleteUser, toggleUserStatus, refreshUsers, updateUser } = useUsers();
  const { profile } = useAuth();
  const { 
    connectionStatus, 
    syncStatus, 
    checkConnection, 
    handleSendEmail, 
    handleExportUsers 
  } = useUserManagement();

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [roleFilter, setRoleFilter] = useState('todos');

  // Estados para modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState(undefined);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [quickEditModalOpen, setQuickEditModalOpen] = useState(false);
  const [userForPasswordEdit, setUserForPasswordEdit] = useState(null);
  const [userForQuickEdit, setUserForQuickEdit] = useState(null);

  // Filtrar usuários
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.company && user.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'todos' || user.status === statusFilter;
    const matchesRole = roleFilter === 'todos' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Handlers
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

  const handlePasswordEdit = (user: any) => {
    setUserForPasswordEdit(user);
    setPasswordModalOpen(true);
  };

  const handleQuickEdit = (user: any) => {
    setUserForQuickEdit(user);
    setQuickEditModalOpen(true);
  };

  // Estatísticas
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'ativo').length,
    inactive: users.filter(u => u.status === 'inativo').length,
    suspended: users.filter(u => u.status === 'suspenso').length
  };

  // Se há erro, mostrar interface de erro melhorada
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
                  onClick={refreshUsers}
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

        {/* Componentes de diagnóstico */}
        <ImprovedUserCreator />
        <ManualUserSync />
        <DatabaseCheck />
        <EmailConfirmationTool />
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
                {users.length} usuário(s) carregado(s) com sucesso
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Componentes de gerenciamento */}
      <ImprovedUserCreator />
      <ManualUserSync />
      <DatabaseCheck />
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
      <UserStatsCards stats={stats} />

      {/* Controles */}
      <Card className="border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-[#0F1115] flex items-center gap-2">
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
              {syncStatus?.hasAdminAccess && <UserSyncButton />}
              <Button
                onClick={() => handleExportUsers(filteredUsers)}
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
          <UserFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
          />

          {/* Tabela */}
          <UserTable
            users={filteredUsers}
            currentUserRole={profile?.role}
            onEditUser={handleEditUser}
            onQuickEdit={handleQuickEdit}
            onPasswordEdit={handlePasswordEdit}
            onToggleStatus={handleToggleStatus}
            onSendEmail={handleSendEmail}
            onDeleteUser={handleDeleteUser}
          />

          {filteredUsers.length === 0 && !loading && (
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

      {/* Modais */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        mode={modalMode}
      />

      <UserPasswordModal
        isOpen={passwordModalOpen}
        onClose={() => {
          setPasswordModalOpen(false);
          setUserForPasswordEdit(null);
        }}
        user={userForPasswordEdit}
      />

      <UserQuickEditModal
        isOpen={quickEditModalOpen}
        onClose={() => {
          setQuickEditModalOpen(false);
          setUserForQuickEdit(null);
        }}
        user={userForQuickEdit}
        onUpdate={updateUser}
      />
    </div>
  );
};