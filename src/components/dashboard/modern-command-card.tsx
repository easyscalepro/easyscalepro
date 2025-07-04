"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, Clock, Heart, ArrowRight, Zap } from 'lucide-react';
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
      toast.success('Comando copiado!', {
        description: 'O prompt foi copiado para sua área de transferência',
        duration: 3000,
      });
    } catch (error) {
      toast.error('Erro ao copiar comando');
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
          color: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          gradient: 'from-emerald-400 to-emerald-600'
        };
      case 'intermediário':
        return {
          color: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          gradient: 'from-amber-400 to-amber-600'
        };
      case 'avançado':
        return {
          color: 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
          gradient: 'from-red-400 to-red-600'
        };
      default:
        return {
          color: 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700',
          gradient: 'from-gray-400 to-gray-600'
        };
    }
  };

  const getCategoryConfig = (category: string) => {
    const configs = {
      'Marketing': { gradient: 'from-blue-400 to-blue-600' },
      'Finanças': { gradient: 'from-emerald-400 to-emerald-600' },
      'Gestão': { gradient: 'from-purple-400 to-purple-600' },
      'Vendas': { gradient: 'from-orange-400 to-orange-600' },
      'Estratégia': { gradient: 'from-indigo-400 to-indigo-600' },
      'Atendimento': { gradient: 'from-pink-400 to-pink-600' },
      'Recursos Humanos': { gradient: 'from-teal-400 to-teal-600' },
      'Operações': { gradient: 'from-cyan-400 to-cyan-600' }
    };
    return configs[category as keyof typeof configs] || { gradient: 'from-gray-400 to-gray-600' };
  };

  const levelConfig = getLevelConfig(level);
  const categoryConfig = getCategoryConfig(category);
  const safeTags = Array.isArray(tags) ? tags : [];

  return (
    <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm cursor-pointer">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30 dark:from-gray-800 dark:via-gray-800/80 dark:to-blue-950/20 opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-indigo-400/10 to-purple-400/10 rounded-full translate-y-10 -translate-x-10 group-hover:scale-125 transition-transform duration-700"></div>
      
      <CardContent className="relative p-6 z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-1 h-12 bg-gradient-to-b ${categoryConfig.gradient} rounded-full group-hover:h-16 transition-all duration-300`}></div>
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
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full font-medium border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
              >
                #{tag}
              </span>
            ))}
            {safeTags.length > 3 && (
              <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30 text-blue-600 dark:text-blue-400 text-xs rounded-full font-medium">
                +{safeTags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between mb-6 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-950/30 px-3 py-1.5 rounded-full">
            <Clock className="h-3 w-3" />
            <span className="font-medium">{estimatedTime}</span>
          </div>
          {popularity > 80 && (
            <div className="flex items-center gap-1 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-950/30 dark:to-red-950/30 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-full">
              <Zap className="h-3 w-3" />
              <span className="font-medium">Popular</span>
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="flex items-center gap-3 mb-6">
          <Badge variant="outline" className="text-xs font-semibold border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/30 px-3 py-1.5">
            {category}
          </Badge>
          <Badge variant="outline" className={`text-xs font-semibold border ${levelConfig.color} px-3 py-1.5`}>
            {level}
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={handleCopyPrompt}
            size="sm"
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copiar
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
      </CardContent>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
    </Card>
  );
};