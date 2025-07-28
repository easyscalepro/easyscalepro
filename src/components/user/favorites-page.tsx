"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/auth/auth-provider';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/lib/supabase';
import { 
  Heart, 
  Search, 
  Copy, 
  Eye, 
  Clock, 
  Tag, 
  Filter,
  Grid3X3,
  List,
  Sparkles,
  BookOpen,
  TrendingUp,
  Star,
  Zap,
  Target,
  Lightbulb,
  HeartOff,
  RefreshCw,
  SortAsc,
  SortDesc
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
}

interface Favorite {
  id: string;
  command_id: string;
  created_at: string;
  commands: Command;
}

export const FavoritesPage: React.FC = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'alphabetical'>('recent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  useEffect(() => {
    filterAndSortFavorites();
  }, [favorites, searchTerm, selectedCategory, selectedLevel, sortBy, sortOrder]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          command_id,
          created_at,
          commands (
            id,
            title,
            description,
            category_name,
            level,
            prompt,
            usage_instructions,
            tags,
            estimated_time,
            views,
            copies,
            popularity,
            created_at
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar favoritos:', error);
        toast.error('Erro ao carregar favoritos');
        return;
      }

      setFavorites(data || []);
      
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao carregar favoritos');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortFavorites = () => {
    let filtered = [...favorites];

    // Filtrar por busca
    if (searchTerm) {
      filtered = filtered.filter(fav => 
        fav.commands.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fav.commands.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fav.commands.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(fav => fav.commands.category_name === selectedCategory);
    }

    // Filtrar por nível
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(fav => fav.commands.level === selectedLevel);
    }

    // Ordenar
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'recent':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'popular':
          comparison = a.commands.popularity - b.commands.popularity;
          break;
        case 'alphabetical':
          comparison = a.commands.title.localeCompare(b.commands.title);
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    setFilteredFavorites(filtered);
  };

  const removeFavorite = async (favoriteId: string, commandTitle: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;

      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
      toast.success(`"${commandTitle}" removido dos favoritos`);
      
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      toast.error('Erro ao remover favorito');
    }
  };

  const copyPrompt = async (prompt: string, title: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      toast.success(`Prompt "${title}" copiado!`);
    } catch (error) {
      console.error('Erro ao copiar:', error);
      toast.error('Erro ao copiar prompt');
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

  const handleCopyPrompt = async (command: Command) => {
    await incrementCopies(command.id);
    await copyPrompt(command.prompt, command.title);
  };

  const handleViewCommand = async (command: Command) => {
    await incrementViews(command.id);
  };

  const categories = [...new Set(favorites.map(fav => fav.commands.category_name))];
  const levels = [...new Set(favorites.map(fav => fav.commands.level))];

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'iniciante': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'intermediário': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'avançado': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'marketing': return <TrendingUp className="h-3 w-3" />;
      case 'vendas': return <Target className="h-3 w-3" />;
      case 'produtividade': return <Zap className="h-3 w-3" />;
      case 'criatividade': return <Lightbulb className="h-3 w-3" />;
      default: return <BookOpen className="h-3 w-3" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="text-center py-8 sm:py-12">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Carregando seus favoritos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header responsivo */}
      <div className="space-y-4 sm:space-y-6">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl shadow-lg">
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
            </div>
            Meus Favoritos
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 mt-2">
            {favorites.length} {favorites.length === 1 ? 'comando' : 'comandos'} salvos
          </p>
        </div>

        {/* Filtros e controles - Layout mobile otimizado */}
        <div className="space-y-3 sm:space-y-4">
          {/* Barra de busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar nos favoritos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 sm:h-12 text-sm sm:text-base"
            />
          </div>

          {/* Filtros em mobile - Stack vertical */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="flex gap-2 sm:gap-3 flex-1">
              {/* Categoria */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 px-3 py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="all">Todas categorias</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* Nível */}
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="flex-1 px-3 py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="all">Todos níveis</option>
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Controles de visualização - Mobile otimizado */}
            <div className="flex gap-2 justify-between sm:justify-end">
              {/* Ordenação */}
              <div className="flex gap-1">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="recent">Recentes</option>
                  <option value="popular">Populares</option>
                  <option value="alphabetical">A-Z</option>
                </select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-2 sm:px-3"
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-3 w-3 sm:h-4 sm:w-4" /> : <SortDesc className="h-3 w-3 sm:h-4 sm:w-4" />}
                </Button>
              </div>

              {/* Modo de visualização */}
              <div className="flex gap-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="px-2 sm:px-3"
                >
                  <Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="px-2 sm:px-3"
                >
                  <List className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de favoritos - Layout responsivo */}
      {filteredFavorites.length === 0 ? (
        <div className="text-center py-8 sm:py-12 lg:py-16">
          <div className="max-w-md mx-auto space-y-4">
            <div className="p-4 sm:p-6 bg-gray-100 dark:bg-gray-800 rounded-full w-fit mx-auto">
              <HeartOff className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
              {searchTerm || selectedCategory !== 'all' || selectedLevel !== 'all' 
                ? 'Nenhum favorito encontrado' 
                : 'Nenhum favorito ainda'
              }
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              {searchTerm || selectedCategory !== 'all' || selectedLevel !== 'all'
                ? 'Tente ajustar os filtros para encontrar seus comandos favoritos.'
                : 'Explore nossos comandos e adicione seus favoritos para acesso rápido.'
              }
            </p>
            {(searchTerm || selectedCategory !== 'all' || selectedLevel !== 'all') && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedLevel('all');
                }}
                className="mt-4"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Limpar filtros
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" 
            : "space-y-3 sm:space-y-4"
        }>
          {filteredFavorites.map((favorite) => {
            const command = favorite.commands;
            
            return (
              <Card 
                key={favorite.id} 
                className={`group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:shadow-xl hover:-translate-y-1 ${
                  viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
                }`}
              >
                <CardHeader className={`${viewMode === 'list' ? 'sm:flex-1' : ''} pb-3 sm:pb-4`}>
                  <div className="flex items-start justify-between gap-2 sm:gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {command.title}
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1 sm:mt-2">
                        {command.description}
                      </CardDescription>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFavorite(favorite.id, command.title)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 sm:p-2 flex-shrink-0"
                    >
                      <Heart className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
                    </Button>
                  </div>

                  {/* Tags e badges - Layout mobile otimizado */}
                  <div className="flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-3">
                    <Badge className={`text-xs px-2 py-1 ${getLevelColor(command.level)}`}>
                      {command.level}
                    </Badge>
                    <Badge variant="outline" className="text-xs px-2 py-1 flex items-center gap-1">
                      {getCategoryIcon(command.category_name)}
                      {command.category_name}
                    </Badge>
                    <Badge variant="outline" className="text-xs px-2 py-1 flex items-center gap-1">
                      <Clock className="h-2 w-2 sm:h-3 sm:w-3" />
                      {command.estimated_time}
                    </Badge>
                  </div>

                  {/* Tags do comando */}
                  {command.tags && command.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {command.tags.slice(0, isMobile ? 2 : 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                          <Tag className="h-2 w-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                      {command.tags.length > (isMobile ? 2 : 3) && (
                        <Badge variant="secondary" className="text-xs px-2 py-0.5">
                          +{command.tags.length - (isMobile ? 2 : 3)}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardHeader>

                <CardContent className={`pt-0 ${viewMode === 'list' ? 'sm:w-48 sm:flex sm:flex-col sm:justify-between' : ''}`}>
                  {/* Stats - Layout mobile otimizado */}
                  <div className="flex justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {command.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Copy className="h-3 w-3" />
                      {command.copies}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {command.popularity}
                    </div>
                  </div>

                  {/* Botões de ação - Mobile otimizado */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        handleViewCommand(command);
                        // Aqui você pode adicionar lógica para visualizar o comando completo
                      }}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs sm:text-sm h-8 sm:h-9"
                    >
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Ver
                    </Button>
                    <Button
                      onClick={() => handleCopyPrompt(command)}
                      size="sm"
                      className="flex-1 text-xs sm:text-sm h-8 sm:h-9 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Copiar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};