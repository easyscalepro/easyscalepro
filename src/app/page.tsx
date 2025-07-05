"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Se o usuário está logado, redirecionar para dashboard
        router.push('/dashboard');
      } else {
        // Se não está logado, redirecionar para login
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  // Mostrar loading enquanto verifica autenticação
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Carregando EasyScale...
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Preparando sua experiência
          </p>
        </div>
      </div>
    </div>
  );
}