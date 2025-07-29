"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { useAuth } from '@/components/auth/auth-provider';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, 
  Copy, 
  Heart, 
  Eye, 
  Clock, 
  Tag, 
  TrendingUp,
  Star,
  BookOpen,
  Lightbulb,
  Target,
  Zap,
  Share2,
  Download,
  ThumbsUp,
  MessageCircle,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface Command {
  id: string;
  title: string;
  description: string;
  category_name: string;
  level: string;
  prompt: string;
  usage_instructions?: string;
  tags: string[];
  estimated_time: string;
  views: number;
  copies: number;
  popularity: number;
  created_at: string;
  created_by: string;
}

export default function CommandDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [command, setCommand] = useState<Command | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadCommand();
      checkIfFavorite();
    }
  }, [params.id, user]);

  const loadCommand = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('commands')
        .select('*')
        .eq('id', params.id)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Erro ao carregar comando:', error);
        toast.error('Comando não encontrado');
        router.push('/dashboard');
        return;
      }

      setCommand(data);
      
      // Incrementar views
      await incrementViews(data.id);
      
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao carregar comando');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('command_id', params.id)
        .single();

      setIsFavorite(!!data);
    } catch (error) {
      // Não é favorito
      setIsFavorite(false);
    }
  };

  const incrementViews = async (commandId: string) => {
    try {
      await supabase.rpc('increment_command_views', { command_uuid: commandId });
    } catch (error) {
      console.error('Erro ao incrementar views:', error);
    }
  };

  const incrementCopies = async (commandId: string) => {
    try {
      await supabase.rpc('increment_command_copies', { command_uuid: commandId });
    } catch (error) {
      console.error('Erro ao incrementar copies:', error);
    }
  };

  const copyPrompt = async () => {
    if (!command) return;
    
    try {
      await navigator.clipboard.writeText(command.prompt);
      await incrementCopies(command.id);
      toast.success('Prompt copiado para a área de transferência!');
    } catch (error) {
      console.error('Erro ao copiar:', error);
      toast.error('Erro ao copiar prompt');
    }
  };

  const toggleFavorite = async () => {
    if (!user || !command) return;
    
    try {
      setFavoriteLoading(true);
      
      if (isFavorite) {
        // Remover dos favoritos
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('command_id', command.id);

        if (error) throw error;
        
        setIsFavorite(false);
        toast.success('Removido dos favoritos');
      } else {
        // Adicionar aos favoritos
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            command_id: command.id
          });

        if (error) throw error;
        
        setIsFavorite(true);
        toast.success('Adicionado aos favoritos');
      }
    } catch (error) {
      console.error('Erro ao alterar favorito:', error);
      toast.error('Erro ao alterar favorito');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'iniciante': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'intermediário': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'avançado': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'marketing': return <TrendingUp className="h-4 w-4" />;
      case 'vendas': return <Target className="h-4 w-4" />;
      case 'produtividade': return <Zap className="h-4 w-4" />;
      case 'criatividade': return <Lightbulb className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <DashboardHeader />
          <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 relative">
            <div className="text-center py-12 sm:py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Carregando comando...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!command) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <DashboardHeader />
          <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 relative">
            <div className="text-center py-12 sm:py-16">
              <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Comando não encontrado
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                O comando que você está procurando não existe ou foi removido.
              </p>
              <Button onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Dashboard
              </Button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <DashboardHeader />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 relative">
          {/* Botão Voltar - Responsivo */}
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 p-2 sm:p-3"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              <span className="text-sm sm:text-base">Voltar</span>
            </Button>
          </div>

          {/* Card Principal - Layout responsivo */}
          <Card className="shadow-xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 break-words">
                    {command.title}
                  </CardTitle>
                  <CardDescription className="text-blue-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                    {command.description}
                  </CardDescription>
                </div>
                
                {/* Botão Favorito - Responsivo */}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={toggleFavorite}
                  disabled={favoriteLoading}
                  className={`flex-shrink-0 ${isFavorite ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-white/20 text-white hover:bg-white/30'} transition-all duration-200`}
                >
                  <Heart className={`h-4 w-4 mr-1 sm:mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                  <span className="text-xs sm:text-sm">{isFavorite ? 'Favoritado' : 'Favoritar'}</span>
                </Button>
              </div>

              {/* Badges - Layout responsivo */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6">
                <Badge className={`text-xs sm:text-sm px-2 sm:px-3 py-1 ${getLevelColor(command.level)} border-0`}>
                  {command.level}
                </Badge>
                <Badge className="bg-white/20 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 flex items-center gap-1 sm:gap-2 border-0">
                  {getCategoryIcon(command.category_name)}
                  {command.category_name}
                </Badge>
                <Badge className="bg-white/20 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 flex items-center gap-1 sm:gap-2 border-0">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  {command.estimated_time}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
              {/* Stats - Layout responsivo */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-center mb-1 sm:mb-2">
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {command.views}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Visualizações
                  </div>
                </div>
                
                <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-center mb-1 sm:mb-2">
                    <Copy className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {command.copies}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Cópias
                  </div>
                </div>
                
                <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-center mb-1 sm:mb-2">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {command.popularity}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Popularidade
                  </div>
                </div>
              </div>

              <Separator />

              {/* Prompt - Layout responsivo */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  Prompt do Comando
                </h3>
                
                <div className="relative">
                  <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-4 sm:p-6 text-gray-100 font-mono text-sm sm:text-base leading-relaxed overflow-x-auto">
                    <pre className="whitespace-pre-wrap break-words">{command.prompt}</pre>
                  </div>
                  
                  <Button
                    onClick={copyPrompt}
                    className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                    size="sm"
                  >
                    <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Copiar
                  </Button>
                </div>
              </div>

              {/* Instruções de Uso - Layout responsivo */}
              {command.usage_instructions && (
                <>
                  <Separator />
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                      Como Usar
                    </h3>
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 sm:p-6">
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {command.usage_instructions}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* Tags - Layout responsivo */}
              {command.tags && command.tags.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Tag className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {command.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs sm:text-sm px-2 sm:px-3 py-1">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Botão de Ação Principal - Responsivo */}
              <div className="pt-4 sm:pt-6">
                <Button
                  onClick={copyPrompt}
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 sm:py-4 text-sm sm:text-base lg:text-lg transition-all duration-200 transform hover:scale-105"
                >
                  <Copy className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                  Copiar Prompt Completo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}