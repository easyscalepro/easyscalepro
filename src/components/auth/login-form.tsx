"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EasyScaleLogo } from '@/components/easyscale-logo';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Para cadastro, simular criação de conta
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Conta criada com sucesso! Faça login para continuar.');
        setIsSignUp(false);
      } else {
        // Para login, usar o AuthProvider
        await login(email, password);
        toast.success('Login realizado com sucesso!');
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Erro de autenticação:', error);
      if (error.message === 'Credenciais inválidas') {
        toast.error('Email ou senha incorretos.');
      } else {
        toast.error('Erro ao fazer login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast.info('Funcionalidade de recuperação de senha em desenvolvimento');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1115] via-[#1a1f2e] to-[#2563EB] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md shadow-2xl border-0 bg-white dark:bg-gray-800">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex justify-center">
            <EasyScaleLogo />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-[#0F1115] dark:text-gray-100">
              {isSignUp ? 'Criar Conta' : 'Bem-vindo de volta'}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300 mt-2">
              {isSignUp 
                ? 'Acesse mais de 1.000 comandos de ChatGPT para PMEs'
                : 'Faça login para acessar seus comandos'
              }
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#0F1115] dark:text-gray-200 font-medium">
                E-mail
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="pl-10 h-12 border-gray-200 dark:border-gray-700 focus:border-[#2563EB] dark:focus:border-blue-400 focus:ring-[#2563EB] dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#0F1115] dark:text-gray-200 font-medium">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-12 border-gray-200 dark:border-gray-700 focus:border-[#2563EB] dark:focus:border-blue-400 focus:ring-[#2563EB] dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0F1115] font-semibold text-lg transition-all duration-200 transform hover:scale-105"
            >
              {loading ? 'Carregando...' : (isSignUp ? 'Criar Conta' : 'Entrar')}
            </Button>

            {!isSignUp && (
              <button
                type="button"
                onClick={handleForgotPassword}
                className="w-full text-[#2563EB] dark:text-blue-400 hover:text-[#1d4ed8] dark:hover:text-blue-300 text-sm font-medium transition-colors"
              >
                Esqueci minha senha
              </button>
            )}

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[#2563EB] dark:text-blue-400 hover:text-[#1d4ed8] dark:hover:text-blue-300 font-medium transition-colors"
              >
                {isSignUp 
                  ? 'Já tem uma conta? Faça login'
                  : 'Não tem conta? Criar conta'
                }
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};