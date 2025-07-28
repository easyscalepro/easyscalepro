"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { EasyScaleLogo } from '@/components/easyscale-logo';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { useAuth } from '@/components/auth/auth-provider';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  LogOut, 
  User, 
  Heart, 
  LayoutDashboard, 
  UserCircle, 
  Bell, 
  Settings,
  Sparkles,
  Crown,
  Zap,
  Star,
  Shield,
  Menu,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter, usePathname } from 'next/navigation';

export const DashboardHeader: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🔴 Botão de logout clicado!');
    
    try {
      // Fechar menu mobile se estiver aberto
      setMobileMenuOpen(false);
      
      // Mostrar loading
      toast.loading('Fazendo logout...', { id: 'logout' });
      
      console.log('🔄 Chamando signOut...');
      
      // Fazer logout
      await signOut();
      
      console.log('✅ SignOut concluído, redirecionando...');
      
      // Limpar toast de loading
      toast.dismiss('logout');
      
      // Redirecionar para login
      router.push('/login');
      
      // Mostrar sucesso
      toast.success('Logout realizado com sucesso!');
      
    } catch (error: any) {
      console.error('❌ Erro no logout:', error);
      
      // Limpar toast de loading
      toast.dismiss('logout');
      
      // Mostrar erro
      toast.error('Erro ao fazer logout');
      
      // Fallback: forçar redirecionamento
      setTimeout(() => {
        try {
          router.push('/login');
        } catch (redirectError) {
          window.location.href = '/login';
        }
      }, 1000);
    }
  };

  const handleNavigation = (path: string, label: string) => {
    try {
      // Fechar menu mobile
      setMobileMenuOpen(false);
      router.push(path);
    } catch (error) {
      console.error('Erro na navegação:', error);
      toast.error(`Erro ao navegar para ${label}`);
    }
  };

  const navItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/dashboard',
      color: 'from-blue-500 to-blue-600',
      description: 'Página inicial'
    },
    { 
      icon: Heart, 
      label: 'Favoritos', 
      path: '/favorites',
      color: 'from-red-500 to-pink-600',
      description: 'Comandos salvos'
    },
    { 
      icon: UserCircle, 
      label: 'Perfil', 
      path: '/profile',
      color: 'from-purple-500 to-violet-600',
      description: 'Sua conta'
    },
  ];

  // Adicionar item admin se o usuário for admin
  if (profile?.role === 'admin') {
    navItems.push({ 
      icon: Shield, 
      label: 'Admin', 
      path: '/admin',
      color: 'from-amber-500 to-orange-600',
      description: 'Painel administrativo'
    });
  }

  // Componente de navegação reutilizável
  const NavigationItems = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;
        
        return (
          <div key={item.path} className="relative group">
            <Button
              onClick={() => handleNavigation(item.path, item.label)}
              variant="ghost"
              size={isMobile ? "lg" : "sm"}
              type="button"
              className={`relative ${isMobile ? 'w-full justify-start px-6 py-4 text-base' : 'px-4 py-3'} rounded-xl transition-all duration-300 group-hover:scale-105 z-20 ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 shadow-lg border border-blue-200/50 dark:border-blue-700/50' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 dark:hover:from-gray-800 dark:hover:to-blue-900/20'
              }`}
            >
              {/* Icon with enhanced design */}
              <div className={`relative p-1 rounded-lg ${isActive ? `bg-gradient-to-r ${item.color}` : ''} transition-all duration-300`}>
                <Icon className={`h-4 w-4 ${isMobile ? 'mr-3' : 'mr-2'} ${isActive ? 'text-white' : ''} group-hover:scale-110 transition-transform duration-300`} />
                
                {/* Glow effect for active item */}
                {isActive && (
                  <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${item.color} opacity-30 blur-md`}></div>
                )}
              </div>
              
              <span className="font-semibold">{item.label}</span>
              
              {/* Active indicator */}
              {isActive && !isMobile && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </Button>
            
            {/* Tooltip apenas para desktop */}
            {!isMobile && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-30">
                {item.description}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-100 rotate-45"></div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40 transition-colors relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-2xl"></div>
        <div className="absolute top-0 right-1/4 w-24 h-24 bg-gradient-to-br from-emerald-400/5 to-teal-400/5 rounded-full blur-xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-8">
            {/* Enhanced Logo */}
            <div className="relative group">
              <EasyScaleLogo />
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </div>
            
            {/* Desktop Navigation */}
            {!isMobile && (
              <nav className="hidden md:flex items-center gap-2">
                <NavigationItems />
              </nav>
            )}
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Enhanced Theme Toggle */}
            <div className="relative group z-50">
              <ThemeToggle />
              <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10"></div>
            </div>

            {/* Enhanced Notifications */}
            <div className="relative group">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                className="relative p-2 sm:p-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 rounded-xl transition-all duration-300 group-hover:scale-105 z-20"
              >
                <div className="relative">
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                  
                  {/* Notification badge */}
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full"></div>
                  </div>
                  
                  {/* Pulse animation */}
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-ping opacity-75"></div>
                </div>
              </Button>
              
              {/* Glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </div>

            {/* Enhanced User Info - Hidden on mobile */}
            {!isMobile && (
              <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  
                  {/* Status indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white dark:border-gray-800 shadow-sm">
                    <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                <div className="text-sm">
                  <div className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1">
                    Olá, {profile?.name || user?.email?.split('@')[0] || 'Usuário'}!
                    {profile?.role === 'admin' && <Crown className="h-3 w-3 text-amber-500" />}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs flex items-center gap-1">
                    <Zap className="h-3 w-3 text-blue-500" />
                    {user?.email}
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 rounded-xl transition-all duration-300"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                  <SheetHeader className="sr-only">
                    <SheetTitle>Menu de Navegação</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                    {/* Header do menu mobile */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <EasyScaleLogo />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setMobileMenuOpen(false)}
                          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                      
                      {/* User info mobile */}
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white dark:border-gray-800">
                            <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1 truncate">
                            {profile?.name || user?.email?.split('@')[0] || 'Usuário'}
                            {profile?.role === 'admin' && <Crown className="h-3 w-3 text-amber-500 flex-shrink-0" />}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user?.email}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Navigation mobile */}
                    <div className="flex-1 p-6">
                      <nav className="space-y-2">
                        <NavigationItems isMobile={true} />
                      </nav>
                    </div>

                    {/* Footer do menu mobile */}
                    <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                      <Button
                        variant="ghost"
                        size="lg"
                        className="w-full justify-start px-6 py-4 text-base text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 rounded-xl"
                      >
                        <Bell className="h-4 w-4 mr-3" />
                        Notificações
                        <div className="ml-auto w-2 h-2 bg-red-500 rounded-full"></div>
                      </Button>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-start gap-3 px-6 py-4 text-base font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-all duration-200 border border-red-200 dark:border-red-800"
                        type="button"
                      >
                        <LogOut className="h-4 w-4" />
                        Sair
                      </button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
            
            {/* Desktop Logout Button */}
            {!isMobile && (
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                type="button"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
    </header>
  );
};