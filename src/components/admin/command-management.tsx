"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Search, Plus, Upload } from 'lucide-react';
import { toast } from 'sonner';

export const CommandManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data para demonstração
  const commands = [
    {
      id: '1',
      title: 'Estratégia de Marketing Digital',
      category: 'Marketing',
      level: 'intermediário',
      createdAt: '2024-01-15',
      views: 245,
      copies: 89
    },
    {
      id: '2',
      title: 'Análise Financeira Mensal',
      category: 'Finanças',
      level: 'avançado',
      createdAt: '2024-01-10',
      views: 189,
      copies: 67
    },
    {
      id: '3',
      title: 'Gestão de Equipe Remota',
      category: 'Gestão',
      level: 'iniciante',
      createdAt: '2024-01-08',
      views: 156,
      copies: 45
    }
  ];

  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    command.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: string) => {
    toast.info(`Editando comando ${id}`);
  };

  const handleDelete = (id: string) => {
    toast.success(`Comando ${id} excluído com sucesso`);
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
            Gerenciar Comandos
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
            <Button className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0F1115]">
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
                <TableCell className="font-medium">{command.title}</TableCell>
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
                      onClick={() => handleDelete(command.id)}
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
      </CardContent>
    </Card>
  );
};