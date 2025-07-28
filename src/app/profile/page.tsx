"use client";

import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth/auth-provider';
import { useIsMobile } from '@/hooks/use-mobile';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { supabase } from '@/lib/supabase';
import { 
  User, 
  Mail, 
  Building, 
  Phone, 
  Calendar, 
  Shield, 
  Edit3, 
  Save, 
  X,
  Crown,
  Star,
  Activity,
  BarChart3,
  Heart,
  Eye,
  Copy,
  Award,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

const ProfilePage: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const isMobile = useIsMobile();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalCommands: 0,
    favoriteCommands: 0,
    commandsCopied: 0,
    commandsViewed: 0
  });

  const [formData, setFormData] = useState({
    name: profile?.name || '',
    company: profile?.company || '',
    phone: profile?.phone || ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        company: profile.company || '',
        phone: profile.phone || ''
      });
    }
  }, [profile]);

  useEffect(() => {
    loadUserStats();
  }, [user]);

  const loadUserStats = async () => {
    if (!user) return;

    try {
      // Carregar estatísticas do usuário
      const [favoritesResponse, activitiesResponse] = await Promise.all([
        supabase
          .from('favorites')
          .select('id')
          .eq('user_id', user.id),
        supabase
          .from('user_activities')
          .select('activity_type')
          .eq('user_id', user.id)
      ]);

      const favoriteCommands = favoritesResponse.data?.length || 0;
      const activities = activitiesResponse.data || [];
      
      const commandsCopied = activities.filter(a => a.activity_type === 'copy').length;
      const commandsViewed = activities.filter(a => a.activity_type === 'view').length;

      setStats({
        totalCommands: 1000, // Total de comandos disponíveis na plataforma
        favoriteCommands,
        commandsCopied,
        commandsViewed
      });

    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        name: formData.name.trim(),
        company: formData.company.trim(),
        phone: formData.phone.trim()
      });

      setIsEditing(false);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      company: profile?.company || '',
      phone: profile?.phone || ''
    });
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const userStats = [
    {
      title: 'Comandos Disponíveis',
      value: stats.totalCommands.toLocaleString(),
      icon: Target,
      color: 'from-blue-500 to-blue-600',
      description: 'Total na plataforma'
    },
    {
      title: 'Favoritos',
      value: stats.favoriteCommands.toString(),
      icon: Heart,
      color: 'from-red-500 to-pink-600',
      description: 'Comandos salvos'
    },
    {
      title: 'Comandos Copiados',
      value: stats.commandsCopied.toString(),
      icon: Copy,
      color: 'from-green-500 to-emerald-600',
      description: 'Total de cópias'
    },
    {
      title: 'Comandos Visualizados',
      value: stats.commandsViewed.toString(),
      icon: Eye,
      color: 'from-purple-500 to-violet-600',
      description: 'Total de visualizações'
    }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <DashboardHeader />
        
        <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          {/* Header Section - Mobile Optimized */}
          <div className="mb-6 sm:mb-8 lg:mb-12">
            <div className="text-center sm:text-left space-y-2 sm:space-y-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 dark:text-gray-100 flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl shadow-lg">
                  <User className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
                </div>
                Meu Perfil
                {profile?.role === 'admin' && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-xs sm:text-sm">
                    <Crown className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Admin
                  </Badge>
                )}
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400">
                Gerencie suas informações pessoais e acompanhe suas estatísticas de uso.
              </p>
            </div>
          </div>

          {/* Stats Cards - Mobile Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-12">
            {userStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:-translate-y-1 bg-white dark:bg-gray-800">
                  <CardContent className="p-3 sm:p-4 lg:p-6">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {stat.value}
                      </p>
                      <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {stat.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                        {stat.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Profile Information - Mobile Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Main Profile Card */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
                <CardHeader className="pb-4 sm:pb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div>
                      <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Informações Pessoais
                      </CardTitle>
                      <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        Mantenha seus dados atualizados
                      </CardDescription>
                    </div>
                    
                    {!isEditing ? (
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    ) : (
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                          onClick={handleSave}
                          disabled={loading}
                          size="sm"
                          className="flex-1 sm:flex-none bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {loading ? 'Salvando...' : 'Salvar'}
                        </Button>
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          size="sm"
                          className="flex-1 sm:flex-none"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancelar
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 sm:space-y-6">
                  {/* Nome */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nome Completo
                    </Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Seu nome completo"
                        className="h-10 sm:h-12"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm sm:text-base text-gray-900 dark:text-gray-100">
                          {profile?.name || 'Não informado'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Email (readonly) */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      E-mail
                    </Label>
                    <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm sm:text-base text-gray-900 dark:text-gray-100">
                        {user?.email}
                      </span>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        Verificado
                      </Badge>
                    </div>
                  </div>

                  {/* Empresa */}
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Empresa
                    </Label>
                    {isEditing ? (
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        placeholder="Nome da sua empresa"
                        className="h-10 sm:h-12"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Building className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm sm:text-base text-gray-900 dark:text-gray-100">
                          {profile?.company || 'Não informado'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Telefone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Telefone
                    </Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="(11) 99999-9999"
                        className="h-10 sm:h-12"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm sm:text-base text-gray-900 dark:text-gray-100">
                          {profile?.phone || 'Não informado'}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Account Info Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Account Status */}
              <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                    Status da Conta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                      <Activity className="h-3 w-3 mr-1" />
                      Ativo
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tipo</span>
                    <Badge variant="outline" className="border-purple-300 text-purple-700 dark:border-purple-600 dark:text-purple-400">
                      <Shield className="h-3 w-3 mr-1" />
                      {profile?.role === 'admin' ? 'Administrador' : 'Usuário'}
                    </Badge>
                  </div>

                  {profile?.created_at && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Membro desde</span>
                      <div className="flex items-center gap-1 text-sm text-gray-900 dark:text-gray-100">
                        <Calendar className="h-3 w-3" />
                        {formatDate(profile.created_at)}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Usage Summary */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Award className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    Resumo de Uso
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center space-y-2">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {((stats.commandsCopied + stats.commandsViewed) / 10).toFixed(1)}%
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Engajamento com a plataforma
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Atividade</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {stats.commandsCopied + stats.commandsViewed} ações
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(((stats.commandsCopied + stats.commandsViewed) / 100) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;