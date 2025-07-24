"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Mail, Lock, LogIn, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/auth-provider';
import { LoadingScreen } from '@/components/loading-screen';
import Image from 'next/image';

export default function LoginPage() {
  const { user, signIn, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Verificar se veio de logout
  useEffect(() => {
    const fromLogout = searchParams?.get('logout');
    if (fromLogout === 'true') {
      toast.success('Logout realizado com sucesso!', {
        description: 'Faça login novamente para acessar a plataforma'
      });
    }
  }, [searchParams]);

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (!loading && user) {
      router.push('/admin/users');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.email.trim()) {
        toast.error('Email é obrigatório');
        return;
      }

      if (!formData.password.trim()) {
        toast.error('Senha é obrigatória');
        return;
      }

      toast.loading('Fazendo login...', { id: 'login' });

      await signIn(formData.email.trim(), formData.password);

      toast.dismiss('login');
      toast.success('Login realizado com sucesso!', {
        description: 'Redirecionando para o painel...'
      });

      router.push('/admin/users');

    } catch (error: any) {
      console.error('Erro no login:', error);
      toast.dismiss('login');
      
      let errorMessage = 'Erro ao fazer login';
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Email não confirmado. Verifique sua caixa de entrada.';
      } else if (error.message?.includes('Too many requests')) {
        errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <LoadingScreen 
        message="Verificando autenticação..."
        submessage="Aguarde enquanto validamos sua sessão"
      />
    );
  }

  if (user) {
    return null; // Será redirecionado
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1115] via-[#1a1f2e] to-[#2563EB] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center space-y-4 pb-8">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="w-16 h-16 relative">
              <Image
                src="https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png"
                alt="EasyScale Logo"
                fill
                className="object-contain"
                sizes="64px"
                priority
              />
            </div>
          </div>
          
          <div>
            <CardTitle className="text-2xl font-bold text-[#0F1115]">
              Bem-vindo de volta
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Faça login para acessar o painel administrativo
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="seu@email.com"
                required
                className="h-12"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Digite sua senha"
                  required
                  className="h-12 pr-12"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0F1115] font-semibold text-base"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-[#0F1115] border-t-transparent rounded-full animate-spin"></div>
                  Entrando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  Entrar
                </div>
              )}
            </Button>
          </form>

          {/* Informações adicionais */}
          <div className="mt-8 space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Acesso Seguro:</strong> Suas credenciais são protegidas com criptografia de ponta
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-gray-500">
              <p>EasyScale Admin Panel v1.0</p>
              <p>© 2024 EasyScale. Todos os direitos reservados.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}