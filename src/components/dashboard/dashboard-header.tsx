"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { EasyScaleLogo } from '@/components/easyscale-logo';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { useAuth } from '@/components/auth/auth-provider';
import { LogOut, User, Heart, LayoutDashboard, UserCircle, Bell, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter, usePathname } from 'next/navigation';

export const DashboardHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      logout();
      toast.success('Logout realizado com sucesso!');
      router.push('/login');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Heart, label: 'Favoritos', path: '/favorites' },
    { icon: UserCircle, label: 'Perfil', path: '/profile' },
    { icon: Settings, label: 'Admin', path: '/admin' },
  ];

  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="text-white">
              <EasyScaleLogo className="text-white" />
            </div>
            
            {/* Navegação */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                
                return (
                  <Button
                    key={item.path}
                    onClick={() => router.push(item.path)}
                    variant="ghost"
                    size="sm"
                    className={`relative px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-500/20 text-blue-400 shadow-sm border border-blue-500/30' 
                        : 'text-slate-300 hover:text-blue-400 hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"></div>
                    )}
                  </Button>
                );
              })}
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2 text-slate-300 hover:text-blue-400 hover:bg-slate-800/50 rounded-lg"
            >
              <Bell className="h-5 w-5" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            </Button>

            {/* User Info */}
            <div className="hidden md:flex items-center gap-3 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="text-sm">
                <div className="font-medium text-white">Olá, Admin!</div>
                <div className="text-slate-400 text-xs">{user?.email}</div>
              </div>
            </div>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};