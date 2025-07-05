"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Copy, 
  Eye, 
  Clock, 
  Heart, 
  Sparkles,
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
  Activity,
  Code,
  Scale,
  Package,
  Truck,
  CheckCircle,
  Rocket,
  Leaf
} from 'lucide-react';
import { toast } from 'sonner';
import { useCommands } from '@/contexts/commands-context';

interface CommandListItemProps {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'iniciante' | 'intermediário' | 'avançado';
  prompt: string;
  tags?: string[];
  estimatedTime?: string;
  onViewDetails: (id: string) => void;
}

export const CommandListItem: React.FC<CommandListItemProps> = ({
  id,
  title,
  description,
  category,
  level,
  prompt,
  tags = [],
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
      toast.success('Prompt copiado!');
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
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300';
      case 'intermediário':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'avançado':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
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
      'Operações': 'from-cyan-500 to-blue-500',
      'Tecnologia': 'from-slate-500 to-gray-600',
      'Jurídico': 'from-amber-600 to-yellow-600',
      'Produção': 'from-red-600 to-orange-600',
      'Logística': 'from-blue-600 to-indigo-600',
      'Qualidade': 'from-emerald-600 to-green-600',
      'Inovação': 'from-violet-500 to-purple-500',
      'Sustentabilidade': 'from-green-600 to-emerald-700'
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
      'Operações': Activity,
      'Tecnologia': Code,
      'Jurídico': Scale,
      'Produção': Package,
      'Logística': Truck,
      'Qualidade': CheckCircle,
      'Inovação': Rocket,
      'Sustentabilidade': Leaf
    };
    return icons[category as keyof typeof icons] || Target;
  };

  const CategoryIcon = getCategoryIcon(category);

  return (
    <Card 
      className="group cursor-pointer border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 overflow-hidden"
      onClick={() => onViewDetails(id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-r ${getCategoryColor(category)} shadow-md group-hover:scale-105 transition-transform duration-300`}>
            <CategoryIcon className="h-5 w-5 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {title}
              </h3>
              
              <button
                onClick={handleFavorite}
                className="flex-shrink-0 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Heart className={`h-4 w-4 ${
                  isFavorite 
                    ? 'text-red-500 fill-current' 
                    : 'text-gray-400 dark:text-gray-500 hover:text-red-500'
                }`} />
              </button>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
              {description}
            </p>

            {/* Badges */}
            <div className="flex items-center gap-2 mb-3">
              <Badge className={`text-xs font-bold text-white bg-gradient-to-r ${getCategoryColor(category)}`}>
                {category}
              </Badge>
              <Badge className={`text-xs font-bold ${getLevelColor(level)}`}>
                {level}
              </Badge>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
                {tags.length > 3 && (
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                    +{tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="h-3 w-3" />
                <span>{estimatedTime}</span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleCopyPrompt}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-8"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copiar
                </Button>
                
                <Button
                  onClick={() => onViewDetails(id)}
                  size="sm"
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs px-3 py-1 h-8"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Ver
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};