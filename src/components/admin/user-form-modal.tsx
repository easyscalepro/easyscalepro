"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Save, X, Eye, EyeOff, Key, Mail, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useUsers, type User as UserType } from '@/contexts/users-context';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validações básicas
    if (!formData.name.trim()) {
      toast.error('O nome é obrigatório');
      setIsSubmitting(false);
      return;
    }

    if (!formData.email.trim()) {
      toast.error('O email é obrigatório');
      setIsSubmitting(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Email inválido');
      setIsSubmitting(false);
      return;
    }

    // Validação simples de senha para novos usuários
    if (mode === 'create') {
      if (!formData.password) {
        toast.error('A senha é obrigatória para novos usuários');
        setIsSubmitting(false);
        return;
      }

      if (formData.password.length < 6) {
        toast.error('A senha deve ter pelo menos 6 caracteres');
        setIsSubmitting(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error('As senhas não coincidem');
        setIsSubmitting(false);
        return;
      }
    }

    // Validação simples de senha para edição (se fornecida)
    if (mode === 'edit' && formData.password) {
      if (formData.password.length < 6) {
        toast.error('A senha deve ter pelo menos 6 caracteres');
        setIsSubmitting(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error('As senhas não coincidem');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      if (mode === 'create') {
        // Criar usuário no Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: formData.email,
          password: formData.password,
          user_metadata: {
            name: formData.name,
            company: formData.company,
            phone: formData.phone
          }
        });

        if (authError) {
          throw authError;
        }

        // Adicionar ao contexto local
        addUser({
          name: formData.name,
          email: formData.email,
          status: formData.status,
          role: formData.role,
          phone: formData.phone,
          company: formData.company
        });
      } else if (mode === 'edit' && user) {
        // Atualizar usuário
        if (formData.password) {
          // Se uma nova senha foi fornecida, atualizar no Supabase
          const { error: passwordError } = await supabase.auth.admin.updateUserById(
            user.id,
            { password: formData.password }
          );

          if (passwordError) {
            console.warn('Erro ao atualizar senha no Supabase:', passwordError);
            // Continuar mesmo se falhar, pois pode ser um usuário local
          }
        }

        updateUser(user.id, {
          name: formData.name,
          email: formData.email,
          status: formData.status,
          role: formData.role,
          phone: formData.phone,
          company: formData.company
        });
      }
      
      onClose();
    } catch (error: any) {
      console.error('Erro ao salvar usuário:', error);
      toast.error('Erro ao salvar usuário: ' + error.message);
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

          {/* Seção de Senha Simplificada */}
          <div className="border-t pt-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Key className="h-4 w-4 text-[#2563EB]" />
              <Label className="text-sm font-semibold">
                {mode === 'create' ? 'Definir Senha *' : 'Alterar Senha (opcional)'}
              </Label>
            </div>

            {mode === 'edit' && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                      Enviar email de redefinição
                    </span>
                  </div>
                  <Button
                    type="button"
                    onClick={handleResetPassword}
                    disabled={isResettingPassword}
                    size="sm"
                    variant="outline"
                    className="border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    {isResettingPassword ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="h-4 w-4" />
                    )}
                  </Button>
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
              
              {/* Indicador simples de confirmação */}
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