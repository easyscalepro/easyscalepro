"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Calendar, Activity, Trophy, Save, Eye, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/auth-provider';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'João Silva',
    email: user?.email || '',
    company: 'Empresa Exemplo Ltda',
    position: 'CEO',
    joinedAt: '2024-01-10'
  });

  // Mock data para estatísticas
  const stats = {
    commandsUsed: 45,
    favoriteCommands: 12,
    totalViews: 234,
    streak: 7
  };

  const recentActivity = [
    { action: 'Copiou', command: 'Estratégia de Marketing Digital', date: '2024-01-20' },
    { action: 'Favoritou', command: 'Análise Financeira Mensal', date: '2024-01-19' },
    { action: 'Visualizou', command: 'Gestão de Equipe Remota', date: '2024-01-18' },
    { action: 'Copiou', command: 'Script de Vendas', date: '2024-01-17' }
  ];

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Perfil atualizado com sucesso!');
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Copiou':
        return <Copy className="h-4 w-4 text-[#FBBF24]" />;
      case 'Favoritou':
        return <Trophy className="h-4 w-4 text-red-500" />;
      case 'Visualizou':
        return <Eye className="h-4 w-4 text-[#2563EB]" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header do perfil */}
      <Card className="dark:bg-gray-800">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#2563EB] to-[#FBBF24] rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#0F1115] dark:text-gray-100">{profile.name}</h1>
              <p className="text-gray-600 dark:text-gray-300">{profile.position} • {profile.company}</p>
              <div className="flex items-center gap-2 mt-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Membro desde {profile.joinedAt}
                </span>
              </div>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white"
            >
              {isEditing ? 'Cancelar' : 'Editar Perfil'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações do perfil */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-[#2563EB]" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={profile.email}
                    disabled
                    className="bg-gray-50 dark:bg-gray-700"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input
                    id="company"
                    value={profile.company}
                    onChange={(e) => setProfile({...profile, company: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Cargo</Label>
                  <Input
                    id="position"
                    value={profile.position}
                    onChange={(e) => setProfile({...profile, position: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSave}
                    className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0F1115]"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Atividade recente */}
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#2563EB]" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    {getActionIcon(activity.action)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#0F1115] dark:text-gray-100">
                        {activity.action} "{activity.command}"
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estatísticas */}
        <div className="space-y-6">
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-[#2563EB]" />
                Estatísticas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-br from-[#2563EB] to-[#FBBF24] rounded-lg text-white">
                <div className="text-2xl font-bold">{stats.commandsUsed}</div>
                <div className="text-sm opacity-90">Comandos Utilizados</div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Favoritos</span>
                  <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                    {stats.favoriteCommands}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Visualizações</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {stats.totalViews}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Sequência</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    {stats.streak} dias
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conquistas */}
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-[#FBBF24]" />
                Conquistas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <Trophy className="h-6 w-6 text-[#FBBF24]" />
                <div>
                  <p className="text-sm font-medium text-[#0F1115] dark:text-gray-100">Primeiro Comando</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Copiou seu primeiro comando</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <Trophy className="h-6 w-6 text-[#2563EB]" />
                <div>
                  <p className="text-sm font-medium text-[#0F1115] dark:text-gray-100">Explorador</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Visualizou 50+ comandos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};