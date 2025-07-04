"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, Clock, Heart, Star, Zap, TrendingUp } from 'lucide-react';
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
        description: 'O comando foi copiado para sua área de transferência',
        duration: 3000,
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
          bgGradient: 'from-emerald-500/20 to-emerald-600/20',
          borderColor: 'border-emerald-500/30'
        };
      case 'intermediário':
        return {
          color: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white',
          bgGradient: 'from-amber-500/20 to-amber-600/20',
          borderColor: 'border-amber-500/30'
        };
      case 'avançado':
        return {
          color: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
          bgGradient: 'from-red-500/20 to-red-600/20',
          borderColor: 'border-red-500/30'
        };
      default:
        return {
          color: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white',
          bgGradient: 'from-gray-500/20 to-gray-600/20',
          borderColor: 'border-gray-500/30'
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
  const isPopular = popularity > 80;

  return (
    <Card className="group relative overflow-hidden cursor-pointer border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-6 hover:rotate-1 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-2 border-white/20">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm"></div>
      <div className={`absolute inset-0 bg-gradient-to-r ${getCategoryColor(category)} opacity-0 group-hover:opacity-20 transition-opacity duration-700 rounded-2xl`}></div>
      
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-full group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-tr from-blue-600/20 to-transparent rounded-full group-hover:scale-150 transition-transform duration-700"></div>
      
      <CardContent className="relative p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${getCategoryColor(category)} shadow-lg group-hover:scale-125 transition-transform duration-500`}></div>
            {isPopular && (
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                POPULAR
              </div>
            )}
          </div>
          <button
            onClick={handleFavorite}
            className="opacity-0 group-hover:opacity-100 transition-all duration-500 p-3 hover:bg-red-500/20 rounded-full transform hover:scale-125"
          >
            <Heart className={`h-6 w-6 transition-colors ${
              isFavorite 
                ? 'text-red-500 fill-current' 
                : 'text-white/60 hover:text-red-500'
            }`} />
          </button>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-black text-white mb-4 line-clamp-2 group-hover:text-yellow-400 transition-colors duration-500">
            {title}
          </h3>
          <p className="text-gray-300 text-base line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>

        {safeTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {safeTags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-2 bg-white/10 backdrop-blur-sm text-white text-xs rounded-full font-semibold border border-white/20 hover:bg-white/20 transition-colors duration-300"
              >
                #{tag}
              </span>
            ))}
            {safeTags.length > 3 && (
              <span className="px-3 py-2 bg-gradient-to-r from-blue-600/20 to-yellow-400/20 text-yellow-400 text-xs rounded-full font-bold border border-yellow-400/30">
                +{safeTags.length - 3} mais
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mb-6 text-sm text-gray-300">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-400" />
              <span className="font-semibold">{estimatedTime}</span>
            </div>
            {popularity > 0 && (
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="font-semibold">{popularity}%</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="font-semibold">Premium</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <Badge className={`text-sm font-bold px-4 py-2 bg-gradient-to-r ${getCategoryColor(category)} text-white border-0 shadow-lg`}>
            {category}
          </Badge>
          <Badge className={`text-sm font-bold px-4 py-2 ${levelConfig.color} border-0 shadow-lg`}>
            {level}
          </Badge>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handleCopyPrompt}
            size="lg"
            className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-gray-900 font-black shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 text-base py-6"
          >
            <Copy className="h-5 w-5 mr-2" />
            Copiar
          </Button>
          
          <Button
            onClick={() => onViewDetails(id)}
            size="lg"
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-600 text-white font-black shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 text-base py-6"
          >
            <Eye className="h-5 w-5 mr-2" />
            Detalhes
          </Button>
        </div>

        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Zap className="h-3 w-3" />
            PREMIUM
          </div>
        </div>
      </CardContent>
    </Card>
  );
};