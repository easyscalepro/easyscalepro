"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { UserPlus, Save, Eye, EyeOff, RefreshCw, CheckCircle, Database } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useUsers } from '@/contexts/users-context';

export const ImprovedUserCreator: React.FC = () => {
  const { refreshUsers } = useUsers();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user' | 'moderator',
    status: 'ativo' as 'ativo' | 'inativo' | 'suspenso',
    company: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [createWithAuth, setCreateWithAuth] = useState(true);
  const [creating, setCreating] = useState(false);

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.random() * chars.length);
    }
    setFormData({...formData, password});
    toast.success('Senha gerada automaticamente!');
  };

  const createUserDirect = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Nome e email são obrigatórios');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Email inválido');
      return;
    }

    if (createWithAuth && !formData.password.trim()) {
      toast.error('Senha é obrigatória quando criar com autenticação está ativado');
      return;
    }

    setCreating(true);

    try {
      console.log('🚀 Criando usuário direto:', formData.email);
      toast.loading('Criando usuário...', { id: 'create-user' });

      // Verificar se email já existe
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', formData.email)
        .single();

      if (existingProfile) {
        toast.dismiss('create-user');
        toast.error('Este email já está cadastrado');
        return;
      }

      let userId = '';
      let authCreated = false;
      let profileCreated = false;

      // Se criar com autenticação está ativado, tentar criar no Auth
      if (createWithAuth && formData.password) {
        try {
          console.log('🔐 Tentando criar no Auth...');
          
          // Salvar sessão atual
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          
          // Tentar Admin API primeiro
          try {
            const { data: adminUser, error: adminError } = await supabase.auth.admin.createUser({
              email: formData.email,
              password: formData.password,
              email_confirm: true,
              user_metadata: {
                name: formData.name,
                company: formData.company,
                phone: formData.phone
              }
            });

            if (!adminError && adminUser.user) {
              userId = adminUser.user.id;
              authCreated = true;
              console.log('✅ Usuário criado via Admin API');
            }
          } catch (adminError) {
            console.warn('⚠️ Admin API falhou, tentando signup...');
            
            // Fallback para signup
            const { data: signupData, error: signupError } = await supabase.auth.signUp({
              email: formData.email,
              password: formData.password,
              options: {
                data: {
                  name: formData.name,
                  company: formData.company,
                  phone: formData.phone
                }
              }
            });

            if (!signupError && signupData.user) {
              userId = signupData.user.id;
              authCreated = true;
              console.log('✅ Usuário criado via signup');
              
              // Restaurar sessão admin
              await supabase.auth.signOut();
              if (currentSession) {
                await supabase.auth.setSession(currentSession);
              }
            }
          }
        } catch (authError) {
          console.warn('⚠️ Criação no Auth falhou:', authError);
        }
      }

      // Se não conseguiu criar no Auth ou não quer criar com Auth, gerar ID único
      if (!userId) {
        userId = crypto.randomUUID();
        console.log('📝 Usando ID gerado para perfil apenas');
      }

      // Criar perfil na tabela profiles (SEMPRE)
      console.log('👤 Criando perfil na tabela profiles...');
      
      const profileData = {
        id: userId,
        email: formData.email,
        name: formData.name,
        role: formData.role,
        status: formData.status,
        company: formData.company || null,
        phone: formData.phone || null,
        commands_used: 0,
        last_access: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: profileResult, error: profileError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (profileError) {
        console.error('❌ Erro ao criar perfil:', profileError);
        
        // Mensagem de erro mais detalhada e clara
        let errorMessage = 'Erro ao salvar perfil na tabela profiles do Supabase';
        
        if (profileError.message) {
          if (profileError.message.includes('duplicate key')) {
            errorMessage = 'Este usuário já existe na tabela profiles';
          } else if (profileError.message.includes('permission')) {
            errorMessage = 'Sem permissão para criar perfil na tabela profiles';
          } else if (profileError.message.includes('violates')) {
            errorMessage = 'Dados inválidos para criação do perfil';
          } else {
            errorMessage = `Erro na tabela profiles: ${profileError.message}`;
          }
        }
        
        throw new Error(errorMessage);
      }

      profileCreated = true;
      console.log('✅ Perfil criado na tabela profiles:', profileResult);

      toast.dismiss('create-user');
      
      if (authCreated && createWithAuth) {
        toast.success('✅ Usuário criado com sucesso!', {
          description: `${formData.name} pode fazer login com: ${formData.email}`
        });
        
        // Mostrar credenciais
        setTimeout(() => {
          toast.info('📋 Credenciais de acesso:', {
            description: `Email: ${formData.email} | Senha: ${formData.password}`,
            duration: 15000
          });
        }, 1000);
      } else {
        toast.success('✅ Perfil criado com sucesso!', {
          description: `${formData.name} foi adicionado à plataforma`
        });
      }

      // Limpar formulário
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'user',
        status: 'ativo',
        company: '',
        phone: ''
      });

      // Atualizar lista
      await refreshUsers();

    } catch (error: any) {
      console.error('💥 Erro ao criar usuário:', error);
      toast.dismiss('create-user');
      
      // Tratamento de erro melhorado
      let userFriendlyMessage = 'Erro desconhecido ao criar usuário';
      
      if (error.message) {
        if (error.message.includes('já existe')) {
          userFriendlyMessage = 'Este email já está cadastrado no sistema';
        } else if (error.message.includes('permissão')) {
          userFriendlyMessage = 'Você não tem permissão para criar usuários';
        } else if (error.message.includes('profiles')) {
          userFriendlyMessage = 'Erro ao salvar dados na tabela de usuários';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          userFriendlyMessage = 'Erro de conexão. Verifique sua internet';
        } else {
          userFriendlyMessage = error.message;
        }
      }
      
      toast.error('❌ Falha na criação do usuário', {
        description: userFriendlyMessage
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
          <UserPlus className="h-5 w-5" />
          Criação Avançada de Usuário
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            Crie usuários com controle total sobre senha e configurações. Todos os dados são salvos na tabela profiles.
          </p>
          
          {/* Informações básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="advName">Nome Completo *</Label>
              <Input
                id="advName"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="João Silva"
                disabled={creating}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="advEmail">Email *</Label>
              <Input
                id="advEmail"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="joao@empresa.com"
                disabled={creating}
              />
            </div>
          </div>

          {/* Configurações de função e status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({...formData, status: value as any})}
                disabled={creating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="suspenso">Suspenso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Informações adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="advCompany">Empresa</Label>
              <Input
                id="advCompany"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                placeholder="Nome da empresa"
                disabled={creating}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="advPhone">Telefone</Label>
              <Input
                id="advPhone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="(11) 99999-9999"
                disabled={creating}
              />
            </div>
          </div>

          {/* Configuração de autenticação */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Label className="text-sm font-semibold">Criar com Autenticação</Label>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Se ativado, o usuário poderá fazer login na plataforma
                </p>
              </div>
              <Switch
                checked={createWithAuth}
                onCheckedChange={setCreateWithAuth}
                disabled={creating}
              />
            </div>

            {createWithAuth && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="advPassword">Senha Personalizada</Label>
                  <Button
                    type="button"
                    onClick={generatePassword}
                    size="sm"
                    variant="ghost"
                    className="text-xs text-blue-600 hover:text-blue-700"
                    disabled={creating}
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Gerar
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    id="advPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Digite a senha desejada (sem regras)"
                    disabled={creating}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={creating}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Você pode usar qualquer senha, sem restrições de comprimento ou caracteres especiais
                </p>
              </div>
            )}
          </div>

          {/* Botão de criação */}
          <div className="flex items-center gap-3">
            <Button
              onClick={createUserDirect}
              disabled={creating || !formData.name.trim() || !formData.email.trim() || (createWithAuth && !formData.password.trim())}
              className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
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
          </div>

          {/* Informações sobre salvamento */}
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <Database className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-xs text-blue-700 dark:text-blue-300">
                <strong>Salvamento Garantido:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Todos os dados são salvos na tabela <code>profiles</code> do Supabase</li>
                  <li>• Se "Criar com Autenticação" estiver ativo, também cria no sistema de auth</li>
                  <li>• Senha pode ter qualquer formato - sem regras ou validações</li>
                  <li>• Perfil é criado mesmo se a autenticação falhar</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};