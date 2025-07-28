"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EasyScaleLogoLarge } from '@/components/easyscale-logo-large';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { signUp } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// Componente separado que usa useSearchParams
function LoginFormWithParams() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, user } = useAuth();

  const redirectPath = searchParams.get('redirect') || '/dashboard';
  const error = searchParams.get('error');

  useEffect(() => {
    // Se já está logado, redirecionar
    if (user) {
      router.push(redirectPath);
    }

    // Mostrar erros da URL
    if (error === 'account_suspended') {
      toast.error('Sua conta foi suspensa. Entre em contato com o suporte.');
    } else if (error === 'access_denied') {
      toast.error('Você não tem permissão para acessar essa área.');
    }
  }, [user, router, redirectPath, error]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validações básicas
      if (!email.trim()) {
        toast.error('Email é obrigatório');
        return;
      }

      if (!validateEmail(email)) {
        toast.error('Por favor, insira um email válido');
        return;
      }

      if (!password.trim()) {
        toast.error('Senha é obrigatória');
        return;
      }

      if (isSignUp) {
        // Cadastro
        if (!name.trim()) {
          toast.error('Nome é obrigatório');
          return;
        }

        if (password.length < 6) {
          toast.error('A senha deve ter pelo menos 6 caracteres');
          return;
        }

        toast.loading('Criando sua conta...', { id: 'auth' });

        await signUp(email, password, name);
        
        toast.dismiss('auth');
        toast.success('Conta criada com sucesso!', {
          description: 'Você pode fazer login agora com suas credenciais.'
        });
        
        setIsSignUp(false);
        setName('');
        setLoginAttempts(0);
        
      } else {
        // Login
        if (loginAttempts >= 3) {
          toast.error('Muitas tentativas de login. Aguarde alguns minutos antes de tentar novamente.');
          return;
        }

        toast.loading('Fazendo login...', { id: 'auth' });

        try {
          await signIn(email, password);
          
          toast.dismiss('auth');
          toast.success('Login realizado com sucesso!');
          
          // Reset tentativas em caso de sucesso
          setLoginAttempts(0);
          
          // Redirecionar será feito pelo AuthProvider
          router.push(redirectPath);
          
        } catch (loginError: any) {
          setLoginAttempts(prev => prev + 1);
          throw loginError;
        }
      }
    } catch (error: any) {
      console.error('Erro de autenticação:', error);
      
      toast.dismiss('auth');
      
      // Tratamento específico de erros
      const errorMessage = error.message || 'Erro desconhecido';
      
      if (errorMessage.includes('Invalid login credentials') || errorMessage.includes('Email ou senha incorretos')) {
        toast.error('Email ou senha incorretos', {
          description: `Tentativa ${loginAttempts + 1} de 3. Verifique suas credenciais.`
        });
      } else if (errorMessage.includes('Email not confirmed') || errorMessage.includes('não confirmado')) {
        toast.error('Email não confirmado', {
          description: 'Verifique sua caixa de entrada e confirme seu email antes de fazer login.'
        });
      } else if (errorMessage.includes('User already registered') || errorMessage.includes('já está cadastrado')) {
        toast.error('Este email já está cadastrado', {
          description: 'Tente fazer login ou use outro email.'
        });
      } else if (errorMessage.includes('Password should be at least 6 characters')) {
        toast.error('A senha deve ter pelo menos 6 caracteres');
      } else if (errorMessage.includes('Too many requests') || errorMessage.includes('Muitas tentativas')) {
        toast.error('Muitas tentativas de login', {
          description: 'Aguarde alguns minutos antes de tentar novamente.'
        });
      } else if (errorMessage.includes('inativa')) {
        toast.error('Conta inativa', {
          description: 'Entre em contato com o administrador para reativar sua conta.'
        });
      } else {
        toast.error('Erro na autenticação', {
          description: errorMessage
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = () => {
    setEmail('teste@gmail.com');
    setPassword('123456');
    toast.info('Credenciais de teste preenchidas');
  };

  const handleForgotPassword = () => {
    console.log('Clique detectado!');
    alert('Redirecionando para recuperação de senha...');
    window.location.href = '/forgot-password';
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
            <EasyScaleLogoLarge size="lg" />
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
          {/* Aviso de erro se houver */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <span className="text-sm text-red-700 dark:text-red-300">
                {error === 'account_suspended' && 'Conta suspensa'}
                {error === 'access_denied' && 'Acesso negado'}
              </span>
            </div>
          )}

          {/* Botão de teste (apenas em desenvolvimento) */}
          {!isSignUp && (
            <div className="mb-4">
              <Button
                type="button"
                onClick={handleTestLogin}
                variant="outline"
                size="sm"
                className="w-full border-green-300 text-green-600 hover:bg-green-50"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Usar Credenciais de Teste
              </Button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#0F1115] dark:text-gray-200 font-medium">
                  Nome Completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="h-12 border-gray-200 dark:border-gray-700 focus:border-[#2563EB] dark:focus:border-blue-400 focus:ring-[#2563EB] dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required={isSignUp}
                />
              </div>
            )}

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
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
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
                  minLength={isSignUp ? 6 : 1}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {isSignUp && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  A senha deve ter pelo menos 6 caracteres
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0F1115] font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#0F1115] border-t-transparent rounded-full animate-spin"></div>
                  {isSignUp ? 'Criando conta...' : 'Entrando...'}
                </div>
              ) : (
                isSignUp ? 'Criar Conta' : 'Entrar'
              )}
            </Button>
          </form>

          {/* Botão "Esqueci minha senha" - BUTTON HTML SIMPLES */}
          {!isSignUp && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={handleForgotPassword}
                onMouseDown={handleForgotPassword}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#2563EB',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  zIndex: 9999,
                  position: 'relative',
                  pointerEvents: 'auto'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#eff6ff';
                  e.currentTarget.style.color = '#1d4ed8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#2563EB';
                }}
              >
                <Mail style={{ width: '16px', height: '16px' }} />
                Esqueci minha senha
              </button>
            </div>
          )}

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => window.location.href = '/signup'}
              onMouseDown={() => window.location.href = '/signup'}
              style={{
                color: '#2563EB',
                fontWeight: '500',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
                outline: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                zIndex: 9999,
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#1d4ed8';
                e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#2563EB';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {isSignUp 
                ? 'Já tem uma conta? Faça login'
                : 'Não tem conta? Criar conta'
              }
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Fallback para o Suspense
function LoginFormFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1115] via-[#1a1f2e] to-[#2563EB] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md shadow-2xl border-0 bg-white dark:bg-gray-800">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex justify-center">
            <EasyScaleLogoLarge size="lg" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-[#0F1115] dark:text-gray-100">
              Carregando...
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-300">Preparando formulário...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente principal que exporta
export const LoginForm: React.FC = () => {
  return (
    <Suspense fallback={<LoginFormFallback />}>
      <LoginFormWithParams />
    </Suspense>
  );
};