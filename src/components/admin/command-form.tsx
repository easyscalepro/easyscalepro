"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useCommands, type Command } from '@/contexts/commands-context';

interface CommandFormProps {
  commandId?: string;
  mode: 'create' | 'edit';
}

export const CommandForm: React.FC<CommandFormProps> = ({ commandId, mode }) => {
  const router = useRouter();
  const { commands, addCommand, updateCommand, getCommandById } = useCommands();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: '' as 'iniciante' | 'intermediário' | 'avançado' | '',
    prompt: '',
    usage: '',
    tags: [] as string[],
    estimatedTime: ''
  });
  
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (mode === 'edit' && commandId) {
      const command = getCommandById(commandId);
      if (command) {
        setFormData({
          title: command.title,
          description: command.description,
          category: command.category,
          level: command.level,
          prompt: command.prompt,
          usage: command.usage,
          tags: command.tags,
          estimatedTime: command.estimatedTime
        });
      }
    }
  }, [mode, commandId, getCommandById]);

  const categories = [
    'Marketing',
    'Finanças',
    'Gestão',
    'Vendas',
    'Atendimento',
    'Recursos Humanos',
    'Estratégia',
    'Operações'
  ];

  const levels = ['iniciante', 'intermediário', 'avançado'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.level || !formData.prompt) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (mode === 'create') {
      addCommand(formData as Omit<Command, 'id' | 'createdAt' | 'views' | 'copies' | 'popularity'>);
    } else if (mode === 'edit' && commandId) {
      updateCommand(commandId, formData);
    }

    router.push('/admin/commands');
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          onClick={() => router.push('/admin/commands')}
          variant="ghost"
          className="text-[#2563EB] hover:text-[#1d4ed8] hover:bg-blue-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold text-[#0F1115]">
          {mode === 'create' ? 'Criar Novo Comando' : 'Editar Comando'}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Comando</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título e Descrição */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: Estratégia de Marketing Digital"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descreva brevemente o que este comando faz..."
                  rows={3}
                  required
                />
              </div>
            </div>

            {/* Categoria e Nível */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Categoria *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...form Data, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Nível *</Label>
                <Select value={formData.level} onValueChange={(value) => setFormData({...formData, level: value as any})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedTime">Tempo Estimado</Label>
                <Input
                  id="estimatedTime"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData({...formData, estimatedTime: e.target.value})}
                  placeholder="Ex: 15 min"
                />
              </div>
            </div>

            {/* Prompt */}
            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt Completo *</Label>
              <Textarea
                id="prompt"
                value={formData.prompt}
                onChange={(e) => setFormData({...formData, prompt: e.target.value})}
                placeholder="Cole aqui o prompt completo do ChatGPT..."
                rows={10}
                className="font-mono text-sm"
                required
              />
            </div>

            {/* Instruções de Uso */}
            <div className="space-y-2">
              <Label htmlFor="usage">Instruções de Uso</Label>
              <Textarea
                id="usage"
                value={formData.usage}
                onChange={(e) => setFormData({...formData, usage: e.target.value})}
                placeholder="Explique como usar este comando..."
                rows={4}
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Adicionar tag..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button type="button" onClick={handleAddTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/commands')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0F1115]"
              >
                <Save className="h-4 w-4 mr-2" />
                {mode === 'create' ? 'Criar Comando' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};