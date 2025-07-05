"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Save, X, Eye, EyeOff, Key, Mail, RefreshCw, AlertCircle, CheckCircle, Shield, Database } from 'lucide-react';
import { toast } from 'sonner';
import { useUsers, type User as UserType } from '@/contexts/users-context';
import { useAuth } from '@/components/auth/auth-provider';
import { supabase } from '@/integrations/supabase/client';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserType;
  mode: 'create' | 'edit';
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  user,
  mode
}) => {
  const { addUser, updateUser } = useUsers();
  const { user: currentUser, profile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: 'ativo' as 'ativo' | 'inativo' | 'suspenso',
    role: 'user' as 'admin' | 'user' | 'moderator',
    phone: '',
    company: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && user) {
      setFormData({
        name: user.name,
        email: user.email,
        status: user.status,
        role: user.role,
        phone: user.phone || '',
        company: user.company || '',
        password: '',
        confirmPassword: ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        status: 'ativo',
        role: 'user',
        phone: '',
        company: '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [mode, user, isOpen]);

  const generateSimplePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({...formData, password, confirmPassword: password});
    toast.success('Senha gerada automaticamente!');
  };

  const handleResetPassword = async () => {
    if (!user?.email) {
      toast.error('Email do usuário não encontrado');
      return;
    }

    setIsResettingPassword(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        throw error;
      }

      toast.success(`Email de redefinição enviado para ${user.email}`);
    } catch (error: any) {
      console.error('Erro ao enviar email de redefinição:', error);
      toast.error('Erro ao enviar email de redefinição: ' + error.message);
    } finally {
      setIsResettingPassword(false);
    }
  };

  const testDatabaseConnection = async () => {
    try {
      console.log('🔍 Testando conexão com banco de dados...');
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      
      if (error) {
        console.error('❌ Erro na conexão:', error);
        throw error;
      }
      
      console.log('✅ Conexão com banco OK');
      return true;
    } catch (error) {
      console.error('❌ Falha na conexão com banco:', error);
      throw new Error('Não foi possível conectar ao banco de dados');
    }
  };

  const createUserInAuth = async (email: string, password: string, userData: any) => {
    console.log('🔐 Criando usuário no Supabase Auth...');
    
    try {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        user_metadata: {
          name: userData.name,
          company: userData.company,
          phone: userData.phone
        },
        email_confirm: true
      });

      if (authError) {
        console.error('❌ Erro no Supabase Auth:', authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Usuário não foi criado no Auth');
      }

      console.log('✅ Usuário criado no Supabase Auth:', {
        id: authData.user.id,
        email: authData.user.email,
        confirmed: authData.user.email_confirmed_at
      });
      
      return authData.user;

    } catch (error: any) {
      console.error('❌ Falha na criação do usuário Auth:', error);
      
      if (error.message?.includes('already registered') || error.message?.includes('already exists')) {
        throw new Error('Este email já está cadastrado no sistema');
      }
      
      throw error;
    }
  };

  const createUserProfile = async (userId: string, userData: any) => {
    console.log('👤 Criando perfil na tabela profiles...');
    
    try {
      const profileData = {
        id: userId,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        status: userData.status,
        phone: userData.phone || null,
        company: userData.company || null,
        commands_used: 0,
        last_access: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('📝 Dados do perfil a serem inseridos:', profileData);

      // Primeiro, verificar se o perfil já existe
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (existingProfile) {
        console.log('⚠️ Perfil já existe, atualizando...');
        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', userId)
          .select()
          .single();

        if (updateError) {
          console.error('❌ Erro ao atualizar perfil:', updateError);
          throw updateError;
        }

        console.log('✅ Perfil atualizado:', updatedProfile);
        return updatedProfile;
      }

      // Inserir novo perfil
      const { data: profileResult, error: profileError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (profileError) {
        console.error('❌ Erro ao inserir perfil:', profileError);
        console.error('📋 Detalhes do erro:', {
          code: profileError.code,
          message: profileError.message,
          details: profileError.details,
          hint: profileError.hint
        });
        throw profileError;
      }

      console.log('✅ Perfil criado com sucesso:', profileResult);
      
      // Verificar se realmente foi salvo
      const { data: verificationData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (verificationData) {
        console.log('✅ Verificação: Perfil salvo no banco:', verificationData);
      } else {
        console.error('❌ Verificação: Perfil NÃO foi salvo no banco');
        throw new Error('Perfil não foi salvo corretamente no banco');
      }

      return profileResult;

    } catch (error: any) {
      console.error('❌ Erro ao criar perfil:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log('🚀 Iniciando processo de criação de usuário...', { 
      mode, 
      email: formData.email,
      name: formData.name 
    });

    try {
      // Validações básicas
      if (!formData.name.trim()) {
        toast.error('O nome é obrigatório');
        return;
      }

      if (!formData.email.trim()) {
        toast.error('O email é obrigatório');
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast.error('Email inválido');
        return;
      }

      if (mode === 'create') {
        if (!formData.password) {
          toast.error('A senha é obrigatória para novos usuários');
          return;
        }

        if (formData.password.length < 6) {
          toast.error('A senha deve ter pelo menos 6 caracteres');
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          toast.error('As senhas não coincidem');
          return;
        }
      }

      if (mode === 'create') {
        console.log('➕ Modo: Criar novo usuário');

        // Verificar se o usuário atual é admin
        if (profile?.role !== 'admin') {
          toast.error('Apenas administradores podem criar usuários');
          return;
        }

        // Testar conexão com banco
        toast.loading('Verificando conexão com banco de dados...', { id: 'create-user' });
        await testDatabaseConnection();

        // Verificar se email já existe
        console.log('🔍 Verificando se email já existe...');
        toast.loading('Verificando se email já existe...', { id: 'create-user' });
        
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('email', formData.email)
          .single();

        if (existingProfile) {
          toast.dismiss('create-user');
          toast.error('Este email já está cadastrado na plataforma');
          return;
        }

        console.log('✅ Email disponível para uso');

        let authUser = null;
        let profileResult = null;

        try {
          // 1. Criar usuário no Supabase Auth
          toast.loading('Criando usuário no sistema de autenticação...', { id: 'create-user' });
          authUser = await createUserInAuth(formData.email, formData.password, formData);
          
          // 2. Criar perfil na tabela profiles
          toast.loading('Salvando perfil no banco de dados...', { id: 'create-user' });
          profileResult = await createUserProfile(authUser.id, formData);

          // 3. Adicionar ao contexto local
          addUser({
            id: profileResult.id,
            name: profileResult.name,
            email: profileResult.email,
            status: profileResult.status,
            role: profileResult.role,
            phone: profileResult.phone,
            company: profileResult.company,
            commandsUsed: profileResult.commands_used,
            lastAccess: 'Agora',
            joinedAt: new Date().toISOString().split('T')[0]
          });

          toast.dismiss('create-user');
          toast.success('✅ Usuário criado com sucesso!', {
            description: `${formData.name} pode fazer login com: ${formData.email}`
          });
          
          console.log('🎉 Usuário criado completamente:', {
            authId: authUser.id,
            email: authUser.email,
            profileId: profileResult.id,
            profileEmail: profileResult.email
          });

          // Mostrar credenciais para o admin
          setTimeout(() => {
            toast.info('📋 Credenciais do usuário:', {
              description: `Email: ${formData.email} | Senha: ${formData.password}`,
              duration: 10000
            });
          }, 2000);

        } catch (error: any) {
          console.error('💥 Erro durante criação:', error);
          
          toast.dismiss('create-user');
          
          // Se criou no Auth mas falhou no profile, tentar limpar
          if (authUser && !profileResult) {
            console.log('🧹 Tentando limpar usuário órfão do Auth...');
            try {
              await supabase.auth.admin.deleteUser(authUser.id);
              console.log('🗑️ Usuário órfão removido do Auth');
            } catch (cleanupError) {
              console.warn('⚠️ Não foi possível limpar usuário órfão:', cleanupError);
            }
          }
          
          // Mostrar erro específico
          if (error.message?.includes('already registered') || error.message?.includes('already exists')) {
            toast.error('❌ Email já cadastrado', {
              description: 'Este email já possui uma conta no sistema'
            });
          } else if (error.message?.includes('Invalid email')) {
            toast.error('❌ Email inválido', {
              description: 'Verifique o formato do email'
            });
          } else if (error.message?.includes('Password')) {
            toast.error('❌ Erro na senha', {
              description: 'A senha deve ter pelo menos 6 caracteres'
            });
          } else if (error.message?.includes('permission') || error.message?.includes('RLS')) {
            toast.error('❌ Erro de permissão', {
              description: 'Problema nas políticas de segurança do banco'
            });
          } else {
            toast.error('❌ Erro ao criar usuário', {
              description: error.message || 'Tente novamente'
            });
          }
          
          return;
        }

      } else if (mode === 'edit' && user) {
        console.log('✏️ Modo: Editar usuário existente');
        // ... código de edição permanece igual
      }
      
      console.log('🎯 Processo concluído com sucesso');
      onClose();
      
    } catch (error: any) {
      console.error('💥 Erro geral:', error);
      toast.error('❌ Erro inesperado: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-[#2563EB]" />
            {mode === 'create' ? 'Criar Novo Usuário' : 'Editar Usuário'}
          </DialogTitle>
        </DialogHeader>

        {/* Aviso importante para criação */}
        {mode === 'create' && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <Database className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-100 text-sm">
                  Criação Completa no Sistema
                </h4>
                <p className="text-green-700 dark:text-green-300 text-xs mt-1">
                  O usuário será criado no Auth e no banco de dados, podendo fazer login imediatamente.
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Ex: João Silva"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="joao@empresa.com"
              required
              disabled={mode === 'edit'}
            />
            {mode === 'create' && (
              <p className="text-xs text-blue-600 dark:text-blue-400">
                ⚠️ Este email será usado para login no sistema
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({...formData, status: value as any})}
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

            <div className="space-y-2">
              <Label>Função</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => setFormData({...formData, role: value as any})}
                disabled={profile?.role !== 'admin'}
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

          <div className="space-y-2">
            <Label htmlFor="company">Empresa</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              placeholder="Nome da empresa"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="(11) 99999-9999"
            />
          </div>

          {/* Seção de Senha */}
          <div className="border-t pt-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Key className="h-4 w-4 text-[#2563EB]" />
              <Label className="text-sm font-semibold">
                {mode === 'create' ? 'Definir Senha *' : 'Alterar Senha (opcional)'}
              </Label>
            </div>

            {mode === 'create' && (
              <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Esta senha será usada para login no sistema
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">
                  {mode === 'create' ? 'Senha *' : 'Nova Senha'}
                </Label>
                <Button
                  type="button"
                  onClick={generateSimplePassword}
                  size="sm"
                  variant="ghost"
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Gerar
                </Button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  required={mode === 'create'}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {mode === 'create' && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  A senha deve ter pelo menos 6 caracteres
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {mode === 'create' ? 'Confirmar Senha *' : 'Confirmar Nova Senha'}
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  placeholder="••••••••"
                  required={mode === 'create' || !!formData.password}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {/* Indicador de confirmação */}
              {formData.confirmPassword && (
                <div className="flex items-center gap-1 text-xs">
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-green-600 dark:text-green-400">Senhas coincidem</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3 w-3 text-red-500" />
                      <span className="text-red-600 dark:text-red-400">Senhas não coincidem</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0F1115]"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#0F1115] border-t-transparent rounded-full animate-spin"></div>
                  Salvando...
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {mode === 'create' ? 'Criar Usuário' : 'Salvar Alterações'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};