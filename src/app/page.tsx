"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { LoadingScreen } from '@/components/loading-screen';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);

  // Simular carregamento da página
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Redirecionar baseado no status de autenticação
  useEffect(() => {
    if (!loading && !pageLoading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, pageLoading, router]);

  if (loading || pageLoading) {
    return (
      <LoadingScreen 
        message="Carregando EasyScale..."
        submessage="Inicializando plataforma"
      />
    );
  }

  return null;
}