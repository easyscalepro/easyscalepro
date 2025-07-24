"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, Save, X, Eye, EyeOff, RefreshCw, Database, CheckCircle, Lock, Shield, AlertTriangle, Key } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/auth-provider';

interface Profile {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  phone: string | null;
  role: 'admin' | 'user' | 'moderator';
  status: 'ativo' | 'inativo' | 'suspenso';
  avatar_url: string | null;
  commands_used: number;
  last_access: string | null;
  created_at: string;
  updated_at: string;
}

interface UserFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: Profile;
  mode: 'create' | 'edit';
  onSuccess: () => void;
}

export const UserFormDialog: React.FC<UserFormDialogProps> = ({
  isOpen,
  onClose,
  profile,
  mode,
  onSuccess
}) => {
  const { profile: currentProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: 'ativo' as 'ativo' | 'inativo' | 'suspenso',
    role: 'user' as 'admin' | 'user' | 'moderator',
    phone: '',
    company: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [createWithAuth, setCreateWithAuth] = useState(false);
  
  // Estados para alteração de senha
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showNewPasswords, setShowNewPasswords] = useState({
    new: false,
    confirm: false
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email,
        status: profile.status,
        role: profile.role,
        phone: profile.phone || '',
        company: profile.company || '',
        password: ''
      });
      setCreateWithAuth(false);
      setShowPasswordSection(false);
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } else {
      setFormData({
        name: '',
        email: '',
        status: 'ativo',
        role: 'user',
        phone: '',
        company: '',
        password: ''
      });
      setCreateWithAuth(false);
      setShowPasswordSection(false);
      setPasswordData({ newPassword: '', confirmPassword: '' });
    }
  }, [mode, profile, isOpen]);

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.random() * chars.length);
    }
    setFormData({...formData, password});
    toast.success('Senha gerada automaticamente!');
  };

  const generateNewPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.random() * chars.length);
    }
    setPasswordData({
      newPassword: password,
      confirmPassword: password
    });
    toast.success('Nova senha gerada automaticamente!');
  };

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    // Validação mais flexível para admin
    if (password.length < 6) {
      errors.push('Deve ter pelo menos 6 caracteres');
    }
    
    return errors;
  };

  const handlePasswordChange = async () => {
    if (!passwordData.newPassword) {
      toast.error('Digite a nova senha');
      return false;
    }

    if (!passwordData.confirmPassword) {
      toast.error('Confirme a nova senha');
      return false;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('A nova senha e a confirmação não coincidem');
      return false;
    }

    const passwordErrors = validatePassword(passwordData.newPassword);
    if (passwordErrors.length > 0) {
      toast.error(`Senha inválida: ${passwordErrors.join(', ')}`);
      return false;
    }

    setIsChangingPassword(true);

    try {
      console.log('🔐 Alterando senha do usuário via admin...');
      toast.loading('Alterando senha...', { id: 'change-password' });

      // Usar Admin API para alterar senha
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        profile!.id,
        { password: passwordData.newPassword }
      );

      if (updateError) {
        console.error('❌ Erro ao alterar senha:', updateError);
        toast.dismiss('change-password');
        toast.error('Erro ao alterar senha: ' + updateError.message);
        return false;
      }

      console.log('✅ Senha alterada com sucesso via admin');
      toast.dismiss('change-password');
      toast.success('✅ Senha alterada com sucesso!', {
        description: `Nova senha definida para ${profile?.name || profile?.email}`
      });
      
      // Limpar campos de senha
      setPasswordData({ newPassword: '', confirmPassword: '' });
      setShowPasswordSection(false);
      
      return true;

    } catch (error: any) {
      console.error('💥 Erro inesperado ao alterar senha:', error);
      toast.dismiss('change-password');
      toast.error('Erro inesperado ao alterar senha');
      return false;
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validações
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
        console.log('➕ Criando novo usuário...');
        toast.loading('Criando usuário...', { id: 'create-user' });

        // Verificar se email já existe
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('email', formData.email.trim().toLowerCase())
          .single();

        if (existingProfile) {
          toast.dismiss('create-user');
          toast.error('Este email já está cadastrado');
          return;
        }

        let userId = crypto.randomUUID();
        let authCreated = false;

        // Criar no Auth apenas se solicitado E tem senha
        if (createWithAuth && formData.password.trim()) {
          try {
            console.log('🔐 Tentando criar no Auth...');
            
            const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
              email: formData.email.trim().toLowerCase(),
              password: formData.password,
              email_confirm: true,
              user_metadata: {
                name: formData.name.trim()
              }
            });

            if (!authError && authUser.user) {
              userId = authUser.user.id;
              authCreated = true;
              console.log('✅ Usuário criado no Auth:', userId);
            } else {
              console.warn('⚠️ Falha no Auth:', authError);
            }
          } catch (authError) {
            console.warn('⚠️ Falha no Auth, continuando sem autenticação:', authError);
          }
        }

        // Criar perfil na tabela
        console.log('👤 Criando perfil na tabela...');
        
        const profileData = {
          id: userId,
          email: formData.email.trim().toLowerCase(),
          name: formData.name.trim(),
          role: formData.role,
          status: formData.status,
          phone: formData.phone.trim() || null,
          company: formData.company.trim() || null,
          avatar_url: null,
          commands_used: 0,
          last_access: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data: createdProfile, error: profileError } = await supabase
          .from('profiles')
          .insert(profileData)
          .select()
          .single();

        if (profileError) {
          console.error('❌ Erro ao criar perfil:', profileError);
          throw new Error('Erro ao salvar perfil: ' + (profileError.message || 'Erro desconhecido'));
        }

        console.log('✅ Perfil criado:', createdProfile);
        toast.dismiss('create-user');
        
        if (authCreated) {
          toast.success('✅ Usuário criado com autenticação!', {
            description: `${formData.name} pode fazer login`
          });
        } else {
          toast.success('✅ Perfil criado com sucesso!', {
            description: `${formData.name} foi adicionado à plataforma`
          });
        }

      } else if (mode === 'edit' && profile) {
        console.log('✏️ Editando usuário...');
        toast.loading('Atualizando usuário...', { id: 'update-user' });

        // Se há alteração de senha pendente, fazer primeiro
        if (showPasswordSection && (passwordData.newPassword || passwordData.confirmPassword)) {
          const passwordSuccess = await handlePasswordChange();
          if (!passwordSuccess) {
            return; // Parar se a alteração de senha falhou
          }
        }

        const updateData = {
          name: formData.name.trim(),
          status: formData.status,
          role: formData.role,
          phone: formData.phone.trim() || null,
          company: formData.company.trim() || null,
          updated_at: new Date().toISOString()
        };

        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', profile.id)
          .select()
          .single();

        if (updateError) {
          console.error('❌ Erro ao atualizar perfil:', updateError);
          throw new Error('Erro ao atualizar perfil: ' + (updateError.message || 'Erro desconhecido'));
        }

        console.log('✅ Perfil atualizado:', updatedProfile);
        toast.dismiss('update-user');
        toast.success('✅ Usuário atualizado com sucesso!');
      }

      onSuccess();
      onClose();

    } catch (error: any) {
      console.error('💥 Erro:', error);
      toast.dismiss('create-user');
      toast.dismiss('update-user');
      toast.error(error.message || 'Erro na operação');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-[#2563EB]" />
            {mode === 'create' ? 'Criar Novo Usuário' : 'Editar Usuário'}
          </DialogTitle>
        </DialogHeader>

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

          {/* Seção de Autenticação - apenas para criação */}
          {mode === 'create' && (
            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-semibold">Criar com Autenticação (Opcional)</Label>
                  <p className="text-xs text-gray-500">Se ativado, o usuário poderá fazer login</p>
                </div>
                <Switch
                  checked={createWithAuth}
                  onCheckedChange={setCreateWithAuth}
                />
              </div>

              {createWithAuth && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <Button
                      type="button"
                      onClick={generatePassword}
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
                      placeholder="Digite uma senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Senha necessária para criar conta de login
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Seção de Alteração de Senha - apenas para edição */}
          {mode === 'edit' && profile && (
            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-blue-500" />
                  <Label className="text-sm font-semibold">Redefinir Senha do Usuário</Label>
                </div>
                <Switch
                  checked={showPasswordSection}
                  onCheckedChange={setShowPasswordSection}
                />
              </div>

              {showPasswordSection && (
                <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                    <Shield className="h-4 w-4" />
                    <span>Defina uma nova senha para <strong>{profile.name || profile.email}</strong></span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="newPassword" className="font-medium">Nova Senha</Label>
                      <Button
                        type="button"
                        onClick={generateNewPassword}
                        size="sm"
                        variant="ghost"
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Gerar Senha
                      </Button>
                    </div>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        placeholder="Digite a senha que você escolher"
                        className="bg-white dark:bg-gray-700"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPasswords({...showNewPasswords, new: !showNewPasswords.new})}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="font-medium">Confirmar Senha</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showNewPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        placeholder="Digite a mesma senha novamente"
                        className="bg-white dark:bg-gray-700"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPasswords({...showNewPasswords, confirm: !showNewPasswords.confirm})}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="text-xs text-green-700 dark:text-green-300">
                      <p className="font-medium mb-1">✅ Liberdade Total do Admin:</p>
                      <ul className="space-y-0.5">
                        <li>• Você pode escolher qualquer senha</li>
                        <li>• Mínimo de apenas 6 caracteres</li>
                        <li>• A senha será salva diretamente no Supabase</li>
                        <li>• O usuário poderá fazer login imediatamente</li>
                      </ul>
                    </div>
                  </div>

                  {isChangingPassword && (
                    <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      Salvando nova senha no banco de dados...
                    </div>
                  )}

                  <Button
                    type="button"
                    onClick={handlePasswordChange}
                    disabled={isChangingPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isChangingPassword ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Salvar Nova Senha
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Info sobre salvamento */}
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div className="text-xs text-green-700 dark:text-green-300">
                <strong>Sistema Otimizado:</strong> Dados salvos diretamente na tabela <code>profiles</code> com políticas RLS configuradas
              </div>
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