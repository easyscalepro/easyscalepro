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
  Shield,
  RefreshCw,
  Wifi,
  WifiOff,
  Key,
  Settings,
  MoreVertical,
  Lock,
  Unlock,
  Zap,
  Star,
  UserCog
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
import { ImprovedUserCreator } from './improved-user-creator';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/auth-provider';

// Modal para edição de senha (implementado inline)
const PasswordEditModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  user: any;
}> = ({ isOpen, onClose, user }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      setLoading(true);
      
      const { error } = await supabase.auth.admin.updateUserById(user.id, {
        password: newPassword
      });

      if (error) {
        throw error;
      }

      toast.success('Senha atualizada com sucesso');
      onClose();
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Erro ao atualizar senha:', error);
      toast.error('Erro ao atualizar senha: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center gap-2 mb-4">
          <Key className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Alterar Senha</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Usuário</label>
            <div className="text-sm text-gray-600">{user?.name} ({user?.email})</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Nova Senha</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Digite a nova senha"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Confirmar Senha</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme a nova senha"
            />
          </div>
        </div>
        
        <div className="flex gap-2 mt-6">
          <Button
            onClick={handlePasswordUpdate}
            disabled={loading || !newPassword || !confirmPassword}
            className="flex-1"
          >
            {loading ? 'Atualizando...' : 'Atualizar Senha'}
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};

// Modal para edição rápida (implementado inline)
const QuickEditModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onUpdate: (id: string, data: any) => void;
}> = ({ isOpen, onClose, user, onUpdate }) => {
  const [status, setStatus] = useState(user?.status || 'ativo');
  const [role, setRole] = useState(user?.role || 'user');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setStatus(user.status);
      setRole(user.role);
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await onUpdate(user.id, { status, role });
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Edição Rápida</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Usuário</label>
            <div className="text-sm text-gray-600">{user?.name} ({user?.email})</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
                <SelectItem value="suspenso">Suspenso</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Função</label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Usuário</SelectItem>
                <SelectItem value="moderator">Moderador</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex gap-2 mt-6">
          <Button
            onClick={handleUpdate}
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};

// Modal para seleção de usuário para edição
const UserSelectionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  users: any[];
  onSelectUser: (user: any) => void;
  title: string;
  description: string;
}> = ({ isOpen, onClose, users, onSelectUser, title, description }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <UserCog className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar usuário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
          {filteredUsers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Nenhum usuário encontrado
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => {
                  onSelectUser(user);
                  onClose();
                }}
                className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{user.name || 'Nome não informado'}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
                <div className="text-xs">
                  <Badge className={`${
                    user.status === 'ativo' ? 'bg-green-100 text-green-800' :
                    user.status === 'inativo' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  } border`}>
                    {user.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="flex justify-end mt-4">
          <Button onClick={onClose} variant="outline">
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};

export const EnhancedUserManagement: React.FC = () => {
  const { users, loading, error, deleteUser, toggleUserStatus, refreshUsers, updateUser } = useUsers();
  const { profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [roleFilter, setRoleFilter] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState(undefined);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [syncStatus, setSyncStatus] = useState<{
    authUsers: number;
    profiles: number;
    needsSync: boolean;
    hasAdminAccess: boolean;
  } | null>(null);

  // Estados para modais de edição avançada
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [quickEditModalOpen, setQuickEditModalOpen] = useState(false);
  const [userForPasswordEdit, setUserForPasswordEdit] = useState(null);
  const [userForQuickEdit, setUserForQuickEdit] = useState(null);

  // Estados para modais de seleção de usuário
  const [userSelectionModalOpen, setUserSelectionModalOpen] = useState(false);
  const [selectionMode, setSelectionMode] = useState<'edit' | 'password'>('edit');

  // Verificar conexão e status de sincronização ao carregar
  useEffect(() => {
    checkConnection();
    checkSyncStatus();
  }, []);

  const checkConnection = async () => {
    try {
      setConnectionStatus('checking');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      if (error) {
        console.warn('Problema de conexão:', error);
        setConnectionStatus('disconnected');
      } else {
        setConnectionStatus('connected');
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      setConnectionStatus('disconnected');
    }
  };

  const checkSyncStatus = async () => {
    try {
      let authCount = 0;
      let hasAdminAccess = false;

      try {
        const { data: authResponse, error: authError } = await supabase.auth.admin.listUsers();
        
        if (!authError && authResponse) {
          authCount = authResponse.users?.length || 0;
          hasAdminAccess = true;
        }
      } catch (error) {
        console.warn('Sem acesso à Admin API:', error);
      }

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
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    console.log('Editando usuário:', user);
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

  // Novas funções para edição avançada
  const handlePasswordEdit = (user: any) => {
    console.log('Editando senha do usuário:', user);
    setUserForPasswordEdit(user);
    setPasswordModalOpen(true);
  };

  const handleQuickEdit = (user: any) => {
    console.log('Edição rápida do usuário:', user);
    setUserForQuickEdit(user);
    setQuickEditModalOpen(true);
  };

  // Novas funções para seleção de usuário
  const handleOpenUserSelection = (mode: 'edit' | 'password') => {
    setSelectionMode(mode);
    setUserSelectionModalOpen(true);
  };

  const handleUserSelection = (user: any) => {
    if (selectionMode === 'edit') {
      handleEditUser(user);
    } else if (selectionMode === 'password') {
      handlePasswordEdit(user);
    }
  };

  const handleExportUsers = () => {
    const csvContent = [
      ['Nome', 'Email', 'Status', 'Função', 'Empresa', 'Telefone', 'Comandos Usados', 'Último Acesso', 'Membro desde'],
      ...filteredUsers.map(user => [
        user.name || '',
        user.email || '',
        user.status || '',
        user.role || '',
        user.company || '',
        user.phone || '',
        (user.commandsUsed || 0).toString(),
        user.lastAccess || '',
        user.joinedAt || ''
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

  // Funções de demonstração para os botões de ação
  const handleDemoEdit = () => {
    toast.info('🔵 Demonstração: Botão de Edição Completa');
  };

  const handleDemoQuickEdit = () => {
    toast.info('🟣 Demonstração: Botão de Edição Rápida');
  };

  const handleDemoPassword = () => {
    toast.info('🟠 Demonstração: Botão de Alterar Senha');
  };

  const handleDemoToggle = () => {
    toast.info('🔄 Demonstração: Botão de Toggle Status');
  };

  const handleDemoEmail = () => {
    toast.info('📧 Demonstração: Botão de Enviar Email');
  };

  const handleDemoDelete = () => {
    toast.info('🔴 Demonstração: Botão de Deletar');
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

  // Debug: Log dos usuários
  console.log('🔍 DEBUG - Usuários carregados:', users.length);
  console.log('🔍 DEBUG - Usuários filtrados:', filteredUsers.length);
  console.log('🔍 DEBUG - Primeiro usuário:', filteredUsers[0]);

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

      {/* Criador melhorado de usuários */}
      <ImprovedUserCreator />

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

      {/* Status de sincronização */}
      {syncStatus && syncStatus.hasAdminAccess && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-blue-600" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900  dark:text-blue-100 text-sm">
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
        <CardContent className="p-6 pt-0 lasy-highlight">
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

          {/* Botões de Edição Rápida */}
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <UserCog className="h-5 w-5 text-green-600" />
              <h4 className="font-semibold text-green-900">Edição Rápida de Usuários</h4>
            </div>
            <p className="text-sm text-green-700 mb-4">
              Selecione um usuário da lista para editar seus dados ou alterar sua senha:
            </p>
            
            <div className="flex gap-3">
              {/* Botão para Editar Usuário */}
              <Button
                onClick={() => handleOpenUserSelection('edit')}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                disabled={users.length === 0}
              >
                <Edit className="h-4 w-4" />
                Editar Usuário
              </Button>

              {/* Botão para Alterar Senha */}
              <Button
                onClick={() => handleOpenUserSelection('password')}
                className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
                disabled={users.length === 0}
              >
                <Key className="h-4 w-4" />
                Alterar Senha
              </Button>
            </div>

            {users.length === 0 && (
              <div className="mt-3 text-xs text-green-600">
                ⚠️ Nenhum usuário disponível para edição
              </div>
            )}
          </div>

          {/* Seção de Demonstração dos Botões de Ação Avançada */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Botões de Ação Avançada</h4>
              <Star className="h-4 w-4 text-yellow-500" />
            </div>
            <p className="text-sm text-blue-700 mb-4">
              Demonstração dos novos botões implementados na tabela de usuários:
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {/* Botão 1: Edição Completa */}
              <button
                onClick={handleDemoEdit}
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1 text-sm"
                title="Edição completa de dados"
              >
                <Edit className="h-4 w-4" />
                Editar
              </button>

              {/* Botão 2: Edição Rápida */}
              <button
                onClick={handleDemoQuickEdit}
                className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center gap-1 text-sm"
                title="Edição rápida (Status/Função)"
              >
                <Settings className="h-4 w-4" />
                Rápido
              </button>

              {/* Botão 3: Alterar Senha */}
              <button
                onClick={handleDemoPassword}
                className="px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 flex items-center gap-1 text-sm"
                title="Alterar senha"
              >
                <Key className="h-4 w-4" />
                Senha
              </button>

              {/* Botão 4: Toggle Status */}
              <button
                onClick={handleDemoToggle}
                className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-1 text-sm"
                title="Ativar/Desativar usuário"
              >
                <Lock className="h-4 w-4" />
                Status
              </button>

              {/* Botão 5: Email */}
              <button
                onClick={handleDemoEmail}
                className="px-3 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 flex items-center gap-1 text-sm"
                title="Enviar email"
              >
                <Mail className="h-4 w-4" />
                Email
              </button>

              {/* Botão 6: Deletar */}
              <button
                onClick={handleDemoDelete}
                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-1 text-sm"
                title="Excluir usuário"
              >
                <Trash2 className="h-4 w-4" />
                Deletar
              </button>
            </div>

            <div className="mt-3 text-xs text-blue-600">
              💡 Estes botões aparecem na coluna "Ações" da tabela de usuários abaixo
            </div>
          </div>

          {/* DEBUG: Mostrar informações dos usuários */}
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>DEBUG:</strong> {users.length} usuários carregados, {filteredUsers.length} filtrados
            </p>
          </div>

          {/* VERSÃO SIMPLIFICADA DA TABELA */}
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-left">Usuário</th>
                  <th className="border border-gray-300 p-3 text-left">Status</th>
                  <th className="border border-gray-300 p-3 text-left">Função</th>
                  <th className="border border-gray-300 p-3 text-left">Empresa</th>
                  <th className="border border-gray-300 p-3 text-left">Atividade</th>
                  <th className="border border-gray-300 p-3 text-left min-w-[400px]">AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => {
                  console.log(`🔍 Renderizando usuário ${index + 1}:`, user);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div className="font-medium text-[#0F1115]">{user.name || 'Nome não informado'}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email || 'Email não informado'}
                            </div>
                            {user.phone && (
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {user.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-3">
                        {getStatusBadge(user.status || 'ativo')}
                      </td>
                      <td className="border border-gray-300 p-3">
                        {getRoleBadge(user.role || 'user')}
                      </td>
                      <td className="border border-gray-300 p-3">
                        <div className="flex items-center gap-1 text-sm">
                          <Building className="h-3 w-3 text-gray-400" />
                          {user.company || 'Não informado'}
                        </div>
                      </td>
                      <td className="border border-gray-300 p-3">
                        <div className="text-sm space-y-1">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Activity className="h-3 w-3" />
                            {user.commandsUsed || 0} comandos
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {user.lastAccess || 'Nunca'}
                          </div>
                          <div className="text-xs text-gray-400">
                            Desde {user.joinedAt || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-3">
                        <div className="flex gap-2 flex-wrap">
                          {/* BOTÃO 1: Edição completa - AZUL */}
                          <button
                            onClick={() => {
                              console.log('🔵 Clicou em EDITAR:', user);
                              handleEditUser(user);
                            }}
                            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
                            title="Editar dados completos"
                          >
                            <Edit className="h-4 w-4" />
                            Editar
                          </button>

                          {/* BOTÃO 2: Edição rápida - ROXO */}
                          <button
                            onClick={() => {
                              console.log('🟣 Clicou em EDIÇÃO RÁPIDA:', user);
                              handleQuickEdit(user);
                            }}
                            className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center gap-1"
                            title="Edição rápida (Status/Função)"
                          >
                            <Settings className="h-4 w-4" />
                            Rápido
                          </button>

                          {/* BOTÃO 3: Alterar senha - LARANJA */}
                          <button
                            onClick={() => {
                              console.log('🟠 Clicou em SENHA:', user);
                              handlePasswordEdit(user);
                            }}
                            className="px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 flex items-center gap-1"
                            title="Alterar senha"
                          >
                            <Key className="h-4 w-4" />
                            Senha
                          </button>

                          {/* BOTÃO 4: Toggle status - VERDE/LARANJA */}
                          <button
                            onClick={() => {
                              console.log('🔄 Clicou em TOGGLE STATUS:', user);
                              handleToggleStatus(user.id, user.status || 'ativo', user.name || 'Usuário');
                            }}
                            className={`px-3 py-2 text-white rounded flex items-center gap-1 ${
                              (user.status || 'ativo') === 'ativo' 
                                ? "bg-orange-500 hover:bg-orange-600"
                                : "bg-green-500 hover:bg-green-600"
                            }`}
                            title={(user.status || 'ativo') === 'ativo' ? 'Desativar usuário' : 'Ativar usuário'}
                          >
                            {(user.status || 'ativo') === 'ativo' ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                            {(user.status || 'ativo') === 'ativo' ? 'Desativar' : 'Ativar'}
                          </button>

                          {/* BOTÃO 5: Email - AZUL CLARO */}
                          <button
                            onClick={() => {
                              console.log('📧 Clicou em EMAIL:', user);
                              handleSendEmail(user.email || '', user.name || 'Usuário');
                            }}
                            className="px-3 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 flex items-center gap-1"
                            title="Enviar email"
                          >
                            <Mail className="h-4 w-4" />
                            Email
                          </button>

                          {/* BOTÃO 6: Deletar - VERMELHO */}
                          <button
                            onClick={() => {
                              console.log('🔴 Clicou em DELETAR:', user);
                              handleDeleteUser(user.id, user.name || 'Usuário');
                            }}
                            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-1"
                            title="Excluir usuário"
                          >
                            <Trash2 className="h-4 w-4" />
                            Deletar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

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

      {/* Modal de formulário completo */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        mode={modalMode}
      />

      {/* Modal de edição de senha */}
      <PasswordEditModal
        isOpen={passwordModalOpen}
        onClose={() => {
          setPasswordModalOpen(false);
          setUserForPasswordEdit(null);
        }}
        user={userForPasswordEdit}
      />

      {/* Modal de edição rápida */}
      <QuickEditModal
        isOpen={quickEditModalOpen}
        onClose={() => {
          setQuickEditModalOpen(false);
          setUserForQuickEdit(null);
        }}
        user={userForQuickEdit}
        onUpdate={updateUser}
      />

      {/* Modal de seleção de usuário */}
      <UserSelectionModal
        isOpen={userSelectionModalOpen}
        onClose={() => setUserSelectionModalOpen(false)}
        users={users}
        onSelectUser={handleUserSelection}
        title={selectionMode === 'edit' ? 'Selecionar Usuário para Editar' : 'Selecionar Usuário para Alterar Senha'}
        description={selectionMode === 'edit' 
          ? 'Escolha um usuário da lista para editar seus dados completos:'
          : 'Escolha um usuário da lista para alterar sua senha:'
        }
      />
    </div>
  );
};