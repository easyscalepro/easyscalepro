"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Edit, 
  Settings, 
  Key, 
  Lock, 
  Unlock, 
  Mail, 
  Trash2 
} from 'lucide-react';

interface UserActionsProps {
  user: any;
  currentUserRole?: string;
  onEditUser: (user: any) => void;
  onQuickEdit: (user: any) => void;
  onPasswordEdit: (user: any) => void;
  onToggleStatus: (id: string, status: string, name: string) => void;
  onSendEmail: (email: string, name: string) => void;
  onDeleteUser: (id: string, name: string) => void;
}

export const UserActions: React.FC<UserActionsProps> = ({
  user,
  currentUserRole,
  onEditUser,
  onQuickEdit,
  onPasswordEdit,
  onToggleStatus,
  onSendEmail,
  onDeleteUser
}) => {
  return (
    <div className="flex gap-1 flex-wrap">
      {/* Edição completa de dados */}
      <Button
        onClick={() => onEditUser(user)}
        size="sm"
        variant="outline"
        className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white"
        title="Editar dados completos"
      >
        <Edit className="h-4 w-4" />
      </Button>

      {/* Edição rápida de status e função */}
      <Button
        onClick={() => onQuickEdit(user)}
        size="sm"
        variant="outline"
        className="border-purple-500 text-purple-600 hover:bg-purple-50"
        title="Edição rápida (Status/Função)"
      >
        <Settings className="h-4 w-4" />
      </Button>

      {/* Edição de senha */}
      {currentUserRole === 'admin' && (
        <Button
          onClick={() => onPasswordEdit(user)}
          size="sm"
          variant="outline"
          className="border-orange-500 text-orange-600 hover:bg-orange-50"
          title="Alterar senha"
        >
          <Key className="h-4 w-4" />
        </Button>
      )}

      {/* Toggle de status */}
      <Button
        onClick={() => onToggleStatus(user.id, user.status, user.name)}
        size="sm"
        variant="outline"
        className={user.status === 'ativo' 
          ? "border-orange-500 text-orange-600 hover:bg-orange-50"
          : "border-green-500 text-green-600 hover:bg-green-50"
        }
        title={user.status === 'ativo' ? 'Desativar usuário' : 'Ativar usuário'}
      >
        {user.status === 'ativo' ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
      </Button>

      {/* Enviar email */}
      <Button
        onClick={() => onSendEmail(user.email, user.name)}
        size="sm"
        variant="outline"
        className="border-blue-300 text-blue-600 hover:bg-blue-50"
        title="Enviar email"
      >
        <Mail className="h-4 w-4" />
      </Button>

      {/* Deletar usuário (apenas admin) */}
      {currentUserRole === 'admin' && (
        <Button
          onClick={() => onDeleteUser(user.id, user.name)}
          size="sm"
          variant="outline"
          className="border-red-300 text-red-600 hover:bg-red-50"
          title="Excluir usuário"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};