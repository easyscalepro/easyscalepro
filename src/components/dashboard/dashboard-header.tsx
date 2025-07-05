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
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    console.log('Fazendo logout do header');
    try {
      logout();
      toast.success('Logout realizado com sucesso!');
      router.push('/login');
    } catch (error) {
      console.error('Erro no logout:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  const handleNavigation = (path: string, label: string) => {
    console.log('Navegando para:', path, label);
    try {
      router.push(path);
      toast.success(`Navegando para ${label}`);
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
      description: 'Página inicial'
    },
    { 
      icon: Heart, 
      label: 'Favoritos', 
      path: '/favorites',
      description: 'Comandos salvos'
    },
    { 
      icon: UserCircle, 
      label: 'Perfil', 
      path: '/profile',
      description: 'Minha conta'
    },
    { 
      icon: Shield, 
      label: 'Admin', 
      path: '/admin',
      description: 'Painel administrativo'
    },
  ];

  return (
    <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-blue-200/20 dark:border-blue-800/20 sticky top-0 z-50 transition-all duration-300 relative overflow-hidden shadow-sm">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-white/10 to-purple-50/30 dark:from-blue-950/30 dark:via-gray-900/10 dark:to-purple-950/30"></div>
      
      {/* Decorative accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>

      <div className="container mx-auto px-6 py-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo with subtle enhancement */}
            <div className="relative group">
              <EasyScaleLogo />
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {/* Refined Navigation */}
            <nav className="hidden md:flex items-center gap-1">
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
                      className={`relative px-4 py-2.5 rounded-lg transition-all duration-300 group-hover:scale-[1.02] ${
                        isActive 
                          ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200/50 dark:border-blue-700/50' 
                          : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/30'
                      }`}
                    >
                      <Icon className={`h-4 w-4 mr-2 transition-all duration-300 ${
                        isActive ? 'text-blue-600 dark:text-blue-400' : ''
                      } group-hover:scale-110`} />
                      <span className="font-medium">{item.label}</span>
                      
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full">
                          <div className="absolute inset-0 bg-blue-500 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </Button>
                    
                    {/* Refined tooltip */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1.5 bg-gray-900/95 dark:bg-gray-800/95 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap backdrop-blur-sm">
                      {item.description}
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900/95 dark:bg-gray-800/95 rotate-45"></div>
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <div className="relative">
              <ThemeToggle />
            </div>

            {/* Notifications */}
            <div className="relative group">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                className="relative p-2.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 rounded-lg transition-all duration-300 group-hover:scale-105"
              >
                <Bell className="h-5 w-5" />
                
                {/* Notification badge */}
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border border-white dark:border-gray-900">
                  <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                </div>
              </Button>
            </div>

            {/* User Info */}
            <div className="hidden md:flex items-center gap-3 px-3 py-2 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg border border-blue-200/30 dark:border-blue-800/30 hover:border-blue-300/50 dark:hover:border-blue-700/50 transition-all duration-300 group">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                  <User className="h-4 w-4 text-white" />
                </div>
                
                {/* Status indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900">
                  <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div className="text-sm">
                <div className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1">
                  Admin
                  <Crown className="h-3 w-3 text-amber-500" />
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-xs flex items-center gap-1">
                  <Zap className="h-3 w-3 text-blue-500" />
                  Online
                </div>
              </div>
            </div>
            
            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              type="button"
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-700 transition-all duration-300 rounded-lg px-3 py-2 font-medium group"
            >
              <LogOut className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200/50 dark:via-blue-800/50 to-transparent"></div>
    </header>
  );
};