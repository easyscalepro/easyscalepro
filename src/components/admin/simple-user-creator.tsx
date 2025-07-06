"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Save, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useUsers } from '@/contexts/users-context';

export const SimpleUserCreator: React.FC = () => {
  const { refreshUsers } = useUsers();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user' as 'admin' | 'user' | 'moderator'
  });
  const [creating, setCreating] = useState(false);

  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
  };

  const createSimpleUser = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Nome e email são obrigatórios');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Email inválido');
      return;
    }

    setCreating(true);

    try {
      console.log('🚀 Criando usuário simples:', formData.email);
      toast.loading('Criando usuário...', { id: 'simple-create' });

      // Verificar se email já existe
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', formData.email)
        .single();

      if (existingProfile) {
        toast.dismiss('simple-create');
        toast.error('Este email já está cadastrado');
        return;
      }

      // Gerar senha aleatória
      const password = generateRandomPassword();

      // Tentar criar com signup primeiro
      let userCreated = false;
      let userId = '';
      let authMethod = '';

      try {
        console.log('📝 Tentando signup...');
        
        // Salvar sessão atual
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
          email: formData.email,
          password: password,
          options: {
            data: {
              name: formData.name
            }
          }
        });

        if (!signupError && signupData.user) {
          userId = signupData.user.id;
          userCreated = true;
          authMethod = 'signup';
          console.log('✅ Usuário criado via signup');
          
          // Restaurar sessão admin
          await supabase.auth.signOut();
          if (currentSession) {
            await supabase.auth.setSession(currentSession);
          }
        }
      } catch (signupError) {
        console.warn('⚠️ Signup falhou:', signupError);
      }

      // Se signup falhou, criar apenas perfil
      if (!userCreated) {
        console.log('👤 Criando apenas perfil...');
        userId = crypto.randomUUID();
        authMethod = 'profile-only';
      }

      // Aguardar trigger (se houver)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Criar/atualizar perfil
      const profileData = {
        id: userId,
        email: formData.email,
        name: formData.name,
        role: formData.role,
        status: 'ativo' as const,
        commands_used: 0,
        last_access: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Verificar se perfil já existe (criado pelo trigger)
      const { data: existingProfileCheck } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (existingProfileCheck) {
        // Atualizar perfil existente
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            name: formData.name,
            role: formData.role,
            status: 'ativo',
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (updateError) {
          throw updateError;
        }
        console.log('✅ Perfil atualizado');
      } else {
        // Criar novo perfil
        const { error: insertError } = await supabase
          .from('profiles')
          .insert(profileData);

        if (insertError) {
          throw insertError;
        }
        console.log('✅ Perfil criado');
      }

      toast.dismiss('simple-create');
      
      if (authMethod === 'signup') {
        toast.success('✅ Usuário criado com sucesso!', {
          description: `${formData.name} pode fazer login com a senha: ${password}`
        });
        
        // Mostrar credenciais por mais tempo
        setTimeout(() => {
          toast.info('📋 Credenciais de acesso:', {
            description: `Email: ${formData.email} | Senha: ${password}`,
            duration: 15000
          });
        }, 1000);
      } else {
        toast.success('✅ Perfil criado com sucesso!', {
          description: `${formData.name} foi adicionado à plataforma (sem autenticação)`
        });
      }

      // Limpar formulário
      setFormData({
        name: '',
        email: '',
        role: 'user'
      });

      // Atualizar lista
      await refreshUsers();

    } catch (error: any) {
      console.error('💥 Erro ao criar usuário:', error);
      toast.dismiss('simple-create');
      toast.error('❌ Erro ao criar usuário: ' + error.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
          <UserPlus className="h-5 w-5" />
          Criação Rápida de Usuário
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-green-700 dark:text-green-300 text-sm">
            Crie usuários rapidamente com senha gerada automaticamente. Funciona mesmo sem Admin API.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quickName">Nome *</Label>
              <Input
                id="quickName"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="João Silva"
                disabled={creating}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quickEmail">Email *</Label>
              <Input
                id="quickEmail"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="joao@empresa.com"
                disabled={creating}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Função</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => setFormData({...formData, role: value as any})}
                disabled={creating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="moderator">Moderador</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={createSimpleUser}
              disabled={creating || !formData.name.trim() || !formData.email.trim()}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {creating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Criando...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Criar Usuário
                </>
              )}
            </Button>
            
            <div className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Senha gerada automaticamente
            </div>
          </div>

          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-green-600 mt-0.5" />
              <div className="text-xs text-green-700 dark:text-green-300">
                <strong>Como funciona:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Tenta criar usuário completo com autenticação</li>
                  <li>• Se falhar, cria apenas o perfil na plataforma</li>
                  <li>• Senha é gerada automaticamente (8 caracteres)</li>
                  <li>• Credenciais são exibidas após criação</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};