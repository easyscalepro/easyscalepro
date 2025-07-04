"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, Clock, TrendingUp, Heart } from 'lucide-react';
import { toast } from 'sonner';

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
  const handleCopyPrompt = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(prompt);
      toast.success('Prompt copiado!', {
        description: 'O comando foi copiado para sua área de transferência'
      });
    } catch (error) {
      toast.error('Erro ao copiar prompt');
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success('Adicionado aos favoritos!');
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'iniciante':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'intermediário':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'avançado':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
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
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  // Garantir que tags é sempre um array
  const safeTags = Array.isArray(tags) ? tags : [];

  return (
    <Card className="group cursor-pointer border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white hover:-translate-y-1">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-3 h-3 rounded-full ${getCategoryColor(category)} flex-shrink-0 mt-2`}></div>
          <button
            onClick={handleFavorite}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded-full"
          >
            <Heart className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Tags */}
        {safeTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {safeTags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium"
              >
                {tag}
              </span>
            ))}
            {safeTags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                +{safeTags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
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
          <Badge variant="outline" className="text-xs font-medium border-blue-200 text-blue-700 bg-blue-50">
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
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-sm"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copiar
          </Button>
          
          <Button
            onClick={() => onViewDetails(id)}
            size="sm"
            variant="outline"
            className="border-gray-200 text-gray-700 hover:bg-gray-50 font-medium"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};