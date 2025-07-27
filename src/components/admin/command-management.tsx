"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Search, Plus, Upload, Eye, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useCommands } from '@/contexts/commands-context';

export const CommandManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const { commands, deleteCommand } = useCommands();

  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    command.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    command.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: string) => {
    console.log('Editando comando:', id);
    try {
      router.push(`/admin/commands/edit/${id}`);
      toast.success('Abrindo editor de comando');
    } catch (error) {
      console.error('Erro ao editar:', error);
      toast.error('Erro ao abrir editor');
    }
  };

  const handleView = (id: string) => {
    console.log('Visualizando comando:', id);
    try {
      router.push(`/command/${id}`);
      toast.success('Abrindo visualização do comando');
    } catch (error) {
      console.error('Erro ao visualizar:', error);
      toast.error('Erro ao abrir visualização');
    }
  };

  const handleDelete = async (event: React.MouseEvent, id: string, title: string) => {
    // Prevenir propagação do evento
    event.preventDefault();
    event.stopPropagation();
    
    console.log('🗑️ Iniciando processo de exclusão:', { id, title });
    
    try {
      // Usar window.confirm para garantir compatibilidade
      const confirmed = window.confirm(
        `Tem certeza que deseja excluir o comando "${title}"?\n\nEsta ação não pode ser desfeita.`
      );
      
      console.log('✅ Confirmação do usuário:', confirmed);
      
      if (!confirmed) {
        console.log('❌ Usuário cancelou a exclusão');
        return;
      }

      console.log('🔄 Chamando deleteCommand...');
      await deleteCommand(id);
      console.log('✅ Comando excluído com sucesso');
      
    } catch (error) {
      console.error('💥 Erro ao deletar comando:', error);
      
      // Mostrar erro específico se disponível
      if (error instanceof Error) {
        toast.error(`Erro ao excluir comando: ${error.message}`);
      } else {
        toast.error('Erro desconhecido ao excluir comando');
      }
    }
  };

  const handleNewCommand = () => {
    console.log('Criando novo comando');
    try {
      router.push('/admin/commands/new');
      toast.success('Abrindo formulário de novo comando');
    } catch (error) {
      console.error('Erro ao criar comando:', error);
      toast.error('Erro ao abrir formulário');
    }
  };

  const handleUploadCSV = () => {
    console.log('Upload CSV');
    toast.info('Funcionalidade de upload em massa será implementada em breve');
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'iniciante':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'intermediário':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'avançado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Marketing': 'bg-blue-100 text-blue-800',
      'Finanças': 'bg-green-100 text-green-800',
      'Gestão': 'bg-purple-100 text-purple-800',
      'Vendas': 'bg-orange-100 text-orange-800',
      'Estratégia': 'bg-indigo-100 text-indigo-800',
      'Atendimento': 'bg-pink-100 text-pink-800',
      'Recursos Humanos': 'bg-teal-100 text-teal-800',
      'Operações': 'bg-cyan-100 text-cyan-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6 relative z-10">
      {/* Header com estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[#0F1115]">{commands.length}</div>
            <div className="text-sm text-gray-600">Total de Comandos</div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[#0F1115]">
              {commands.reduce((sum, cmd) => sum + cmd.views, 0)}
            </div>
            <div className="text-sm text-gray-600">Total de Visualizações</div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[#0F1115]">
              {commands.reduce((sum, cmd) => sum + cmd.copies, 0)}
            </div>
            <div className="text-sm text-gray-600">Total de Cópias</div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[#0F1115]">
              {new Set(commands.map(cmd => cmd.category)).size}
            </div>
            <div className="text-sm text-gray-600">Categorias Ativas</div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <Card className="border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-[#0F1115]">
              Comandos ({filteredCommands.length} de {commands.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={handleUploadCSV}
                variant="outline"
                type="button"
                className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-all duration-200 hover:scale-105 relative z-20"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload CSV
              </Button>
              <Button 
                onClick={handleNewCommand}
                type="button"
                className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0F1115] font-medium transition-all duration-200 hover:scale-105 relative z-20"
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
                placeholder="Buscar por título, categoria ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-gray-200 focus:border-[#2563EB] focus:ring-[#2563EB]"
              />
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-[#0F1115]">Comando</TableHead>
                  <TableHead className="font-semibold text-[#0F1115]">Categoria</TableHead>
                  <TableHead className="font-semibold text-[#0F1115]">Nível</TableHead>
                  <TableHead className="font-semibold text-[#0F1115]">Criado</TableHead>
                  <TableHead className="font-semibold text-[#0F1115]">Métricas</TableHead>
                  <TableHead className="font-semibold text-[#0F1115]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCommands.map((command) => (
                  <TableRow key={command.id} className="hover:bg-gray-50">
                    <TableCell className="max-w-xs">
                      <div>
                        <div className="font-medium text-[#0F1115] truncate" title={command.title}>
                          {command.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate" title={command.description}>
                          {command.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${getCategoryColor(command.category)} border`}>
                        {command.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${getLevelColor(command.level)} border`}>
                        {command.level}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {command.createdAt}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Eye className="h-3 w-3" />
                          {command.views}
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Copy className="h-3 w-3" />
                          {command.copies}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          onClick={() => handleView(command.id)}
                          size="sm"
                          variant="outline"
                          type="button"
                          className="border-gray-300 text-gray-600 hover:bg-gray-50 transition-all duration-200 hover:scale-105 relative z-20"
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleEdit(command.id)}
                          size="sm"
                          variant="outline"
                          type="button"
                          className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-all duration-200 hover:scale-105 relative z-20"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={(e) => handleDelete(e, command.id, command.title)}
                          size="sm"
                          variant="outline"
                          type="button"
                          className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-all duration-200 hover:scale-105 relative z-20"
                          title="Excluir"
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

          {filteredCommands.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Nenhum comando encontrado' : 'Nenhum comando cadastrado'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'Tente buscar com outros termos ou limpe o filtro'
                  : 'Comece criando seu primeiro comando para a plataforma'
                }
              </p>
              {!searchTerm && (
                <Button 
                  onClick={handleNewCommand}
                  type="button"
                  className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0F1115] transition-all duration-200 hover:scale-105 relative z-20"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Comando
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};