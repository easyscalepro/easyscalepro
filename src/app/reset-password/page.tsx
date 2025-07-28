"use client";

import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkResetToken = async () => {
      try {
        // Verificar se há parâmetros de reset na URL
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const type = searchParams.get('type');

        console.log('🔍 Verificando token de reset:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });

        if (type === 'recovery' && accessToken && refreshToken) {
          // Definir a sessão com os tokens do email
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('❌ Erro ao definir sessão:', error);
            toast.error('Link de recuperação inválido ou expirado');
            setIsValidToken(false);
          } else {
            console.log('✅ Sessão de recuperação definida com sucesso');
            setIsValidToken(true);
          }
        } else {
          console.log('❌ Parâmetros de recuperação não encontrados');
          toast.error('Link de recuperação inválido. Solicite um novo link.');
          setIsValidToken(false);
        }
      } catch (error) {
        console.error('💥 Erro ao verificar token:', error);
        toast.error('Erro ao verificar link de recuperação');
        setIsValidToken(false);
      }
    };

    checkResetToken();
  }, [searchParams]);

  if (isValidToken === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F1115] via-[#1a1f2e] to-[#2563EB] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Verificando link de recuperação...</p>
        </div>
      </div>
    );
  }

  if (isValidToken === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F1115] via-[#1a1f2e] to-[#2563EB] flex items-center justify-center">
        <div className="text-white text-center max-w-md p-6">
          <h1 className="text-2xl font-bold mb-4">Link Inválido</h1>
          <p className="mb-4">O link de recuperação é inválido ou expirou.</p>
          <a 
            href="/login" 
            className="inline-block bg-yellow-500 text-black px-6 py-2 rounded-md font-medium hover:bg-yellow-400 transition-colors"
          >
            Voltar ao Login
          </a>
        </div>
      </div>
    );
  }

  return <ResetPasswordForm />;
}