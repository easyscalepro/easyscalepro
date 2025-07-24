"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { User, Save, X, Eye, EyeOff, RefreshCw, Database } from 'lucide-react';
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
  const [createWithAuth, setCreateWithAuth] = useState(true);

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
      setCreateWithAuth(true);
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

        if (currentProfile?.role !== 'admin') {
          toast.error('Apenas administradores podem criar usuários');
          return;
        }

        // Verificar se email já existe
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('email', formData.email.trim().toLowerCase())
          .single();

        if (existingProfile) {
          toast.error('Este email já está cadastrado');
          return;
        }

        let userId = '';
        let authCreated = false;

        // Criar no Auth se solicitado
        if (createWithAuth && formData.password.trim()) {
          try {
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
            }
          } catch (authError) {
            console.warn('⚠️ Falha no Auth, continuando sem autenticação');
          }
        }

        // Gerar ID se não criou no Auth
        if (!userId) {
          userId = crypto.randomUUID();
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
          commands_used: 0,
          last_access: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { error: profileError } = await supabase
          .from('profiles')
          .insert(profileData);

        if (profileError) {
          console.error('❌ Erro ao criar perfil:', profileError);
          throw new Error('Erro ao salvar perfil: ' + profileError.message);
        }

        if (authCreated) {
          toast.success('✅ Usuário criado com sucesso!', {
            description: `${formData.name} pode fazer login com: ${formData.email}`
          });
        } else {
          toast.success('✅ Perfil criado com sucesso!', {
            description: `${formData.name} foi adicionado à plataforma`
          });
        }

      } else if (mode === 'edit' && profile) {
        console.log('✏️ Editando usuário...');

        const updateData = {
          name: formData.name.trim(),
          status: formData.status,
          role: formData.role,
          phone: formData.phone.trim() || null,
          company: formData.company.trim() || null,
          updated_at: new Date().toISOString()
        };

        const { error: updateError } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', profile.id);

        if (updateError) {
          console.error('❌ Erro ao atualizar perfil:', updateError);
          throw new Error('Erro ao atualizar perfil: ' + updateError.message);
        }

        toast.success('✅ Usuário atualizado com sucesso!');
      }

      onSuccess();
      onClose();

    } catch (error: any) {
      console.error('💥 Erro:', error);
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
                disabled={currentProfile?.role !== 'admin'}
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

          {/* Seção de Senha - apenas para criação */}
          {mode === 'create' && (
            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-semibold">Criar com Autenticação</Label>
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
                </div>
              )}
            </div>
          )}

          {/* Info sobre salvamento */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <Database className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-xs text-blue-700 dark:text-blue-300">
                <strong>Salvamento:</strong> Dados salvos diretamente na tabela <code>profiles</code> do Supabase
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