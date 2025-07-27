"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Mail, Phone, Building, Activity, Calendar } from 'lucide-react';
import { UserActions } from './user-actions';

interface UserTableProps {
  users: any[];
  currentUserRole?: string;
  onEditUser: (user: any) => void;
  onQuickEdit: (user: any) => void;
  onPasswordEdit: (user: any) => void;
  onToggleStatus: (id: string, status: string, name: string) => void;
  onSendEmail: (email: string, name: string) => void;
  onDeleteUser: (id: string, name: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  currentUserRole,
  onEditUser,
  onQuickEdit,
  onPasswordEdit,
  onToggleStatus,
  onSendEmail,
  onDeleteUser
}) => {
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

  return (
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
          {users.map((user) => (
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
              <TableCell className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] lasy-highlight">
                <UserActions
                  user={user}
                  currentUserRole={currentUserRole}
                  onEditUser={onEditUser}
                  onQuickEdit={onQuickEdit}
                  onPasswordEdit={onPasswordEdit}
                  onToggleStatus={onToggleStatus}
                  onSendEmail={onSendEmail}
                  onDeleteUser={onDeleteUser}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};