"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, UserCheck, UserX } from 'lucide-react';

interface UserStatsCardsProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
    suspended: number;
  };
}

export const UserStatsCards: React.FC<UserStatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#0F1115]">{stats.total}</div>
              <div className="text-sm text-gray-600">Total de Usuários</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#0F1115]">{stats.active}</div>
              <div className="text-sm text-gray-600">Usuários Ativos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <UserX className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#0F1115]">{stats.inactive}</div>
              <div className="text-sm text-gray-600">Usuários Inativos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <UserX className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#0F1115]">{stats.suspended}</div>
              <div className="text-sm text-gray-600">Usuários Suspensos</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};