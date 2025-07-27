"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Copy, ArrowLeft, Share2, Heart, Sparkles, Clock, TrendingUp, Eye, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useCommands, type Command } from '@/contexts/commands-context';

interface CommandDetailProps {
  command: Command;
  relatedCommands: Array<{
    id: string;
    title: string;
    category: string;
    level: string;
  }>;
}

export const CommandDetail: React.FC<CommandDetailProps> = ({ command, relatedCommands }) => {
  const router = useRouter();
  const { favorites, toggleFavorite, incrementCopies } = useCommands();
  const isFavorite = favorites.includes(command.id);

  const fallbackCopyTextToClipboard = (text: string): boolean => {
    try {
      console.log('📋 Usando método fallback (execCommand)');
      
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // Posicionar fora da tela mas ainda acessível
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      textArea.style.pointerEvents = 'none';
      textArea.style.width = '1px';
      textArea.style.height = '1px';
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      // Para iOS Safari
      textArea.setSelectionRange(0, 99999);
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        console.log('✅ Texto copiado usando execCommand');
        return true;
      } else {
        console.error('❌ execCommand retornou false');
        return false;
      }
    } catch (err) {
      console.error('❌ Erro no fallback execCommand:', err);
      return false;
    }
  };

  const copyToClipboard = async (text: string): Promise<boolean> => {
    // Verificar se o texto existe
    if (!text || text.trim() === '') {
      console.error('❌ Texto vazio para copiar');
      return false;
    }

    // Tentar método moderno apenas se disponível e não bloqueado
    if (navigator.clipboard && window.isSecureContext) {
      try {
        console.log('📋 Tentando navigator.clipboard');
        await navigator.clipboard.writeText(text);
        console.log('✅ Texto copiado usando navigator.clipboard');
        return true;
      } catch (err: any) {
        console.log('❌ navigator.clipboard falhou:', err.message);
        
        // Se for erro de política de permissões, usar fallback
        if (err.message.includes('permissions policy') || 
            err.message.includes('blocked') ||
            err.name === 'NotAllowedError') {
          console.log('🔄 Clipboard API bloqueada, usando fallback');
          return fallbackCopyTextToClipboard(text);
        }
        
        // Para outros erros, também tentar fallback
        console.log('🔄 Erro no clipboard, tentando fallback');
        return fallbackCopyTextToClipboard(text);
      }
    }
    
    // Se navigator.clipboard não estiver disponível, usar fallback diretamente
    console.log('📋 navigator.clipboard não disponível, usando fallback');
    return fallbackCopyTextToClipboard(text);
  };

  const handleCopyPrompt = async () => {
    try {
      console.log('📋 Iniciando cópia do prompt para comando:', command.id);
      console.log('📋 Tamanho do prompt:', command.prompt?.length || 0);
      
      if (!command.prompt || command.prompt.trim() === '') {
        toast.error('Prompt vazio ou inválido');
        return;
      }

      const success = await copyToClipboard(command.prompt);
      
      if (success) {
        // Incrementar contador de cópias
        await incrementCopies(command.id);
        
        toast.success('Prompt copiado!', {
          description: 'O comando foi copiado para sua área de transferência'
        });
        console.log('✅ Prompt copiado com sucesso');
      } else {
        // Se todos os métodos falharam, mostrar mensagem informativa
        console.log('❌ Todos os métodos de cópia falharam');
        toast.error('Não foi possível copiar automaticamente', {
          description: 'Selecione e copie o texto manualmente (Ctrl+C)',
          duration: 5000
        });
      }
    } catch (error) {
      console.error('💥 Erro inesperado ao copiar prompt:', error);
      toast.error('Erro ao copiar prompt', {
        description: 'Selecione e copie o texto manualmente'
      });
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: command.title,
        text: command.description,
        url: window.location.href,
      });
    } catch (error) {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copiado para compartilhamento');
    }
  };

  const handleFavorite = () => {
    toggleFavorite(command.id);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'iniciante':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'intermediário':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'avançado':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Marketing': 'from-blue-500 to-blue-600',
      'Finanças': 'from-green-500 to-emerald-600',
      'Gestão': 'from-purple-500 to-violet-600',
      'Vendas': 'from-orange-500 to-red-500',
      'Estratégia': 'from-indigo-500 to-purple-600',
      'Atendimento': 'from-pink-500 to-rose-600',
      'Recursos Humanos': 'from-teal-500 to-cyan-600',
      'Operações': 'from-cyan-500 to-blue-500'
    };
    return colors[command.category as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/3 w-48 h-48 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]"></div>
        
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      </div>

      <div className="container mx-auto px-6 py-8 relative">
        {/* Enhanced back button */}
        <div className="mb-8">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="group bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 rounded-xl px-6 py-3"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-semibold">Voltar</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header card */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white/80 via-white/60 to-gray-50/30 dark:from-gray-800/80 dark:via-gray-800/60 dark:to-gray-900/30 backdrop-blur-md hover:shadow-2xl transition-all duration-500 group overflow-hidden">
              {/* Card decorative elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${getCategoryColor(command.category)} opacity-5 dark:opacity-10 rounded-full blur-2xl`}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-gray-300/5 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>

              <CardHeader className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-2xl bg-gradient-to-r ${getCategoryColor(command.category)} shadow-lg`}>
                        <Sparkles className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-3xl font-black text-gray-900 dark:text-gray-100 leading-tight tracking-tight">
                          {command.title}
                        </CardTitle>
                        <p className="text-gray-600 dark:text-gray-300 text-lg font-medium mt-2">
                          {command.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={handleShare}
                      size="sm"
                      variant="outline"
                      className="border-2 border-gray-200/80 dark:border-gray-700/80 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:scale-105"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={handleFavorite}
                      size="sm"
                      variant="outline"
                      className={`border-2 transition-all duration-300 hover:scale-105 ${
                        isFavorite 
                          ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-300 dark:border-red-700' 
                          : 'border-gray-200/80 dark:border-gray-700/80 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/80'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </div>

                {/* Enhanced badges and stats */}
                <div className="flex flex-wrap items-center gap-4 mt-6">
                  <Badge variant="outline" className={`text-sm font-bold border-2 text-white bg-gradient-to-r ${getCategoryColor(command.category)} shadow-sm`}>
                    {command.category}
                  </Badge>
                  <Badge variant="outline" className={`text-sm font-bold border-2 ${getLevelColor(command.level)}`}>
                    {command.level}
                  </Badge>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span className="font-medium">{command.views} visualizações</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Copy className="h-4 w-4" />
                      <span className="font-medium">{command.copies} cópias</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{command.estimatedTime}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Prompt card */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white/80 via-white/60 to-gray-50/30 dark:from-gray-800/80 dark:via-gray-800/60 dark:to-gray-900/30 backdrop-blur-md hover:shadow-2xl transition-all duration-500 group overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                      <Copy className="h-5 w-5 text-white" />
                    </div>
                    Prompt Completo
                  </CardTitle>
                  <Button
                    onClick={handleCopyPrompt}
                    className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group/btn"
                  >
                    <Copy className="h-4 w-4 mr-2 group-hover/btn:rotate-12 transition-transform duration-300" />
                    Copiar Prompt
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 shadow-inner">
                  <pre className="whitespace-pre-wrap text-sm text-gray-900 dark:text-gray-100 font-mono leading-relaxed">
                    {command.prompt}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Usage instructions */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white/80 via-white/60 to-gray-50/30 dark:from-gray-800/80 dark:via-gray-800/60 dark:to-gray-900/30 backdrop-blur-md hover:shadow-2xl transition-all duration-500">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  Como Usar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                    {command.usage}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tags card */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white/80 via-white/60 to-gray-50/30 dark:from-gray-800/80 dark:via-gray-800/60 dark:to-gray-900/30 backdrop-blur-md hover:shadow-2xl transition-all duration-500">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {command.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs font-semibold bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 border border-gray-200/50 dark:border-gray-600/50 hover:border-gray-300 dark:hover:border-gray-500 transition-colors">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Related commands */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white/80 via-white/60 to-gray-50/30 dark:from-gray-800/80 dark:via-gray-800/60 dark:to-gray-900/30 backdrop-blur-md hover:shadow-2xl transition-all duration-500">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  Comandos Relacionados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {relatedCommands.map((related) => (
                    <div
                      key={related.id}
                      className="group p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-600/50 hover:border-gray-300 dark:hover:border-gray-500 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                      onClick={() => router.push(`/command/${related.id}`)}
                    >
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {related.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-semibold bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                          {related.category}
                        </Badge>
                        <Badge variant="outline" className={`text-xs font-semibold ${getLevelColor(related.level)}`}>
                          {related.level}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};