"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Save, ArrowLeft, Upload, FileText } from 'lucide-react';
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
    estimatedTime: '10 min'
  });
  
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          usage: command.usage || '',
          tags: command.tags || [],
          estimatedTime: command.estimatedTime || '10 min'
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
    'Operações',
    'Tecnologia',
    'Jurídico',
    'Produção',
    'Logística',
    'Qualidade',
    'Inovação',
    'Sustentabilidade'
  ];

  const levels = ['iniciante', 'intermediário', 'avançado'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validações
    if (!formData.title.trim()) {
      toast.error('O título é obrigatório');
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('A descrição é obrigatória');
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.category) {
      toast.error('Selecione uma categoria');
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.level) {
      toast.error('Selecione um nível');
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.prompt.trim()) {
      toast.error('O prompt é obrigatório');
      setIsSubmitting(false);
      return;
    }

    try {
      const commandData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        level: formData.level,
        prompt: formData.prompt.trim(),
        usage: formData.usage.trim() || 'Use este comando substituindo as variáveis entre colchetes pelos dados específicos da sua empresa.',
        tags: formData.tags.length > 0 ? formData.tags : [formData.category.toLowerCase()],
        estimatedTime: formData.estimatedTime || '10 min'
      };

      if (mode === 'create') {
        console.log('🔄 Criando comando:', commandData);
        await addCommand(commandData);
        toast.success('Comando criado com sucesso!');
      } else if (mode === 'edit' && commandId) {
        console.log('🔄 Atualizando comando:', commandId, commandData);
        await updateCommand(commandId, commandData);
        toast.success('Comando atualizado com sucesso!');
      }

      // Aguardar um pouco para mostrar o toast
      setTimeout(() => {
        router.push('/admin/commands');
      }, 1000);
      
    } catch (error) {
      console.error('❌ Erro ao salvar comando:', error);
      toast.error('Erro ao salvar comando. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTag = () => {
    const tag = newTag.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag]
      });
      setNewTag('');
      toast.success('Tag adicionada!');
    } else if (formData.tags.includes(tag)) {
      toast.error('Esta tag já foi adicionada');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
    toast.success('Tag removida!');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const loadSamplePrompt = () => {
    const samplePrompt = `Atue como um especialista em [ÁREA DE EXPERTISE] com mais de 10 anos de experiência.

Sua tarefa é [DESCREVER A TAREFA PRINCIPAL].

Contexto:
- Empresa: [NOME DA EMPRESA]
- Setor: [SETOR DE ATUAÇÃO]
- Objetivo: [OBJETIVO ESPECÍFICO]

Instruções:
1. [PRIMEIRA INSTRUÇÃO]
2. [SEGUNDA INSTRUÇÃO]
3. [TERCEIRA INSTRUÇÃO]

Formato de resposta:
- Use linguagem profissional e clara
- Organize em tópicos quando necessário
- Inclua exemplos práticos
- Forneça próximos passos acionáveis

Resultado esperado:
[DESCREVER O QUE SE ESPERA COMO RESULTADO]`;

    setFormData({
      ...formData,
      prompt: samplePrompt
    });
    toast.success('Template de prompt carregado!');
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
          Voltar para Comandos
        </Button>
        <h1 className="text-3xl font-bold text-[#0F1115]">
          {mode === 'create' ? 'Criar Novo Comando' : 'Editar Comando'}
        </h1>
      </div>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#2563EB]" />
            Informações do Comando
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título e Descrição */}
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-[#0F1115]">
                  Título do Comando *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: Estratégia de Marketing Digital Completa"
                  className="h-12 border-gray-200 focus:border-[#2563EB] focus:ring-[#2563EB]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-[#0F1115]">
                  Descrição *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descreva brevemente o que este comando faz e como ele pode ajudar..."
                  rows={3}
                  className="border-gray-200 focus:border-[#2563EB] focus:ring-[#2563EB]"
                  required
                />
              </div>
            </div>

            {/* Categoria, Nível e Tempo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#0F1115]">Categoria *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger className="h-12 border-gray-200 focus:border-[#2563EB] focus:ring-[#2563EB]">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#0F1115]">Nível de Dificuldade *</Label>
                <Select 
                  value={formData.level} 
                  onValueChange={(value) => setFormData({...formData, level: value as any})}
                >
                  <SelectTrigger className="h-12 border-gray-200 focus:border-[#2563EB] focus:ring-[#2563EB]">
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedTime" className="text-sm font-medium text-[#0F1115]">
                  Tempo Estimado
                </Label>
                <Input
                  id="estimatedTime"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData({...formData, estimatedTime: e.target.value})}
                  placeholder="Ex: 15 min"
                  className="h-12 border-gray-200 focus:border-[#2563EB] focus:ring-[#2563EB]"
                />
              </div>
            </div>

            {/* Prompt */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="prompt" className="text-sm font-medium text-[#0F1115]">
                  Prompt Completo *
                </Label>
                <Button
                  type="button"
                  onClick={loadSamplePrompt}
                  variant="outline"
                  size="sm"
                  className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Carregar Template
                </Button>
              </div>
              <Textarea
                id="prompt"
                value={formData.prompt}
                onChange={(e) => setFormData({...formData, prompt: e.target.value})}
                placeholder="Cole aqui o prompt completo do ChatGPT..."
                rows={12}
                className="font-mono text-sm border-gray-200 focus:border-[#2563EB] focus:ring-[#2563EB]"
                required
              />
              <p className="text-xs text-gray-500">
                Use [VARIÁVEIS] em maiúsculas para indicar onde o usuário deve substituir por informações específicas.
              </p>
            </div>

            {/* Instruções de Uso */}
            <div className="space-y-2">
              <Label htmlFor="usage" className="text-sm font-medium text-[#0F1115]">
                Instruções de Uso
              </Label>
              <Textarea
                id="usage"
                value={formData.usage}
                onChange={(e) => setFormData({...formData, usage: e.target.value})}
                placeholder="Explique como usar este comando, que variáveis substituir, dicas importantes..."
                rows={4}
                className="border-gray-200 focus:border-[#2563EB] focus:ring-[#2563EB]"
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#0F1115]">Tags</Label>
              <div className="flex gap-2 mb-3">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Adicionar tag..."
                  onKeyPress={handleKeyPress}
                  className="flex-1 h-10 border-gray-200 focus:border-[#2563EB] focus:ring-[#2563EB]"
                />
                <Button 
                  type="button" 
                  onClick={handleAddTag} 
                  size="sm"
                  className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="flex items-center gap-1 bg-[#2563EB] text-white"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-red-300 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              {formData.tags.length === 0 && (
                <p className="text-xs text-gray-500">
                  Adicione tags para facilitar a busca. Ex: marketing, vendas, estratégia
                </p>
              )}
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/commands')}
                disabled={isSubmitting}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0F1115] font-medium min-w-[140px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#0F1115] border-t-transparent rounded-full animate-spin"></div>
                    Salvando...
                  </div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {mode === 'create' ? 'Criar Comando' : 'Salvar Alterações'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};