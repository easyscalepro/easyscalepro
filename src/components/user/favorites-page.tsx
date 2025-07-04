"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Heart, Search, Copy, Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const FavoritesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  // Mock data para favoritos
  const favorites = [
    {
      id: '1',
      title: 'Estratégia de Marketing Digital',
      description: 'Crie uma estratégia completa de marketing digital para sua empresa',
      category: 'Marketing',
      level: 'intermediário',
      addedAt: '2024-01-15',
      prompt: 'Crie uma estratégia de marketing digital completa...'
    },
    {
      id: '3',
      title: 'Gestão de Equipe Remota',
      description: 'Melhore a produtividade da sua equipe remota',
      category: 'Gestão',
      level: 'iniciante',
      addedAt: '2024-01-12',
      prompt: 'Desenvolva um plano de gestão para equipe remota...'
    },
    {
      id: '5',
      title: 'Análise de Concorrência',
      description: 'Faça uma análise detalhada dos seus concorrentes',
      category: 'Estratégia',
      level: 'avançado',
      addedAt: '2024-01-10',
      prompt: 'Analise a concorrência do setor [SETOR]...'
    }
  ];

  const filteredFavorites = favorites.filter(fav =>
    fav.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fav.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyPrompt = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      toast.success('Prompt copiado para a área de transferência!');
    } catch (error) {
      toast.error('Erro ao copiar prompt');
    }
  };

  const handleRemoveFavorite = (id: string, title: string) => {
    toast.success(`"${title}" removido dos favoritos`);
  };

  const handleViewDetails = (id: string) => {
    router.push(`/command/${id}`);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Heart className="h-6 w-6 text-red-500 fill-current" />
        <h1 className="text-2xl font-bold text-[#0F1115]">Meus Favoritos</h1>
        <Badge variant="secondary" className="bg-[#2563EB] text-white">
          {favorites.length} comandos
        </Badge>
      </div>

      {/* Busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar nos favoritos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-gray-200 focus:border-[#2563EB] focus:ring-[#2563EB]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de favoritos */}
      {filteredFavorites.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredFavorites.map((favorite) => (
            <Card key={favorite.id} className="border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <Heart className="h-5 w-5 text-red-500 fill-current mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[#0F1115] mb-2">
                          {favorite.title}
                        </h3>
                        <p className="text-gray-600 mb-3">
                          {favorite.description}
                        </p>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="bg-[#2563EB] text-white text-xs">
                            {favorite.category}
                          </Badge>
                          <Badge className={`text-xs ${getLevelColor(favorite.level)}`}>
                            {favorite.level}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            Adicionado em {favorite.addedAt}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      onClick={() => handleCopyPrompt(favorite.prompt)}
                      size="sm"
                      className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0F1115] font-medium"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copiar
                    </Button>
                    
                    <Button
                      onClick={() => handleViewDetails(favorite.id)}
                      size="sm"
                      variant="outline"
                      className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Detalhes
                    </Button>
                    
                    <Button
                      onClick={() => handleRemoveFavorite(favorite.id, favorite.title)}
                      size="sm"
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
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
        <Card>
          <CardContent className="text-center py-12">
            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Nenhum favorito encontrado' : 'Nenhum comando favoritado ainda'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Tente buscar com outros termos'
                : 'Comece a favoritar comandos para acessá-los rapidamente aqui'
              }
            </p>
            {!searchTerm && (
              <Button
                onClick={() => router.push('/dashboard')}
                className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
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