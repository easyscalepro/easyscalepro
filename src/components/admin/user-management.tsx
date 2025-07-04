"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, UserCheck, UserX, Mail } from 'lucide-react';
import { toast } from 'sonner';

export const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data para demonstração
  const users = [
    {
      id: '1',
      email: 'joao@empresa.com',
      name: 'João Silva',
      status: 'ativo',
      lastAccess: '30 min atrás',
      commandsUsed: 45,
      joinedAt: '2024-01-10'
    },
    {
      id: '2',
      email: 'maria@startup.com',
      name: 'Maria Santos',
      status: 'ativo',
      lastAccess: '2 horas atrás',
      commandsUsed: 78,
      joinedAt: '2024-01-08'
    },
    {
      id: '3',
      email: 'pedro@pme.com',
      name: 'Pedro Costa',
      status: 'inativo',
      lastAccess: '1 semana atrás',
      commandsUsed: 23,
      joinedAt: '2024-01-05'
    }
  ];

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ativo' ? 'inativo' : 'ativo';
    toast.success(`Usuário ${newStatus === 'ativo' ? 'ativado' : 'desativado'} com sucesso`);
  };

  const handleSendEmail = (userEmail: string) => {
    toast.info(`Email enviado para ${userEmail}`);
  };

  const getStatusBadge = (status: string) => {
    return status === 'ativo' 
      ? <Badge className="bg-green-100 text-green-800">Ativo</Badge>
      : <Badge className="bg-red-100 text-red-800">Inativo</Badge>;
  };

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[#0F1115]">
          Gerenciar Usuários
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-gray-200 focus:border-[#2563EB] focus:ring-[#2563EB]"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Último Acesso</TableHead>
              <TableHead>Comandos Usados</TableHead>
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
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(user.status)}
                </TableCell>
                <TableCell>{user.lastAccess}</TableCell>
                <TableCell>{user.commandsUsed}</TableCell>
                <TableCell>{user.joinedAt}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleToggleStatus(user.id, user.status)}
                      size="sm"
                      variant="outline"
                      className={user.status === 'ativo' 
                        ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        : "border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                      }
                    >
                      {user.status === 'ativo' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                    </Button>
                    <Button
                      onClick={() => handleSendEmail(user.email)}
                      size="sm"
                      variant="outline"
                      className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};