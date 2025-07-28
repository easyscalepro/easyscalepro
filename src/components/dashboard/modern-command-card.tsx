"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
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
  const { favorites = [], toggleFavorite, incrementCopies } = useCommands();
  const isFavorite = favorites.includes(id);
  const isMobile = useIsMobile();

  const fallbackCopyTextToClipboard = (text: string): boolean => {
    try {
      console.log('📋 Usando método fallback (execCommand)');
      
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // Posicionar fora da tela mas ainda acessível
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      textArea.style.pointerEvents = 'none';
      textArea.style.width = '1px';
      textArea.style.height = '1px';
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      // Para iOS Safari
      textArea.setSelectionRange(0, 99999);
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        console.log('✅ Texto copiado usando execCommand');
        return true;
      } else {
        console.error('❌ execCommand retornou false');
        return false;
      }
    } catch (err) {
      console.error('❌ Erro no fallback execCommand:', err);
      return false;
    }
  };

  const copyToClipboard = async (text: string): Promise<boolean> => {
    // Verificar se o texto existe
    if (!text || text.trim() === '') {
      console.error('❌ Texto vazio para copiar');
      return false;
    }

    // Tentar método moderno apenas se disponível e não bloqueado
    if (navigator.clipboard && window.isSecureContext) {
      try {
        console.log('📋 Tentando navigator.clipboard');
        await navigator.clipboard.writeText(text);
        console.log('✅ Texto copiado usando navigator.clipboard');
        return true;
      } catch (err: any) {
        console.log('❌ navigator.clipboard falhou:', err.message);
        
        // Se for erro de política de permissões, usar fallback
        if (err.message.includes('permissions policy') || 
            err.message.includes('blocked') ||
            err.name === 'NotAllowedError') {
          console.log('🔄 Clipboard API bloqueada, usando fallback');
          return fallbackCopyTextToClipboard(text);
        }
        
        // Para outros erros, também tentar fallback
        console.log('🔄 Erro no clipboard, tentando fallback');
        return fallbackCopyTextToClipboard(text);
      }
    }
    
    // Se navigator.clipboard não estiver disponível, usar fallback diretamente
    console.log('📋 navigator.clipboard não disponível, usando fallback');
    return fallbackCopyTextToClipboard(text);
  };

  const handleCopyPrompt = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      console.log('📋 Iniciando cópia do prompt para comando:', id);
      console.log('📋 Tamanho do prompt:', prompt?.length || 0);
      
      if (!prompt || prompt.trim() === '') {
        toast.error('Prompt vazio ou inválido');
        return;
      }

      const success = await copyToClipboard(prompt);
      
      if (success) {
        // Incrementar contador de cópias
        await incrementCopies(id);
        
        toast.success('Prompt copiado!', {
          description: 'O comando foi copiado para sua área de transferência'
        });
        console.log('✅ Prompt copiado com sucesso');
      } else {
        // Se todos os métodos falharam, mostrar o prompt para cópia manual
        console.log('❌ Todos os métodos de cópia falharam');
        toast.error('Não foi possível copiar automaticamente', {
          description: 'Clique em "Ver" para copiar manualmente',
          duration: 5000
        });
      }
    } catch (error) {
      console.error('💥 Erro inesperado ao copiar prompt:', error);
      toast.error('Erro ao copiar prompt', {
        description: 'Clique em "Ver" para copiar manualmente'
      });
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

  // Garantir que tags seja sempre um array
  const safeTags = Array.isArray(tags) ? tags : [];
  const CategoryIcon = getCategoryIcon(category);

  return (
    <Card className="group cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-500 bg-gradient-to-br from-white via-white to-gray-50/50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900/50 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 hover:-translate-y-1 hover:scale-[1.02] overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient overlay */}
        <div className={`absolute top-0 right-0 w-20 sm:w-32 h-20 sm:h-32 bg-gradient-to-br ${getCategoryColor(category)} opacity-5 dark:opacity-10 rounded-full blur-2xl`}></div>
        
        {/* Animated shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-gray-300/5 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>

      <CardContent className="p-0 relative">
        {/* Enhanced Header Section */}
        <div className="flex flex-col space-y-3 sm:space-y-4 p-4 sm:p-6 relative bg-gradient-to-br from-gray-50/50 via-white/30 to-transparent dark:from-gray-700/30 dark:via-gray-800/20 dark:to-transparent border-b border-gray-100/50 dark:border-gray-700/50">
          {/* Decorative elements for header */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-200/50 dark:via-gray-600/50 to-transparent"></div>
          <div className="absolute top-2 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 dark:text-gray-500 animate-pulse" />
          </div>

          {/* Top row with enhanced icon and actions */}
          <div className="flex items-start justify-between">
            <div className={`relative p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r ${getCategoryColor(category)} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
              {/* Main category icon */}
              <CategoryIcon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white drop-shadow-lg relative z-10" />
              
              {/* Decorative elements */}
              <div className="absolute top-1 right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/40 rounded-full"></div>
              <div className="absolute bottom-1 left-1 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white/30 rounded-full"></div>
              
              {/* Glow effect */}
              <div className={`absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r ${getCategoryColor(category)} opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300`}></div>
              
              {/* Pulse ring */}
              <div className={`absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300`}></div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Popularity indicator */}
              {popularity > 80 && (
                <div className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-bold border border-amber-200/50 dark:border-amber-700/50 shadow-sm">
                  <Star className="h-2 w-2 sm:h-3 sm:w-3 fill-current" />
                  <span className="hidden sm:inline">Popular</span>
                </div>
              )}
              
              <button
                onClick={handleFavorite}
                className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full hover:scale-110 relative"
              >
                <Heart className={`h-3 w-3 sm:h-4 sm:w-4 transition-colors ${
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
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-base sm:text-lg lg:text-xl font-black text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight tracking-tight relative">
              {title}
              {/* Subtle underline decoration */}
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-500"></div>
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 leading-relaxed font-medium">
              {description}
            </p>
          </div>

          {/* Category and level badges */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Badge variant="outline" className={`text-xs font-bold border-2 text-white bg-gradient-to-r ${getCategoryColor(category)} shadow-sm hover:shadow-md transition-shadow duration-300`}>
              {category}
            </Badge>
            <Badge variant="outline" className={`text-xs font-bold border ${getLevelColor(level)} hover:scale-105 transition-transform duration-300`}>
              {level}
            </Badge>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          {/* Enhanced tags section */}
          {safeTags.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {safeTags.slice(0, isMobile ? 2 : 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 sm:px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 text-gray-600 dark:text-gray-300 text-xs rounded-full font-semibold border border-gray-200/50 dark:border-gray-600/50 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-300 hover:scale-105"
                >
                  #{tag}
                </span>
              ))}
              {safeTags.length > (isMobile ? 2 : 3) && (
                <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full font-semibold border border-blue-200/50 dark:border-blue-700/50">
                  +{safeTags.length - (isMobile ? 2 : 3)} mais
                </span>
              )}
            </div>
          )}

          {/* Enhanced meta info */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 dark:bg-gray-800 rounded-full">
                <Clock className="h-2 w-2 sm:h-3 sm:w-3" />
                <span className="font-medium text-xs">{estimatedTime}</span>
              </div>
              {popularity > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 dark:bg-gray-800 rounded-full">
                  <TrendingUp className="h-2 w-2 sm:h-3 sm:w-3" />
                  <span className="font-medium text-xs">{popularity}%</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-full border border-amber-200/50 dark:border-amber-700/50">
              <Zap className="h-2 w-2 sm:h-3 sm:w-3 text-amber-500" />
              <span className="font-medium text-amber-600 dark:text-amber-400 text-xs">IA Ready</span>
            </div>
          </div>

          {/* Enhanced action buttons */}
          <div className="flex gap-2 sm:gap-3 pt-2">
            <Button
              onClick={handleCopyPrompt}
              size="sm"
              className="flex-1 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group/btn relative overflow-hidden h-8 sm:h-9 text-xs sm:text-sm"
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
              <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 group-hover/btn:rotate-12 transition-transform duration-300 relative z-10" />
              <span className="relative z-10">Copiar</span>
            </Button>
            
            <Button
              onClick={() => onViewDetails(id)}
              size="sm"
              variant="outline"
              className="border-2 border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-800 dark:hover:text-blue-200 hover:border-blue-400 dark:hover:border-blue-500 font-bold transition-all duration-300 hover:scale-105 group/btn relative overflow-hidden h-8 sm:h-9 text-xs sm:text-sm"
            >
              <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
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