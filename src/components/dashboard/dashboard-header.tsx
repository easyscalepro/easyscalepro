"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { EasyScaleLogo } from '@/components/easyscale-logo';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { useAuth } from '@/components/auth/auth-provider';
import { LogOut, User, Heart, LayoutDashboard, UserCircle, Bell, Settings, Sparkles } from 'lucide-react';
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
    <header className="relative bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10"></div>
      
      <div className="relative container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FBBF24] to-[#F59E0B] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-[#0F1115] font-bold text-lg">ES</span>
              </div>
              <span className="text-2xl font-bold text-white">EasyScale</span>
            </div>
            
            {/* Navegação */}
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                
                return (
                  <Button
                    key={item.path}
                    onClick={() => router.push(item.path)}
                    variant="ghost"
                    size="sm"
                    className={`relative px-4 py-2 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-[#FBBF24]/20 to-[#F59E0B]/20 text-[#FBBF24] shadow-lg backdrop-blur-sm border border-[#FBBF24]/30' 
                        : 'text-white/80 hover:text-[#FBBF24] hover:bg-white/10'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#FBBF24] rounded-full shadow-lg"></div>
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
              className="relative p-2 text-white/80 hover:text-[#FBBF24] hover:bg-white/10 rounded-xl transition-all duration-300"
            >
              <Bell className="h-5 w-5" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-[#FBBF24] rounded-full shadow-lg animate-pulse"></div>
            </Button>

            {/* User Info */}
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-8 h-8 bg-gradient-to-r from-[#2563EB] to-[#FBBF24] rounded-full flex items-center justify-center shadow-lg">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="text-sm">
                <div className="font-semibold text-white flex items-center gap-1">
                  Olá, Admin!
                  <Sparkles className="h-3 w-3 text-[#FBBF24]" />
                </div>
                <div className="text-white/70 text-xs">{user?.email}</div>
              </div>
            </div>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-white/30 text-white hover:bg-red-500/20 hover:text-red-300 hover:border-red-400/50 transition-all duration-300 rounded-xl backdrop-blur-sm"
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