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
      description: 'Minha conta'
    },
    { 
      icon: Shield, 
      label: 'Admin', 
      path: '/admin',
      color: 'from-amber-500 to-orange-600',
      description: 'Painel administrativo'
    },
  ];

  return (
    <header className="bg-gradient-to-r from-blue-600/90 via-blue-700/90 to-purple-600/90 dark:from-blue-800/90 dark:via-blue-900/90 dark:to-purple-800/90 backdrop-blur-md border-b border-blue-300/30 dark:border-purple-700/30 sticky top-0 z-50 transition-colors relative overflow-hidden shadow-lg">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-white/10 to-purple-300/10 rounded-full blur-2xl"></div>
        <div className="absolute top-0 right-1/4 w-24 h-24 bg-gradient-to-br from-blue-300/10 to-white/10 rounded-full blur-xl"></div>
        
        {/* Animated shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full animate-pulse"></div>
      </div>

      <div className="container mx-auto px-6 py-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Enhanced Logo */}
            <div className="relative group">
              <EasyScaleLogo />
              <div className="absolute -inset-2 bg-gradient-to-r from-white/20 to-purple-300/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
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
                          ? 'bg-white/20 text-white hover:bg-white/30 shadow-lg border border-white/30' 
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {/* Icon with enhanced design */}
                      <div className={`relative p-1 rounded-lg ${isActive ? 'bg-white/20' : ''} transition-all duration-300`}>
                        <Icon className={`h-4 w-4 mr-2 ${isActive ? 'text-white' : 'text-white/80'} group-hover:scale-110 transition-transform duration-300`} />
                        
                        {/* Glow effect for active item */}
                        {isActive && (
                          <div className="absolute inset-0 rounded-lg bg-white/30 opacity-30 blur-md"></div>
                        )}
                      </div>
                      
                      <span className="font-semibold">{item.label}</span>
                      
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-lg">
                          <div className="absolute inset-0 bg-white rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </Button>
                    
                    {/* Tooltip */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-gray-900/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-30">
                      {item.description}
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900/90 rotate-45"></div>
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Enhanced Theme Toggle */}
            <div className="relative group">
              <ThemeToggle />
              <div className="absolute -inset-2 bg-gradient-to-r from-white/20 to-purple-300/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </div>

            {/* Enhanced Notifications */}
            <div className="relative group">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                className="relative p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 group-hover:scale-105 z-20"
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
              <div className="absolute -inset-2 bg-gradient-to-r from-white/20 to-purple-300/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </div>

            {/* Enhanced User Info */}
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-300 group hover:bg-white/15">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-white/20 to-purple-300/20 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 border border-white/30">
                  <User className="h-4 w-4 text-white" />
                </div>
                
                {/* Status indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-sm">
                  <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div className="text-sm">
                <div className="font-bold text-white flex items-center gap-1">
                  Olá, Admin!
                  <Crown className="h-3 w-3 text-yellow-300" />
                </div>
                <div className="text-white/70 text-xs flex items-center gap-1">
                  <Zap className="h-3 w-3 text-yellow-300" />
                  {user?.email}
                </div>
              </div>
            </div>
            
            {/* Enhanced Logout Button */}
            <div className="relative group">
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                type="button"
                className="border-2 border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50 transition-all duration-300 rounded-xl px-4 py-2 font-semibold group-hover:scale-105 z-20 backdrop-blur-sm"
              >
                <LogOut className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Sair
              </Button>
              
              {/* Glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-white/20 to-purple-300/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50"></div>
    </header>
  );
};