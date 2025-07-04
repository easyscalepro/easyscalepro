"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, Clock, TrendingUp, Heart, Sparkles, Zap } from 'lucide-react';
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
          color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          gradient: 'from-emerald-500 to-green-500',
          icon: '🌱'
        };
      case 'intermediário':
        return {
          color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          gradient: 'from-amber-500 to-orange-500',
          icon: '⚡'
        };
      case 'avançado':
        return {
          color: 'bg-red-500/10 text-red-400 border-red-500/30',
          gradient: 'from-red-500 to-pink-500',
          icon: '🚀'
        };
      default:
        return {
          color: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
          gradient: 'from-slate-500 to-gray-500',
          icon: '📝'
        };
    }
  };

  const getCategoryConfig = (category: string) => {
    const configs = {
      'Marketing': { gradient: 'from-blue-500 to-cyan-500', icon: '📈' },
      'Finanças': { gradient: 'from-green-500 to-emerald-500', icon: '💰' },
      'Gestão': { gradient: 'from-purple-500 to-violet-500', icon: '👥' },
      'Vendas': { gradient: 'from-orange-500 to-red-500', icon: '🎯' },
      'Estratégia': { gradient: 'from-indigo-500 to-blue-500', icon: '🧠' },
      'Atendimento': { gradient: 'from-pink-500 to-rose-500', icon: '💬' },
      'Recursos Humanos': { gradient: 'from-teal-500 to-cyan-500', icon: '👤' },
      'Operações': { gradient: 'from-cyan-500 to-blue-500', icon: '⚙️' }
    };
    return configs[category as keyof typeof configs] || { gradient: 'from-slate-500 to-gray-500', icon: '📄' };
  };

  const levelConfig = getLevelConfig(level);
  const categoryConfig = getCategoryConfig(category);
  const safeTags = Array.isArray(tags) ? tags : [];

  return (
    <Card className="group cursor-pointer border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm hover:from-slate-800/80 hover:to-slate-900/80 hover:border-slate-600/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 relative overflow-hidden">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Animated border */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
      
      <CardContent className="relative p-6 z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${categoryConfig.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <span className="text-xl">{categoryConfig.icon}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{category}</span>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs">{levelConfig.icon}</span>
                <span className="text-xs text-slate-300 font-medium">{level}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleFavorite}
            className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 hover:bg-slate-700/50 rounded-full hover:scale-110"
          >
            <Heart className={`h-5 w-5 transition-all duration-300 ${
              isFavorite 
                ? 'text-red-400 fill-current scale-110' 
                : 'text-slate-400 hover:text-red-400'
            }`} />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors duration-300 leading-tight">
            {title}
          </h3>
          <p className="text-slate-300 text-sm line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Tags */}
        {safeTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {safeTags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-full font-medium border border-slate-600/30 hover:bg-slate-600/50 transition-colors"
              >
                #{tag}
              </span>
            ))}
            {safeTags.length > 3 && (
              <span className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30 font-medium">
                +{safeTags.length - 3} mais
              </span>
            )}
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between mb-6 text-xs">
          <div className="flex items-center gap-4 text-slate-400">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{estimatedTime}</span>
            </div>
            {popularity > 0 && (
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>{popularity}% popular</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-yellow-400" />
            <span className="text-yellow-400 font-medium">Premium</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={handleCopyPrompt}
            size="sm"
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group/btn"
          >
            <Copy className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
            Copiar
          </Button>
          
          <Button
            onClick={() => onViewDetails(id)}
            size="sm"
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white font-semibold hover:border-slate-500 transition-all duration-300 group/btn"
          >
            <Eye className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
            Ver
          </Button>
        </div>

        {/* Popularity indicator */}
        {popularity > 80 && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <Zap className="h-3 w-3" />
            HOT
          </div>
        )}
      </CardContent>
    </Card>
  );
};