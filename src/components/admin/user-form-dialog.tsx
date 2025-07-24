"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, Save, X, Eye, EyeOff, RefreshCw, Database, CheckCircle, Lock, Key, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
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
  
  // Estados para alteração de senha
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [createWithAuth, setCreateWithAuth] = useState(false);

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
      setChangePassword(false);
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
      setChangePassword(false);
      setPasswordData({ newPassword: '', confirmPassword: '' });
    }
  }, [mode, profile, isOpen]);

  // Calcular força da senha
  useEffect(() => {
    const password = mode === 'edit' ? passwordData.newPassword : formData.password;
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (password.match(/[a-z]/)) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 1;
    
    setPasswordStrength(strength);
  }, [passwordData.newPassword, formData.password, mode]);

  const generatePassword = (isForEdit = false) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    
    // Garantir pelo menos um de cada tipo
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // Maiúscula
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // Minúscula
    password += '0123456789'[Math.floor(Math.random() * 10)]; // Número
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // Especial
    
    // Completar com caracteres aleatórios
    for (let i = 4; i < 12; i++) {
      password += chars.charAt(Math.random() * chars.length);
    }
    
    // Embaralhar a senha
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    if (isForEdit) {
      setPasswordData({
        newPassword: password,
        confirmPassword: password
      });
    } else {
      setFormData({...formData, password});
    }
    
    toast.success('Senha forte gerada automaticamente!');
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 2) return 'bg-orange-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    if (passwordStrength <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Muito fraca';
    if (passwordStrength <= 2) return 'Fraca';
    if (passwordStrength <= 3) return 'Média';
    if (passwordStrength <= 4) return 'Forte';
    return 'Muito forte';
  };

  const validatePasswords = () => {
    if (mode === 'edit' && changePassword) {
      if (!passwordData.newPassword) {
        toast.error('Nova senha é obrigatória');
        return false;
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error('As senhas não coincidem');
        return false;
      }
      if (passwordData.newPassword.length < 6) {
        toast.error('A senha deve ter pelo menos 6 caracteres');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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

      // Validar senhas
      if (!validatePasswords()) {
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
          throw new Error('Erro ao salvar perfil: ' + profileError.message);
        }

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

        // Atualizar dados do perfil
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
          throw new Error('Erro ao atualizar perfil: ' + updateError.message);
        }

        // Atualizar senha se solicitado
        if (changePassword && passwordData.newPassword) {
          try {
            console.log('🔑 Atualizando senha do usuário...');
            
            const { error: passwordError } = await supabase.auth.admin.updateUserById(
              profile.id,
              { password: passwordData.newPassword }
            );

            if (passwordError) {
              console.warn('⚠️ Erro ao atualizar senha:', passwordError);
              toast.warning('Perfil atualizado, mas houve problema ao alterar a senha');
            } else {
              console.log('✅ Senha atualizada com sucesso');
              toast.success('✅ Usuário e senha atualizados com sucesso!');
            }
          } catch (passwordError) {
            console.warn('⚠️ Erro ao atualizar senha:', passwordError);
            toast.warning('Perfil atualizado, mas não foi possível alterar a senha');
          }
        } else {
          toast.success('✅ Usuário atualizado com sucesso!');
        }

        toast.dismiss('update-user');
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

        <form onSubmit={handleSubmit} className="space-y-4 lasy-highlight">
          {/* Dados Básicos */}
          <div className="space-y-4">
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
          </div>

          {/* Seção de Senha para Criação */}
          {mode === 'create' && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Criar com Autenticação (Opcional)
                    </Label>
                    <p className="text-xs text-gray-500">Se ativado, o usuário poderá fazer login</p>
                  </div>
                  <Switch
                    checked={createWithAuth}
                    onCheckedChange={setCreateWithAuth}
                  />
                </div>

                {createWithAuth && (
                  <div className="space-y-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        Senha
                      </Label>
                      <Button
                        type="button"
                        onClick={() => generatePassword(false)}
                        size="sm"
                        variant="ghost"
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Gerar Forte
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

                    {formData.password && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                              style={{ width: `${(passwordStrength / 5) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">{getPasswordStrengthText()}</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          <p>Critérios: 8+ caracteres, maiúscula, minúscula, número, símbolo</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Seção de Alteração de Senha para Edição */}
          {mode === 'edit' && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Alterar Senha
                    </Label>
                    <p className="text-xs text-gray-500">Modificar a senha de acesso do usuário</p>
                  </div>
                  <Switch
                    checked={changePassword}
                    onCheckedChange={setChangePassword}
                  />
                </div>

                {changePassword && (
                  <div className="space-y-4 bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">Alteração de Senha</span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="newPassword" className="flex items-center gap-2">
                          <Key className="h-4 w-4" />
                          Nova Senha
                        </Label>
                        <Button
                          type="button"
                          onClick={() => generatePassword(true)}
                          size="sm"
                          variant="ghost"
                          className="text-xs text-orange-600 hover:text-orange-700"
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Gerar Forte
                        </Button>
                      </div>
                      
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          placeholder="Digite a nova senha"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                            placeholder="Confirme a nova senha"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      {passwordData.newPassword && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                style={{ width: `${(passwordStrength / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium">{getPasswordStrengthText()}</span>
                          </div>
                          
                          {passwordData.confirmPassword && (
                            <div className="flex items-center gap-2 text-xs">
                              {passwordData.newPassword === passwordData.confirmPassword ? (
                                <div className="flex items-center gap-1 text-green-600">
                                  <CheckCircle className="h-3 w-3" />
                                  <span>Senhas coincidem</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-red-600">
                                  <AlertTriangle className="h-3 w-3" />
                                  <span>Senhas não coincidem</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="text-xs text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/30 p-2 rounded">
                        <strong>Atenção:</strong> A alteração da senha será aplicada imediatamente e o usuário precisará usar a nova senha no próximo login.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Info sobre salvamento */}
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div className="text-xs text-green-700 dark:text-green-300">
                <strong>Sistema Seguro:</strong> Dados salvos na tabela <code>profiles</code> e senhas gerenciadas pelo Supabase Auth
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