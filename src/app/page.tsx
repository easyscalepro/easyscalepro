"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return <HomeContent />;
}

function HomeContent() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            EasyScale - Comandos ChatGPT para PMEs
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Acesse mais de 1.000 comandos especializados de ChatGPT para impulsionar seu negócio
          </p>
          
          {user ? (
            <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
              <h2 className="text-2xl font-semibold mb-4">Bem-vindo!</h2>
              <p className="text-gray-600 mb-2">
                Olá, <span className="font-medium">{profile?.name || user.email}</span>
              </p>
              <p className="text-sm text-gray-500">
                Role: {profile?.role || 'user'}
              </p>
              <div className="mt-4">
                <a 
                  href="/dashboard" 
                  className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Ir para Dashboard
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
              <h2 className="text-2xl font-semibold mb-4">Faça Login</h2>
              <p className="text-gray-600 mb-4">
                Entre na sua conta para acessar os comandos
              </p>
              <div className="space-y-2">
                <a 
                  href="/login" 
                  className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-center"
                >
                  Fazer Login
                </a>
                <a 
                  href="/signup" 
                  className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors text-center"
                >
                  Criar Conta
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}