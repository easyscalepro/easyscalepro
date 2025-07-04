"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: '1',
      type: 'copy',
      user: 'joão@empresa.com',
      command: 'Estratégia de Marketing Digital',
      timestamp: new Date(Date.now() - 1000 * 60 * 15) // 15 min ago
    },
    {
      id: '2',
      type: 'view',
      user: 'maria@startup.com',
      command: 'Análise Financeira Mensal',
      timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 min ago
    },
    {
      id: '3',
      type: 'copy',
      user: 'pedro@pme.com',
      command: 'Script de Vendas Persuasivo',
      timestamp: new Date(Date.now() - 1000 * 60 * 45) // 45 min ago
    },
    {
      id: '4',
      type: 'view',
      user: 'ana@negocio.com',
      command: 'Gestão de Equipe Remota',
      timestamp: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
    }
  ];

  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'copy':
        return <Badge className="bg-[#FBBF24] text-[#0F1115]">Copiado</Badge>;
      case 'view':
        return <Badge variant="outline" className="border-[#2563EB] text-[#2563EB]">Visualizado</Badge>;
      default:
        return <Badge variant="secondary">Ação</Badge>;
    }
  };

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[#0F1115]">
          Atividade Recente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {getActivityBadge(activity.type)}
                  <span className="text-sm font-medium text-[#0F1115]">
                    {activity.command}
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  por {activity.user}
                </p>
              </div>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(activity.timestamp, { 
                  addSuffix: true, 
                  locale: ptBR 
                })}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};