"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useRouter } from 'next/navigation';
import { LoadingScreen } from '@/components/loading-screen';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && profile?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, profile, loading, router]);

  // Simular carregamento da página admin
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading || pageLoading) {
    return (
      <LoadingScreen 
        message="Carregando área administrativa..."
        submessage="Verificando permissões de administrador"
      />
    );
  }

  if (!user || profile?.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
}