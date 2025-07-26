"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Calendar, Mail, Building, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  phone: string | null;
  role: 'admin' | 'user' | 'moderator';
  status: 'ativo' | 'inativo' | 'suspenso';
  avatar_url: string | null;
  commands_used: number;
  last_access: string;
  created_at: string;
  updated_at: string;
}

const ActiveUsers: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActiveUsers();
  }, []);

  const fetchActiveUsers = async () => {
    try {
      console.log('🔍 Buscando usuários ativos...');
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('status', 'ativo')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('❌ Erro ao buscar usuários:', fetchError);
        setError('Erro ao carregar usuários ativos');
        return;
      }

      console.log('✅ Usuários ativos carregados:', data?.length || 0);
      setUsers(data || []);
    } catch (err) {
      console.error('💥 Erro inesperado:', err);
      setError('Erro inesperado ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'moderator':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'moderator':
        return 'Moderador';
      default:
        return 'Usuário';
    }
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Carregando usuários ativos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">❌</div>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchActiveUsers}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Nenhum usuário ativo encontrado</h3>
        <p className="text-muted-foreground">
          Não há usuários ativos cadastrados na plataforma no momento.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Usuários Ativos</h2>
        </div>
        <Badge variant="secondary" className="text-sm">
          {users.length} usuário{users.length !== 1 ? 's' : ''} ativo{users.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar_url || undefined} alt={user.name || user.email} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {getInitials(user.name, user.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">
                    {user.name || user.email.split('@')[0]}
                  </CardTitle>
                  <Badge className={`text-xs ${getRoleColor(user.role)}`}>
                    {getRoleLabel(user.role)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              
              {user.company && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{user.company}</span>
                </div>
              )}
              
              {user.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{user.phone}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span>
                  Cadastrado em {format(new Date(user.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                </span>
              </div>
              
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Comandos usados:</span>
                  <Badge variant="outline" className="text-xs">
                    {user.commands_used}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ActiveUsers;