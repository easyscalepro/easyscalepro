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
  const { refreshUsers } = useUsers();
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
  const [creationMethod, setCreationMethod] = useState<'admin_api' | 'signup' | 'profile_only'>('admin_api');

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
      password += chars.charAt(Math.random() * chars.length);
    }
    setFormData({...formData, password, confirmPassword: password});
    toast.success('Senha gerada automaticamente!');
  };

  // Método 1: Tentar Admin API (mais completo)
  const createUserWithAdminAPI = async (email: string, password: string, userData: any) => {
    console.log('🔐 Tentando criar usuário com Admin API...');
    
    try {
      const { data: adminUser, error: adminError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: {
          name: userData.name,
          company: userData.company,
          phone: userData.phone
        }
      });

      if (adminError) {
        console.error('❌ Erro na Admin API:', adminError);
        throw adminError;
      }

      if (!adminUser.user) {
        throw new Error('Usuário não foi criado via Admin API');
      }

      console.log('✅ Usuário criado com Admin API:', adminUser.user.email);
      return adminUser.user;

    } catch (error: any) {
      console.error('❌ Falha na Admin API:', error);
      throw error;
    }
  };

  // Método 2: Usar signup normal (fallback)
  const createUserWithSignup = async (email: string, password: string, userData: any) => {
    console.log('📝 Tentando criar usuário com signup normal...');
    
    try {
      // Salvar sessão atual
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: userData.name,
            company: userData.company,
            phone: userData.phone
          }
        }
      });

      if (signupError) {
        console.error('❌ Erro no signup:', signupError);
        throw signupError;
      }

      if (!signupData.user) {
        throw new Error('Usuário não foi criado via signup');
      }

      console.log('✅ Usuário criado com signup:', signupData.user.email);
      
      // Fazer logout do usuário criado e restaurar sessão admin
      await supabase.auth.signOut();
      if (currentSession) {
        await supabase.auth.setSession(currentSession);
      }

      return signupData.user;

    } catch (error: any) {
      console.error('❌ Falha no signup:', error);
      throw error;
    }
  };

  // Método 3: Criar apenas perfil (sem auth)
  const createProfileOnly = async (userData: any) => {
    console.log('👤 Criando apenas perfil (sem autenticação)...');
    
    try {
      // Gerar ID único para o perfil
      const userId = crypto.randomUUID();
      
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

      const { data: profileResult, error: profileError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (profileError) {
        console.error('❌ Erro ao criar perfil:', profileError);
        throw profileError;
      }

      console.log('✅ Perfil criado sem autenticação:', profileResult);
      return { user: { id: userId, email: userData.email }, profile: profileResult };

    } catch (error: any) {
      console.error('❌ Falha ao criar perfil:', error);
      throw error;
    }
  };

  const createUserProfile = async (userId: string, userData: any) => {
    console.log('👤 Criando/atualizando perfil na tabela profiles...');
    
    try {
      // Aguardar trigger executar
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Verificar se perfil foi criado pelo trigger
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (existingProfile && !checkError) {
        console.log('✅ Perfil já criado pelo trigger, atualizando...');
        
        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .update({
            name: userData.name,
            role: userData.role,
            status: userData.status,
            phone: userData.phone || null,
            company: userData.company || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)
          .select()
          .single();

        if (updateError) {
          throw updateError;
        }

        return updatedProfile;
      }

      // Criar perfil manualmente
      console.log('🔧 Criando perfil manualmente...');
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

      const { data: profileResult, error: profileError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (profileError) {
        throw profileError;
      }

      console.log('✅ Perfil criado manualmente:', profileResult);
      return profileResult;

    } catch (error: any) {
      console.error('❌ Erro ao criar perfil:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log('🚀 Iniciando criação de usuário...', { 
      mode, 
      email: formData.email,
      name: formData.name,
      method: creationMethod
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
        if (creationMethod !== 'profile_only') {
          if (!formData.password) {
            toast.error('A senha é obrigatória');
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
      }

      if (mode === 'create') {
        console.log('➕ Modo: Criar novo usuário');

        if (profile?.role !== 'admin') {
          toast.error('Apenas administradores podem criar usuários');
          return;
        }

        // Verificar se email já existe
        console.log('🔍 Verificando se email já existe...');
        toast.loading('Verificando disponibilidade do email...', { id: 'create-user' });
        
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

        let authUser = null;
        let profileResult = null;
        let creationSuccess = false;

        // Tentar diferentes métodos de criação
        const methods = [
          { name: 'Admin API', method: 'admin_api' },
          { name: 'Signup Normal', method: 'signup' },
          { name: 'Apenas Perfil', method: 'profile_only' }
        ];

        for (const methodInfo of methods) {
          if (creationSuccess) break;

          try {
            console.log(`🔄 Tentando método: ${methodInfo.name}`);
            toast.loading(`Tentando criar usuário via ${methodInfo.name}...`, { id: 'create-user' });

            if (methodInfo.method === 'admin_api') {
              authUser = await createUserWithAdminAPI(formData.email, formData.password, formData);
              profileResult = await createUserProfile(authUser.id, formData);
              creationSuccess = true;
              
            } else if (methodInfo.method === 'signup') {
              authUser = await createUserWithSignup(formData.email, formData.password, formData);
              profileResult = await createUserProfile(authUser.id, formData);
              creationSuccess = true;
              
            } else if (methodInfo.method === 'profile_only') {
              const result = await createProfileOnly(formData);
              authUser = result.user;
              profileResult = result.profile;
              creationSuccess = true;
            }

            console.log(`✅ Sucesso com método: ${methodInfo.name}`);
            break;

          } catch (error: any) {
            console.warn(`⚠️ Falha no método ${methodInfo.name}:`, error.message);
            
            // Limpar usuário órfão se necessário
            if (authUser && !profileResult && methodInfo.method !== 'profile_only') {
              try {
                await supabase.auth.admin.deleteUser(authUser.id);
                console.log('🧹 Usuário órfão removido');
              } catch (cleanupError) {
                console.warn('⚠️ Não foi possível limpar usuário órfão:', cleanupError);
              }
            }
            
            // Se é o último método, relançar o erro
            if (methodInfo === methods[methods.length - 1]) {
              throw error;
            }
          }
        }

        if (!creationSuccess) {
          throw new Error('Todos os métodos de criação falharam');
        }

        toast.dismiss('create-user');
        
        if (creationMethod === 'profile_only') {
          toast.success('✅ Perfil criado com sucesso!', {
            description: `${formData.name} foi adicionado à plataforma (sem autenticação)`
          });
        } else {
          toast.success('✅ Usuário criado com sucesso!', {
            description: `${formData.name} pode fazer login com: ${formData.email}`
          });
          
          // Mostrar credenciais
          setTimeout(() => {
            toast.info('📋 Credenciais do usuário:', {
              description: `Email: ${formData.email} | Senha: ${formData.password}`,
              duration: 10000
            });
          }, 2000);
        }

        console.log('🎉 Usuário criado completamente:', {
          authId: authUser?.id,
          email: formData.email,
          profileId: profileResult?.id,
          method: creationMethod
        });

        await refreshUsers();

      } else if (mode === 'edit' && user) {
        console.log('✏️ Modo: Editar usuário existente');
        
        try {
          toast.loading('Atualizando dados do usuário...', { id: 'update-user' });

          const { data: updatedProfile, error: updateError } = await supabase
            .from('profiles')
            .update({
              name: formData.name,
              status: formData.status,
              role: formData.role,
              phone: formData.phone || null,
              company: formData.company || null,
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id)
            .select()
            .single();

          if (updateError) {
            throw updateError;
          }

          toast.dismiss('update-user');
          toast.success('✅ Usuário atualizado com sucesso!');

          await refreshUsers();
          
        } catch (error: any) {
          console.error('💥 Erro ao atualizar usuário:', error);
          toast.dismiss('update-user');
          toast.error('❌ Erro ao atualizar usuário: ' + error.message);
          return;
        }
      }
      
      console.log('🎯 Processo concluído com sucesso');
      onClose();
      
    } catch (error: any) {
      console.error('💥 Erro geral:', error);
      toast.dismiss('create-user');
      toast.error('❌ Erro ao criar usuário: ' + (error.message || 'Erro desconhecido'));
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

        {/* Seletor de método de criação */}
        {mode === 'create' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">
                Método de Criação
              </h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="creationMethod"
                    value="admin_api"
                    checked={creationMethod === 'admin_api'}
                    onChange={(e) => setCreationMethod(e.target.value as any)}
                    className="text-blue-600"
                  />
                  <span className="text-sm">Admin API (Completo com login)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="creationMethod"
                    value="signup"
                    checked={creationMethod === 'signup'}
                    onChange={(e) => setCreationMethod(e.target.value as any)}
                    className="text-blue-600"
                  />
                  <span className="text-sm">Signup Normal (Fallback)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="creationMethod"
                    value="profile_only"
                    checked={creationMethod === 'profile_only'}
                    onChange={(e) => setCreationMethod(e.target.value as any)}
                    className="text-blue-600"
                  />
                  <span className="text-sm">Apenas Perfil (Sem autenticação)</span>
                </label>
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
          {mode === 'create' && creationMethod !== 'profile_only' && (
            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Key className="h-4 w-4 text-[#2563EB]" />
                <Label className="text-sm font-semibold">
                  Definir Senha *
                </Label>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha *</Label>
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
                    required
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="••••••••"
                    required
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
          )}

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