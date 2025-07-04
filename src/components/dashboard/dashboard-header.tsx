"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { EasyScaleLogo } from '@/components/easyscale-logo';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { useAuth } from '@/components/auth/auth-provider';
import { LogOut, User, Heart, LayoutDashboard, UserCircle, Bell } from 'lucide-react';
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
  ];

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <EasyScaleLogo />
            
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
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
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
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
            >
              <Bell className="h-5 w-5" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            </Button>

            {/* User Info */}
            <div className="hidden md:flex items-center gap-3 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-900 dark:text-gray-100">Olá, Julio!</div>
                <div className="text-gray-500 dark:text-gray-400 text-xs">{user?.email}</div>
              </div>
            </div>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 transition-colors"
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