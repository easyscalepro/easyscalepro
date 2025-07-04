"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, Clock, Heart, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useCommands } from '@/contexts/commands-context';

interface ModernCommandCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'iniciante' | 'intermediário' | 'avançado';
  prompt: string;
  tags?: string[];
  popularity?: number;
  estimatedTime?: string;
  onViewDetails: (id: string) => void;
}

export const ModernCommandCard: React.FC<ModernCommandCardProps> = ({
  id,
  title,
  description,
  category,
  level,
  prompt,
  tags = [],
  popularity = 0,
  estimatedTime = '5 min',
  onViewDetails,
}) => {
  const { favorites, toggleFavorite, incrementCopies } = useCommands();
  const isFavorite = favorites.includes(id);

  const handleCopyPrompt = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(prompt);
      incrementCopies(id);
      toast.success('Prompt copiado!', {
        description: 'O comando foi copiado para sua área de transferência'
      });
    } catch (error) {
      toast.error('Erro ao copiar prompt');
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(id);
  };

  const getLevelConfig = (level: string) => {
    switch (level) {
      case 'iniciante':
        return {
          color: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white',
          bgGradient: 'from-emerald-500/10 to-emerald-600/10',
          borderColor: 'border-emerald-500/20'
        };
      case 'intermediário':
        return {
          color: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white',
          bgGradient: 'from-amber-500/10 to-amber-600/10',
          borderColor: 'border-amber-500/20'
        };
      case 'avançado':
        return {
          color: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
          bgGradient: 'from-red-500/10 to-red-600/10',
          borderColor: 'border-red-500/20'
        };
      default:
        return {
          color: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white',
          bgGradient: 'from-gray-500/10 to-gray-600/10',
          borderColor: 'border-gray-500/20'
        };
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Marketing': 'from-blue-500 to-blue-600',
      'Finanças': 'from-green-500 to-green-600',
      'Gestão': 'from-purple-500 to-purple-600',
      'Vendas': 'from-orange-500 to-orange-600',
      'Estratégia': 'from-indigo-500 to-indigo-600',
      'Atendimento': 'from-pink-500 to-pink-600',
      'Recursos Humanos': 'from-teal-500 to-teal-600',
      'Operações': 'from-cyan-500 to-cyan-600'
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const levelConfig = getLevelConfig(level);
  const safeTags = Array.isArray(tags) ? tags : [];

  return (
    <Card className="group relative overflow-hidden cursor-pointer border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-gray-50/80"></div>
      
      <div className={`absolute inset-0 bg-gradient-to-r ${getCategoryColor(category)} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl`}></div>
      
      <CardContent className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${getCategoryColor(category)} shadow-lg group-hover:scale-125 transition-transform duration-300`}></div>
          <button
            onClick={handleFavorite}
            className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 hover:bg-red-50 rounded-full transform hover:scale-110"
          >
            <Heart className={`h-5 w-5 transition-colors ${
              isFavorite 
                ? 'text-red-500 fill-current' 
                : 'text-gray-400 hover:text-red-500'
            }`} />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>

        {safeTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {safeTags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs rounded-full font-medium border border-gray-200"
              >
                {tag}
              </span>
            ))}
            {safeTags.length > 3 && (
              <span className="px-3 py-1 bg-gradient-to-r from-blue-600/10 to-yellow-400/10 text-blue-600 text-xs rounded-full font-medium border border-blue-600/20">
                +{safeTags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {estimatedTime}
          </div>
          {popularity > 0 && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-400" />
              {popularity}% popular
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Badge className={`text-xs font-semibold px-3 py-1 bg-gradient-to-r ${getCategoryColor(category)} text-white border-0 shadow-lg`}>
            {category}
          </Badge>
          <Badge className={`text-xs font-semibold px-3 py-1 ${levelConfig.color} border-0 shadow-lg`}>
            {level}
          </Badge>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleCopyPrompt}
            size="sm"
            className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-gray-900 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copiar
          </Button>
          
          <Button
            onClick={() => onViewDetails(id)}
            size="sm"
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver
          </Button>
        </div>

        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-400/10 to-transparent rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-600/10 to-transparent rounded-full translate-y-8 -translate-x-8 group-hover:scale-150 transition-transform duration-500"></div>
      </CardContent>
    </Card>
  );
};