"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, Clock, TrendingUp, Heart, Star, Zap, ArrowRight } from 'lucide-react';
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
          color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          icon: '🌱',
          gradient: 'from-emerald-400 to-emerald-600'
        };
      case 'intermediário':
        return {
          color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          icon: '🔥',
          gradient: 'from-amber-400 to-amber-600'
        };
      case 'avançado':
        return {
          color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
          icon: '🚀',
          gradient: 'from-red-400 to-red-600'
        };
      default:
        return {
          color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700',
          icon: '⭐',
          gradient: 'from-gray-400 to-gray-600'
        };
    }
  };

  const getCategoryConfig = (category: string) => {
    const configs = {
      'Marketing': { color: 'bg-blue-500', icon: '📈', gradient: 'from-blue-400 to-blue-600' },
      'Finanças': { color: 'bg-green-500', icon: '💰', gradient: 'from-green-400 to-green-600' },
      'Gestão': { color: 'bg-purple-500', icon: '👔', gradient: 'from-purple-400 to-purple-600' },
      'Vendas': { color: 'bg-orange-500', icon: '🎯', gradient: 'from-orange-400 to-orange-600' },
      'Estratégia': { color: 'bg-indigo-500', icon: '🧠', gradient: 'from-indigo-400 to-indigo-600' },
      'Atendimento': { color: 'bg-pink-500', icon: '🤝', gradient: 'from-pink-400 to-pink-600' },
      'Recursos Humanos': { color: 'bg-teal-500', icon: '👥', gradient: 'from-teal-400 to-teal-600' },
      'Operações': { color: 'bg-cyan-500', icon: '⚙️', gradient: 'from-cyan-400 to-cyan-600' }
    };
    return configs[category as keyof typeof configs] || { color: 'bg-gray-500', icon: '📄', gradient: 'from-gray-400 to-gray-600' };
  };

  const levelConfig = getLevelConfig(level);
  const categoryConfig = getCategoryConfig(category);
  const safeTags = Array.isArray(tags) ? tags : [];

  return (
    <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm cursor-pointer">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-800 dark:via-gray-800 dark:to-blue-900/20 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-yellow-400/10 to-orange-400/10 rounded-full translate-y-12 -translate-x-12 group-hover:scale-125 transition-transform duration-700"></div>
      
      <CardContent className="relative p-6 z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${categoryConfig.gradient} shadow-lg group-hover:animate-pulse`}></div>
            <span className="text-lg group-hover:animate-bounce">{categoryConfig.icon}</span>
          </div>
          <button
            onClick={handleFavorite}
            className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transform hover:scale-110"
          >
            <Heart className={`h-5 w-5 transition-all duration-300 ${
              isFavorite 
                ? 'text-red-500 fill-current scale-110' 
                : 'text-gray-400 dark:text-gray-500 hover:text-red-500'
            }`} />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Tags */}
        {safeTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {safeTags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full font-medium border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
              >
                #{tag}
              </span>
            ))}
            {safeTags.length > 3 && (
              <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full font-medium">
                +{safeTags.length - 3} mais
              </span>
            )}
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between mb-6 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">
              <Clock className="h-3 w-3" />
              <span className="font-medium">{estimatedTime}</span>
            </div>
            {popularity > 0 && (
              <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 rounded-full">
                <Star className="h-3 w-3 text-yellow-500" />
                <span className="font-medium">{popularity}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-3 mb-6">
          <Badge variant="outline" className="text-xs font-semibold border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-3 py-1">
            <span className="mr-1">{categoryConfig.icon}</span>
            {category}
          </Badge>
          <Badge variant="outline" className={`text-xs font-semibold border ${levelConfig.color} px-3 py-1`}>
            <span className="mr-1">{levelConfig.icon}</span>
            {level}
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={handleCopyPrompt}
            size="sm"
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copiar
            <Zap className="h-3 w-3 ml-1 opacity-70" />
          </Button>
          
          <Button
            onClick={() => onViewDetails(id)}
            size="sm"
            variant="outline"
            className="border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold transition-all duration-300 transform hover:scale-105 rounded-xl group/btn"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver
            <ArrowRight className="h-3 w-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Popularity indicator */}
        {popularity > 80 && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
            🔥 Popular
          </div>
        )}
      </CardContent>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
    </Card>
  );
};