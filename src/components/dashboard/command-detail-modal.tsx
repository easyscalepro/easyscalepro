"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useCommands } from '@/contexts/commands-context';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Copy,
  Heart,
  Eye,
  Clock,
  Star,
  Tag,
  TrendingUp,
  Zap,
  BookOpen,
  Target,
  Lightbulb,
  BarChart3,
  DollarSign,
  Crown,
  Trophy,
  Headphones,
  Award,
  Activity,
  Code,
  Scale,
  Package,
  Truck,
  CheckCircle,
  Rocket,
  Leaf,
  X,
  Share2,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

interface CommandDetailModalProps {
  commandId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CommandDetailModal: React.FC<CommandDetailModalProps> = ({
  commandId,
  isOpen,
  onClose,
}) => {
  const { commands, favorites = [], toggleFavorite, incrementCopies, incrementViews } = useCommands();
  const isMobile = useIsMobile();
  const [command, setCommand] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isFavorite = favorites.includes(commandId);

  useEffect(() => {
    if (isOpen && commandId) {
      loadCommand();
    }
  }, [isOpen, commandId]);

  const loadCommand = async () => {
    setLoading(true);
    try {
      const foundCommand = commands.find(cmd => cmd.id === commandId);
      if (foundCommand) {
        setCommand(foundCommand);
        // Incrementar visualizações
        await incrementViews(commandId);
      }
    } catch (error) {
      console.error('Erro ao carregar comando:', error);
      toast.error('Erro ao carregar detalhes do comando');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPrompt = async () => {
    if (!command?.prompt) {
      toast.error('Prompt não disponível');
      return;
    }

    try {
      await navigator.clipboard.writeText(command.prompt);
      await incrementCopies(commandId);
      toast.success('Prompt copiado!', {
        description: 'O comando foi copiado para sua área de transferência'
      });
    } catch (error) {
      console.error('Erro ao copiar:', error);
      toast.error('Erro ao copiar prompt');
    }
  };

  const handleFavorite = () => {
    toggleFavorite(commandId);
    toast.success(
      isFavorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos'
    );
  };

  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'iniciante':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'intermediário':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
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

  if (!command && !loading) {
    return null;
  }

  const CategoryIcon = command ? getCategoryIcon(command.category_name) : Target;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isMobile ? 'w-[95vw] max-w-[95vw] h-[90vh]' : 'max-w-4xl max-h-[90vh]'} overflow-hidden p-0`}>
        <div className="flex flex-col h-full">
          {loading ? (
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 dark:text-gray-400">Carregando detalhes...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <DialogHeader className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`p-3 sm:p-4 rounded-xl bg-gradient-to-r ${getCategoryColor(command.category_name)} shadow-lg`}>
                    <CategoryIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                      {command.title}
                    </DialogTitle>
                    <DialogDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
                      {command.description}
                    </DialogDescription>
                    
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
                      <Badge className={`text-xs font-bold border-2 text-white bg-gradient-to-r ${getCategoryColor(command.category_name)}`}>
                        {command.category_name}
                      </Badge>
                      <Badge variant="outline" className={`text-xs font-bold border ${getLevelColor(command.level)}`}>
                        {command.level}
                      </Badge>
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {command.estimated_time}
                      </Badge>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-center mb-1 sm:mb-2">
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                      {command.views || 0}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Visualizações
                    </div>
                  </div>
                  
                  <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-center mb-1 sm:mb-2">
                      <Copy className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                      {command.copies || 0}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Cópias
                    </div>
                  </div>
                  
                  <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-center mb-1 sm:mb-2">
                      <Star className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                      {command.popularity || 0}%
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Popularidade
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {command.tags && Array.isArray(command.tags) && command.tags.length > 0 && (
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {command.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Usage Instructions */}
                {command.usage_instructions && (
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Instruções de Uso
                    </h3>
                    <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                        {command.usage_instructions}
                      </p>
                    </div>
                  </div>
                )}

                {/* Prompt */}
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Prompt do Comando
                  </h3>
                  <div className="relative">
                    <Textarea
                      value={command.prompt}
                      readOnly
                      className="min-h-[120px] sm:min-h-[150px] text-sm sm:text-base font-mono bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 resize-none"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0 text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        IA Ready
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6 bg-gray-50 dark:bg-gray-800">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button
                    onClick={handleCopyPrompt}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 h-10 sm:h-12"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar Prompt
                  </Button>
                  
                  <Button
                    onClick={handleFavorite}
                    variant="outline"
                    className={`border-2 font-bold transition-all duration-300 h-10 sm:h-12 ${
                      isFavorite
                        ? 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-600 dark:bg-red-900/30 dark:text-red-400'
                        : 'border-gray-300 hover:border-red-300 hover:bg-red-50 hover:text-red-700 dark:border-gray-600 dark:hover:border-red-600'
                    }`}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                    {isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};