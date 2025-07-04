"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCommands } from '@/contexts/commands-context';

export const RecentActivity: React.FC = () => {
  const { commands } = useCommands();
  
  // Pegar os comandos mais recentes baseado na data de criação
  const recentCommands = commands
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const activities = recentCommands.map((cmd, index) => ({
    id: cmd.id,
    type: index % 2 === 0 ? 'copy' : 'view',
    user: `usuario${index + 1}@empresa.com`,
    command: cmd.title,
    timestamp: `${(index + 1) * 15} min atrás`
  }));

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
                {activity.timestamp}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};