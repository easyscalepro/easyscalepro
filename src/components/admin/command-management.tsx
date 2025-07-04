"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Search, Plus, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useCommands } from '@/contexts/commands-context';

export const CommandManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const { commands, deleteCommand } = useCommands();

  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    command.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: string) => {
    router.push(`/admin/commands/edit/${id}`);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Tem certeza que deseja excluir o comando "${title}"?`)) {
      deleteCommand(id);
    }
  };

  const handleUploadCSV = () => {
    toast.info('Funcionalidade de upload em massa em desenvolvimento');
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'iniciante':
        return 'bg-green-100 text-green-800';
      case 'intermediário':
        return 'bg-yellow-100 text-yellow-800';
      case 'avançado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-[#0F1115]">
            Gerenciar Comandos ({commands.length} total)
          </CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={handleUploadCSV}
              variant="outline"
              className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload CSV
            </Button>
            <Button 
              onClick={() => router.push('/admin/commands/new')}
              className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0F1115]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Comando
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar comandos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-gray-200 focus:border-[#2563EB] focus:ring-[#2563EB]"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Nível</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead>Visualizações</TableHead>
              <TableHead>Cópias</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCommands.map((command) => (
              <TableRow key={command.id}>
                <TableCell className="font-medium max-w-xs">
                  <div className="truncate" title={command.title}>
                    {command.title}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-[#2563EB] text-white">
                    {command.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getLevelColor(command.level)}>
                    {command.level}
                  </Badge>
                </TableCell>
                <TableCell>{command.createdAt}</TableCell>
                <TableCell>{command.views}</TableCell>
                <TableCell>{command.copies}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(command.id)}
                      size="sm"
                      variant="outline"
                      className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(command.id, command.title)}
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredCommands.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm ? 'Nenhum comando encontrado com esse termo.' : 'Nenhum comando cadastrado ainda.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};