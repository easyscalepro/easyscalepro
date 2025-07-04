"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Copy, 
  Eye, 
  Clock, 
  TrendingUp, 
  Heart, 
  Sparkles, 
  Zap, 
  Star,
  BarChart3,
  DollarSign,
  Users,
  ShoppingCart,
  Compass,
  MessageCircle,
  UserCheck,
  Settings,
  Target,
  PieChart,
  Crown,
  Trophy,
  Lightbulb,
  Headphones,
  Award,
  Activity
} from 'lucide-react';
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

  const getCategoryIcon = (category: string) => {
    const icons = {
      'Marketing': BarChart3,
      'Finanças': DollarSign,
      'Gestão': Crown,
      'Vendas': Trophy,
      'Estratégia': Lightbulb,
      'Atendimento': Headphones,
      'Recursos Humanos': Award,
      'Operações': Activity
    };
    return icons[category as keyof typeof icons] || Target;
  };

  const safeTags = Array.isArray(tags) ? tags : [];
  const CategoryIcon = getCategoryIcon(category);

  return (
    <Card className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white via-white to-gray-50/50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900/50 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient overlay */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${getCategoryColor(category)} opacity-5 dark:opacity-10 rounded-full blur-2xl`}></div>
        
        {/* Animated shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-gray-300/5 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>

      <CardContent className="p-0 relative">
        {/* Enhanced Header Section */}
        <div className="flex flex-col space-y-4 p-6 relative bg-gradient-to-br from-gray-50/50 via-white/30 to-transparent dark:from-gray-700/30 dark:via-gray-800/20 dark:to-transparent border-b border-gray-100/50 dark:border-gray-700/50">
          {/* Decorative elements for header */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-200/50 dark:via-gray-600/50 to-transparent"></div>
          <div className="absolute top-2 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
            <Sparkles className="h-4 w-4 text-gray-400 dark:text-gray-500 animate-pulse" />
          </div>

          {/* Top row with enhanced icon and actions */}
          <div className="flex items-start justify-between">
            <div className={`relative p-4 rounded-2xl bg-gradient-to-r ${getCategoryColor(category)} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
              {/* Main category icon */}
              <CategoryIcon className="h-6 w-6 text-white drop-shadow-lg relative z-10" />
              
              {/* Decorative elements */}
              <div className="absolute top-1 right-1 w-2 h-2 bg-white/40 rounded-full"></div>
              <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-white/30 rounded-full"></div>
              
              {/* Glow effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${getCategoryColor(category)} opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300`}></div>
              
              {/* Pulse ring */}
              <div className={`absolute inset-0 rounded-2xl border-2 border-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300`}></div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Popularity indicator */}
              {popularity > 80 && (
                <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-bold border border-amber-200/50 dark:border-amber-700/50 shadow-sm">
                  <Star className="h-3 w-3 fill-current" />
                  <span>Popular</span>
                </div>
              )}
              
              <button
                onClick={handleFavorite}
                className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full hover:scale-110 relative"
              >
                <Heart className={`h-4 w-4 transition-colors ${
                  isFavorite 
                    ? 'text-red-500 fill-current' 
                    : 'text-gray-400 dark:text-gray-500 hover:text-red-500'
                }`} />
                {isFavorite && (
                  <div className="absolute inset-0 bg-red-500/20 rounded-full blur-md"></div>
                )}
              </button>
            </div>
          </div>

          {/* Title and description with enhanced typography */}
          <div className="space-y-3">
            <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight tracking-tight relative">
              {title}
              {/* Subtle underline decoration */}
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-500"></div>
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 leading-relaxed font-medium">
              {description}
            </p>
          </div>

          {/* Category and level badges */}
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={`text-xs font-bold border-2 text-white bg-gradient-to-r ${getCategoryColor(category)} shadow-sm hover:shadow-md transition-shadow duration-300`}>
              {category}
            </Badge>
            <Badge variant="outline" className={`text-xs font-bold border ${getLevelColor(level)} hover:scale-105 transition-transform duration-300`}>
              {level}
            </Badge>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          {/* Enhanced tags section */}
          {safeTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {safeTags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 text-gray-600 dark:text-gray-300 text-xs rounded-full font-semibold border border-gray-200/50 dark:border-gray-600/50 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-300 hover:scale-105"
                >
                  #{tag}
                </span>
              ))}
              {safeTags.length > 3 && (
                <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full font-semibold border border-blue-200/50 dark:border-blue-700/50">
                  +{safeTags.length - 3} mais
                </span>
              )}
            </div>
          )}

          {/* Enhanced meta info */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 dark:bg-gray-800 rounded-full">
                <Clock className="h-3 w-3" />
                <span className="font-medium">{estimatedTime}</span>
              </div>
              {popularity > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 dark:bg-gray-800 rounded-full">
                  <TrendingUp className="h-3 w-3" />
                  <span className="font-medium">{popularity}%</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-full border border-amber-200/50 dark:border-amber-700/50">
              <Zap className="h-3 w-3 text-amber-500" />
              <span className="font-medium text-amber-600 dark:text-amber-400">IA Ready</span>
            </div>
          </div>

          {/* Enhanced action buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleCopyPrompt}
              size="sm"
              className="flex-1 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group/btn relative overflow-hidden"
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
              <Copy className="h-4 w-4 mr-2 group-hover/btn:rotate-12 transition-transform duration-300 relative z-10" />
              <span className="relative z-10">Copiar</span>
            </Button>
            
            <Button
              onClick={() => onViewDetails(id)}
              size="sm"
              variant="outline"
              className="border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600 font-bold transition-all duration-300 hover:scale-105 hover:border-gray-300 dark:hover:border-gray-600 group/btn relative overflow-hidden"
            >
              <Eye className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
              Ver
            </Button>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${getCategoryColor(category)} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
      </CardContent>
    </Card>
  );
};