"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  Settings, 
  LogOut, 
  User, 
  Shield,
  Menu,
  X,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { toast } from 'sonner';
import Image from 'next/image';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    // Confirmação antes de sair
    const confirmed = window.confirm(
      'Tem certeza que deseja sair?\n\nVocê será redirecionado para a página de login.'
    );
    
    if (!confirmed) {
      return;
    }

    try {
      setIsLoggingOut(true);
      toast.loading('Fazendo logout...', { id: 'logout' });

      // Fazer logout
      await signOut();

      toast.dismiss('logout');
      toast.success('Logout realizado com sucesso!', {
        description: 'Você foi desconectado da plataforma'
      });

      // Redirecionar para login
      router.push('/login');

    } catch (error: any) {
      console.error('Erro ao fazer logout:', error);
      toast.dismiss('logout');
      toast.error('Erro ao fazer logout', {
        description: error.message || 'Tente novamente'
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const menuItems = [
    {
      icon: Users,
      label: 'Usuários',
      href: '/admin/users',
      description: 'Gerenciar usuários da plataforma'
    },
    {
      icon: Settings,
      label: 'Configurações',
      href: '/admin/settings',
      description: 'Configurações do sistema'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo e título */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden"
              >
                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 relative">
                  <Image
                    src="https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png"
                    alt="EasyScale Logo"
                    fill
                    className="object-contain"
                    sizes="32px"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    EasyScale Admin
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Painel de Administração
                  </p>
                </div>
              </div>
            </div>

            {/* Informações do usuário e logout */}
            <div className="flex items-center gap-4">
              {/* Info do usuário */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {(profile?.name || user?.email || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {profile?.name || 'Usuário'}
                  </div>
                  <div className="flex items-center gap-1">
                    {profile?.role === 'admin' && (
                      <Shield className="h-3 w-3 text-purple-600" />
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {profile?.role === 'admin' ? 'Administrador' : 
                       profile?.role === 'moderator' ? 'Moderador' : 'Usuário'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botão de logout funcional */}
              <Button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-background shadow-sm hover:bg-accent h-8 text-xs border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 transition-all duration-300 rounded-xl px-4 py-2 font-semibold group-hover:scale-105 z-20 lasy-highlight"
                title="Sair da plataforma"
              >
                {isLoggingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span className="hidden sm:inline">Saindo...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Sair</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          transition-transform duration-300 ease-in-out
          pt-16 lg:pt-0
        `}>
          <div className="p-6">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  className="w-full justify-start gap-3 h-12 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    router.push(item.href);
                    setIsSidebarOpen(false);
                  }}
                >
                  <item.icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.description}
                    </div>
                  </div>
                </Button>
              ))}
            </nav>
          </div>

          {/* Status do usuário na sidebar */}
          <div className="absolute bottom-6 left-6 right-6">
            <Card className="border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {(profile?.name || user?.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-white truncate">
                      {profile?.name || 'Usuário'}
                    </div>
                    <div className="flex items-center gap-1">
                      {profile?.status === 'ativo' ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 text-orange-500" />
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {profile?.status || 'Ativo'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Overlay para mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Conteúdo principal */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};