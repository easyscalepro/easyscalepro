"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Heart, Search, Copy, Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useCommands } from '@/contexts/commands-context';

export const FavoritesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const { commands, favorites, toggleFavorite, incrementCopies } = useCommands();

  // Filtrar comandos favoritos
  const favoriteCommands = commands.filter(cmd => favorites.includes(cmd.id));
  
  const filteredFavorites = favoriteCommands.filter(fav =>
    fav.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fav.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyPrompt = async (prompt: string, id: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      incrementCopies(id);
      toast.success('Prompt copiado para a área de transferência!');
    } catch (error) {
      toast.error('Erro ao copiar prompt');
    }
  };

  const handleRemoveFavorite = (id: string, title: string) => {
    toggleFavorite(id);
  };

  const handleViewDetails = (id: string) => {
    router.push(`/command/${id}`);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'iniciante':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'intermediário':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'avançado':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Heart className="h-6 w-6 text-red-500 fill-current" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Meus Favoritos</h1>
        <Badge variant="secondary" className="bg-blue-600 dark:bg-blue-500 text-white">
          {favoriteCommands.length} comandos
        </Badge>
      </div>

      {/* Busca */}
      <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              placeholder="Buscar nos favoritos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de favoritos */}
      {filteredFavorites.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredFavorites.map((favorite) => (
            <Card key={favorite.id} className="border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <Heart className="h-5 w-5 text-red-500 fill-current mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          {favorite.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                          {favorite.description}
                        </p>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="bg-blue-600 dark:bg-blue-500 text-white text-xs">
                            {favorite.category}
                          </Badge>
                          <Badge className={`text-xs border ${getLevelColor(favorite.level)}`}>
                            {favorite.level}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Adicionado em {favorite.createdAt}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      onClick={() => handleCopyPrompt(favorite.prompt, favorite.id)}
                      size="sm"
                      className="bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-gray-900 dark:text-white font-medium"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copiar
                    </Button>
                    
                    <Button
                      onClick={() => handleViewDetails(favorite.id)}
                      size="sm"
                      variant="outline"
                      className="border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Detalhes
                    </Button>
                    
                    <Button
                      onClick={() => handleRemoveFavorite(favorite.id, favorite.title)}
                      size="sm"
                      variant="outline"
                      className="border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardContent className="text-center py-12">
            <Heart className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {searchTerm ? 'Nenhum favorito encontrado' : 'Nenhum comando favoritado ainda'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {searchTerm 
                ? 'Tente buscar com outros termos'
                : 'Comece a favoritar comandos para acessá-los rapidamente aqui'
              }
            </p>
            {!searchTerm && (
              <Button
                onClick={() => router.push('/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
              >
                Explorar Comandos
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};