"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface CommandCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'iniciante' | 'intermediário' | 'avançado';
  prompt: string;
  onViewDetails: (id: string) => void;
}

export const CommandCard: React.FC<CommandCardProps> = ({
  id,
  title,
  description,
  category,
  level,
  prompt,
  onViewDetails,
}) => {
  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      toast.success('Prompt copiado para a área de transferência!');
    } catch (error) {
      toast.error('Erro ao copiar prompt');
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'iniciante':
        return 'bg-green-100 text-green-800';
      case 'intermediário':
        return 'bg-yellow-100 text-yellow-800';
      case 'avançado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200 border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold text-[#0F1115] line-clamp-2">
            {title}
          </CardTitle>
          <Badge variant="secondary" className="bg-[#2563EB] text-white text-xs">
            {category}
          </Badge>
        </div>
        <CardDescription className="text-gray-600 line-clamp-3">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <Badge className={`text-xs ${getLevelColor(level)}`}>
            {level}
          </Badge>
          
          <div className="flex gap-2">
            <Button
              onClick={handleCopyPrompt}
              size="sm"
              className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0F1115] font-medium"
            >
              <Copy className="h-4 w-4 mr-1" />
              Copiar
            </Button>
            
            <Button
              onClick={() => onViewDetails(id)}
              size="sm"
              variant="outline"
              className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white"
            >
              <Eye className="h-4 w-4 mr-1" />
              Detalhes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};