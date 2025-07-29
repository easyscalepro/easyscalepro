"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { EasyScaleLogo } from '@/components/easyscale-logo';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { useAuth } from '@/components/auth/auth-provider';
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
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter, usePathname } from 'next/navigation';

export const DashboardHeader: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🔴 Botão de logout clicado!');
    
    try {
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

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40 transition-colors relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-2xl"></div>
        <div className="absolute top-0 right-1/4 w-24 h-24 bg-gradient-to-br from-emerald-400/5 to-teal-400/5 rounded-full blur-xl"></div>
      </div>

      <div className="container mx-auto px-6 py-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Enhanced Logo */}
            <div className="relative group">
              <EasyScaleLogo />
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </div>
            
            {/* Enhanced Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                
                return (
                  <div key={item.path} className="relative group">
                    <Button
                      onClick={() => handleNavigation(item.path, item.label)}
                      variant="ghost"
                      size="sm"
                      type="button"
                      className={`relative px-4 py-3 rounded-xl transition-all duration-300 group-hover:scale-105 z-20 ${
                        isActive 
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 shadow-lg border border-blue-200/50 dark:border-blue-700/50' 
                          : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 dark:hover:from-gray-800 dark:hover:to-blue-900/20'
                      }`}
                    >
                      {/* Icon with enhanced design */}
                      <div className={`relative p-1 rounded-lg ${isActive ? `bg-gradient-to-r ${item.color}` : ''} transition-all duration-300`}>
                        <Icon className={`h-4 w-4 mr-2 ${isActive ? 'text-white' : ''} group-hover:scale-110 transition-transform duration-300`} />
                        
                        {/* Glow effect for active item */}
                        {isActive && (
                          <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${item.color} opacity-30 blur-md`}></div>
                        )}
                      </div>
                      
                      <span className="font-semibold">{item.label}</span>
                      
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </Button>
                    
                    {/* Tooltip */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-30">
                      {item.description}
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-100 rotate-45"></div>
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
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
                className="relative p-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 rounded-xl transition-all duration-300 group-hover:scale-105 z-20"
              >
                <div className="relative">
                  <Bell className="h-5 w-5" />
                  
                  {/* Notification badge */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                  
                  {/* Pulse animation */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75"></div>
                </div>
              </Button>
              
              {/* Glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </div>

            {/* Enhanced User Info */}
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <User className="h-4 w-4  text-white" />
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
            
            {/* BOTÃO DE LOGOUT SIMPLIFICADO */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              type="button"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
    </header>
  );
};