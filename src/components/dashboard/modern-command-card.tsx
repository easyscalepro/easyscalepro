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

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'iniciante':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'intermediário':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200  dark:border-amber-800';
      case 'avançado':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Marketing': 'from-blue-500 to-blue-600',
      'Finanças': 'from-green-500 to-emerald-600',
      'Gestão': 'from-purple-500 to-violet-600',
      'Vendas': 'from-orange-500 to-red-500',
      'Estratégia': 'from-indigo-500 to-purple-600',
      'Atendimento': 'from-pink-500 to-rose-600',
      'Recursos Humanos': 'from-teal-500 to-cyan-600',
      'Operações': 'from-cyan-500 to-blue-500'
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const safeTags = Array.isArray(tags) ? tags : [];

  return (
    <Card className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white via-white to-gray-50/50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900/50 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient overlay */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${getCategoryColor(category)} opacity-5 dark:opacity-10 rounded-full blur-2xl`}></div>
        
        {/* Animated shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-gray-300/5 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>

      <CardContent className="p-6 relative">
        {/* Header with enhanced design */}
        <div className="flex items-start justify-between mb-4">
          <div className={`relative p-3 rounded-2xl bg-gradient-to-r ${getCategoryColor(category)} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
            <div className="w-4 h-4 bg-white/90 rounded-full"></div>
            
            {/* Glow effect */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${getCategoryColor(category)} opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-300`}></div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Popularity indicator */}
            {popularity > 80 && (
              <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-semibold">
                <Sparkles className="h-3 w-3" />
                <span>Popular</span>
              </div>
            )}
            
            <button
              onClick={handleFavorite}
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full hover:scale-110"
            >
              <Heart className={`h-4 w-4 transition-colors ${
                isFavorite 
                  ? 'text-red-500 fill-current' 
                  : 'text-gray-400 dark:text-gray-500 hover:text-red-500'
              }`} />
            </button>
          </div>
        </div>

        {/* Content with enhanced typography */}
        <div className="mb-6">
          <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight tracking-tight">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 leading-relaxed font-medium">
            {description}
          </p>
        </div>

        {/* Enhanced tags section */}
        {safeTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {safeTags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 text-gray-600 dark:text-gray-300 text-xs rounded-full font-semibold border border-gray-200/50 dark:border-gray-600/50 hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
              >
                #{tag}
              </span>
            ))}
            {safeTags.length > 3 && (
              <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full font-semibold">
                +{safeTags.length - 3} mais
              </span>
            )}
          </div>
        )}

        {/* Enhanced meta info */}
        <div className="flex items-center justify-between mb-6 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span className="font-medium">{estimatedTime}</span>
            </div>
            {popularity > 0 && (
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span className="font-medium">{popularity}%</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3 text-amber-500" />
            <span className="font-medium text-amber-600 dark:text-amber-400">IA Ready</span>
          </div>
        </div>

        {/* Enhanced badges */}
        <div className="flex items-center gap-3 mb-6">
          <Badge variant="outline" className={`text-xs font-bold border-2 ${getCategoryColor(category).replace('from-', 'border-').replace(' to-blue-600', '').replace(' to-emerald-600', '').replace(' to-violet-600', '').replace(' to-red-500', '').replace(' to-purple-600', '').replace(' to-rose-600', '').replace(' to-cyan-600', '').replace(' to-blue-500', '')} text-white bg-gradient-to-r ${getCategoryColor(category)} shadow-sm`}>
            {category}
          </Badge>
          <Badge variant="outline" className={`text-xs font-bold border ${getLevelColor(level)}`}>
            {level}
          </Badge>
        </div>

        {/* Enhanced action buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleCopyPrompt}
            size="sm"
            className="flex-1 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group/btn"
          >
            <Copy className="h-4 w-4 mr-2 group-hover/btn:rotate-12 transition-transform duration-300" />
            Copiar
          </Button>
          
          <Button
            onClick={() => onViewDetails(id)}
            size="sm"
            variant="outline"
            className="border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600 font-bold transition-all duration-300 hover:scale-105 hover:border-gray-300 dark:hover:border-gray-600 group/btn"
          >
            <Eye className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
            Ver
          </Button>
        </div>

        {/* Bottom accent line */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${getCategoryColor(category)} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
      </CardContent>
    </Card>
  );
};