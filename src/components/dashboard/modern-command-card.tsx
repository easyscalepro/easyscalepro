"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, Clock, TrendingUp, Heart } from 'lucide-react';
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

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'iniciante':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'intermediário':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'avançado':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Marketing': 'bg-blue-500',
      'Finanças': 'bg-green-500',
      'Gestão': 'bg-purple-500',
      'Vendas': 'bg-orange-500',
      'Estratégia': 'bg-indigo-500',
      'Atendimento': 'bg-pink-500',
      'Recursos Humanos': 'bg-teal-500',
      'Operações': 'bg-cyan-500'
    };
    return colors[category as keyof typeof colors] || 'bg-slate-500';
  };

  const safeTags = Array.isArray(tags) ? tags : [];

  return (
    <Card className="group cursor-pointer border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm hover:bg-slate-800/80 hover:border-slate-600/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-3 h-3 rounded-full ${getCategoryColor(category)} flex-shrink-0 mt-2 shadow-lg`}></div>
          <button
            onClick={handleFavorite}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-700 rounded-full"
          >
            <Heart className={`h-4 w-4 transition-colors ${
              isFavorite 
                ? 'text-red-400 fill-current' 
                : 'text-slate-400 hover:text-red-400'
            }`} />
          </button>
        </div>

        {/* Content */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          <p className="text-slate-300 text-sm line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Tags */}
        {safeTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {safeTags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-md font-medium border border-slate-600/30"
              >
                {tag}
              </span>
            ))}
            {safeTags.length > 3 && (
              <span className="px-2 py-1 bg-slate-700/30 text-slate-400 text-xs rounded-md border border-slate-600/20">
                +{safeTags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 mb-4 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {estimatedTime}
          </div>
          {popularity > 0 && (
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {popularity}% popular
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 mb-6">
          <Badge variant="outline" className="text-xs font-medium border-blue-500/30 text-blue-400 bg-blue-500/10">
            {category}
          </Badge>
          <Badge variant="outline" className={`text-xs font-medium border ${getLevelColor(level)}`}>
            {level}
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={handleCopyPrompt}
            size="sm"
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg hover:shadow-blue-500/25"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copiar
          </Button>
          
          <Button
            onClick={() => onViewDetails(id)}
            size="sm"
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white font-medium"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};