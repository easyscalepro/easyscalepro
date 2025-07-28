"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EasyScaleLogoLarge } from '@/components/easyscale-logo-large';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Mail, ArrowLeft, CheckCircle, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function ForgotPasswordPageWithParams() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Pré-preencher email se veio da URL
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Digite seu email para recuperar a senha');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Por favor, insira um email válido');
      return;
    }

    setLoading(true);

    try {
      console.log('🔄 Enviando email de recuperação para:', email);
      
      toast.loading('Enviando email de recuperação...', { id: 'forgot-password' });

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('❌ Erro ao enviar email:', error);
        throw error;
      }

      toast.dismiss('forgot-password');
      toast.success('Email de recuperação enviado!', {
        description: 'Verifique sua caixa de entrada e spam. O link expira em 1 hora.',
        duration: 8000
      });

      setEmailSent(true);
      
    } catch (error: any) {
      console.error('💥 Erro:', error);
      
      toast.dismiss('forgot-password');
      
      if (error.message?.includes('User not found')) {
        toast.error('Email não encontrado', {
          description: 'Este email não está cadastrado. Verifique o email ou crie uma conta.'
        });
      } else if (error.message?.includes('rate_limit')) {
        toast.error('Muitas tentativas', {
          description: 'Aguarde alguns minutos antes de tentar novamente.'
        });
      } else {
        toast.error('Erro ao enviar email', {
          description: 'Tente novamente em alguns minutos.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1115] via-[#1a1f2e] to-[#2563EB] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Back to Login - BOTÃO SIMPLIFICADO */}
      <div 
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          zIndex: 9999
        }}
      >
        <button
          onClick={() => window.location.href = '/login'}
          onMouseDown={() => window.location.href = '/login'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            borderRadius: '6px',
            fontSize: '14px',
            transition: 'background-color 0.2s',
            fontFamily: 'inherit',
            outline: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          Voltar ao Login
        </button>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-0 bg-white dark:bg-gray-800">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex justify-center">
            <EasyScaleLogoLarge size="lg" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-[#0F1115] dark:text-gray-100 flex items-center justify-center gap-2">
              <Mail className="h-6 w-6 text-blue-600" />
              Recuperar Senha
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Digite seu email para receber o link de recuperação
            </p>
          </div>
        </CardHeader>

        <CardContent>
          {emailSent && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <h3 className="font-medium text-green-800 dark:text-green-200">Email enviado!</h3>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Verifique sua caixa de entrada e spam. O link expira em 1 hora.
              </p>
            </div>
          )}

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

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                height: '48px',
                backgroundColor: loading ? '#F3F4F6' : '#FBBF24',
                color: '#0F1115',
                border: 'none',
                borderRadius: '6px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                opacity: loading ? 0.5 : 1,
                fontFamily: 'inherit'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#F59E0B';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#FBBF24';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #0F1115',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Enviando...
                </>
              ) : emailSent ? (
                <>
                  <RotateCcw style={{ width: '16px', height: '16px' }} />
                  Reenviar Email
                </>
              ) : (
                <>
                  <Mail style={{ width: '16px', height: '16px' }} />
                  Enviar Link de Recuperação
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Lembrou da senha?{' '}
              <button
                onClick={() => window.location.href = '/login'}
                onMouseDown={() => window.location.href = '/login'}
                style={{
                  color: '#2563EB',
                  fontWeight: '500',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontFamily: 'inherit',
                  outline: 'none',
                  padding: '2px 4px',
                  borderRadius: '2px',
                  transition: 'all 0.2s',
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
                Fazer login
              </button>
            </p>
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function ForgotPasswordFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1115] via-[#1a1f2e] to-[#2563EB] flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        <p>Carregando...</p>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<ForgotPasswordFallback />}>
      <ForgotPasswordPageWithParams />
    </Suspense>
  );
}