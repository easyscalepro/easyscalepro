"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Copy, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface CommandDetailProps {
  command: {
    id: string;
    title: string;
    description: string;
    category: string;
    level: 'iniciante' | 'intermediário' | 'avançado';
    prompt: string;
    usage: string;
    tags: string[];
    createdAt: string;
    views: number;
    copies: number;
  };
  relatedCommands: Array<{
    id: string;
    title: string;
    category: string;
    level: string;
  }>;
}

export const CommandDetail: React.FC<CommandDetailProps> = ({ command, relatedCommands }) => {
  const router = useRouter();

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(command.prompt);
      toast.success('Prompt copiado para a área de transferência!');
    } catch (error) {
      toast.error('Erro ao copiar prompt');
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
      toast.info('Link copiado para compartilhamento');
    }
  };

  const handleBookmark = () => {
    toast.success('Comando salvo nos favoritos!');
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="mb-6 text-[#2563EB] hover:text-[#1d4ed8] hover:bg-blue-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conteúdo principal */}
          <div className="lg:col-span-2">
            <Card className="border-gray-200 mb-6">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold text-[#0F1115] mb-2">
                      {command.title}
                    </CardTitle>
                    <p className="text-gray-600 text-lg">
                      {command.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleShare}
                      size="sm"
                      variant="outline"
                      className="border-gray-300"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={handleBookmark}
                      size="sm"
                      variant="outline"
                      className="border-gray-300"
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4">
                  <Badge variant="secondary" className="bg-[#2563EB] text-white">
                    {command.category}
                  </Badge>
                  <Badge className={getLevelColor(command.level)}>
                    {command.level}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {command.views} visualizações • {command.copies} cópias
                  </span>
                </div>
              </CardHeader>
            </Card>

            {/* Prompt completo */}
            <Card className="border-gray-200 mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-[#0F1115]">
                    Prompt Completo
                  </CardTitle>
                  <Button
                    onClick={handleCopyPrompt}
                    className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0F1115] font-medium"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar Prompt
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <pre className="whitespace-pre-wrap text-sm text-[#0F1115] font-mono leading-relaxed">
                    {command.prompt}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Instruções de uso */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#0F1115]">
                  Como Usar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {command.usage}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Tags */}
            <Card className="border-gray-200 mb-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#0F1115]">
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {command.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Comandos relacionados */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#0F1115]">
                  Comandos Relacionados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {relatedCommands.map((related) => (
                    <div
                      key={related.id}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => router.push(`/command/${related.id}`)}
                    >
                      <h4 className="font-medium text-[#0F1115] text-sm mb-1">
                        {related.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-[#2563EB] text-white text-xs">
                          {related.category}
                        </Badge>
                        <Badge className={`text-xs ${getLevelColor(related.level)}`}>
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