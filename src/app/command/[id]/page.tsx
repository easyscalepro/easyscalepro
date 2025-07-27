"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCommands } from '@/contexts/commands-context';
import { useAuth } from '@/components/auth/auth-provider';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Copy, 
  Heart, 
  Eye, 
  Clock, 
  Tag,
  User,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function CommandPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { 
    getCommandById, 
    getCommandByIdFromDB, 
    getRelatedCommands, 
    toggleFavorite, 
    incrementCopies,
    favorites 
  } = useCommands();
  
  const [command, setCommand] = useState<any>(null);
  const [relatedCommands, setRelatedCommands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(false);

  const commandId = params.id as string;

  useEffect(() => {
    const loadCommand = async () => {
      if (!commandId) return;

      try {
        setLoading(true);
        console.log('🔍 Carregando comando:', commandId);

        // Tentar buscar do contexto primeiro
        let commandData = getCommandById(commandId);
        
        // Se não encontrar no contexto, buscar do banco
        if (!commandData) {
          console.log('⚠️ Comando não encontrado no contexto, buscando do banco...');
          commandData = await getCommandByIdFromDB(commandId);
        }

        if (!commandData) {
          console.error('❌ Comando não encontrado');
          toast.error('Comando não encontrado');
          router.push('/dashboard');
          return;
        }

        setCommand(commandData);
        
        // Carregar comandos relacionados
        const related = getRelatedCommands(commandId);
        setRelatedCommands(related);

        console.log('✅ Comando carregado:', commandData.title);
      } catch (error) {
        console.error('💥 Erro ao carregar comando:', error);
        toast.error('Erro ao carregar comando');
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadCommand();
  }, [commandId, getCommandById, getCommandByIdFromDB, getRelatedCommands, router]);

  const handleCopyPrompt = async () => {
    if (!command) return;

    try {
      setCopying(true);
      
      // Copiar para clipboard
      await navigator.clipboard.writeText(command.prompt);
      
      // Incrementar contador
      await incrementCopies(command.id);
      
      toast.success('Prompt copiado para a área de transferência!');
    } catch (error) {
      console.error('Erro ao copiar:', error);
      toast.error('Erro ao copiar prompt');
    } finally {
      setCopying(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!command) return;
    await toggleFavorite(command.id);
  };

  const isFavorite = favorites.includes(commandId);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando comando...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!command) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Comando não encontrado</h1>
            <Button onClick={() => router.push('/dashboard')}>
              Voltar ao Dashboard
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Dashboard
            </Button>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {command.title}
                </h1>
                <p className="text-gray-600 text-lg mb-4">
                  {command.description}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {command.views} visualizações
                  </div>
                  <div className="flex items-center gap-1">
                    <Copy className="h-4 w-4" />
                    {command.copies} cópias
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(command.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>

              <Button
                variant={isFavorite ? "default" : "outline"}
                onClick={handleToggleFavorite}
                className="ml-4"
              >
                <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'Favoritado' : 'Favoritar'}
              </Button>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Categoria</span>
                </div>
                <p className="text-lg mt-1">{command.category}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Nível</span>
                </div>
                <Badge variant="secondary" className="mt-1">
                  {command.level}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="font-medium">Tempo Estimado</span>
                </div>
                <p className="text-lg mt-1">{command.estimatedTime}</p>
              </CardContent>
            </Card>
          </div>

          {/* Prompt */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Prompt do Comando
                <Button
                  onClick={handleCopyPrompt}
                  disabled={copying}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {copying ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Copiando...
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar Prompt
                    </>
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                  {command.prompt}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Instruções de Uso */}
          {command.usage && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Como Usar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {command.usage}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {command.tags && command.tags.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {command.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comandos Relacionados */}
          {relatedCommands.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Comandos Relacionados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relatedCommands.map((related) => (
                    <div
                      key={related.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/command/${related.id}`)}
                    >
                      <h4 className="font-medium text-gray-900 mb-1">
                        {related.title}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Badge variant="outline" className="text-xs">
                          {related.category}
                        </Badge>
                        <span>•</span>
                        <span>{related.level}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}