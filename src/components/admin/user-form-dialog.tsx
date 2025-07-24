"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { User, Save, X, Eye, EyeOff, RefreshCw, Database, CheckCircle } from 'lucide-react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [createWithAuth, setCreateWithAuth] = useState(false); // Desabilitado por padrão

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

        let userId = crypto.randomUUID(); // Sempre gerar ID único
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
              userId = authUser.user.id; // Usar ID do Auth se criou com sucesso
              authCreated = true;
              console.log('✅ Usuário criado no Auth:', userId);
            } else {
              console.warn('⚠️ Falha no Auth:', authError);
              // Continuar com ID gerado
            }
          } catch (authError) {
            console.warn('⚠️ Falha no Auth, continuando sem autenticação:', authError);
            // Continuar com ID gerado
          }
        }

        // Criar perfil na tabela - SEMPRE
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

        console.log('📋 Dados do perfil:', profileData);

        const { data: createdProfile, error: profileError } = await supabase
          .from('profiles')
          .insert(profileData)
          .select()
          .single();

        if (profileError) {
          console.error('❌ Erro ao criar perfil:', {
            error: profileError,
            message: profileError?.message || 'Erro desconhecido',
            details: profileError?.details || 'Sem detalhes',
            code: profileError?.code || 'Sem código'
          });
          
          let errorMessage = 'Erro ao salvar perfil';
          
          if (profileError.code === '23505') {
            errorMessage = 'Este email já existe na tabela';
          } else if (profileError.code === '42501') {
            errorMessage = 'Sem permissão para criar perfil';
          } else if (profileError.message) {
            errorMessage = profileError.message;
          }
          
          throw new Error(errorMessage);
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

        const updateData = {
          name: formData.name.trim(),
          status: formData.status,
          role: formData.role,
          phone: formData.phone.trim() || null,
          company: formData.company.trim() || null,
          updated_at: new Date().toISOString()
        };

        console.log('📋 Dados de atualização:', updateData);

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