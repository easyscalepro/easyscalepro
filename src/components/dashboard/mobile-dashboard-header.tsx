"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { EasyScaleLogo } from '@/components/easyscale-logo';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { useAuth } from '@/components/auth/auth-provider';
import { 
  Menu,
  LogOut, 
  User, 
  Heart, 
  LayoutDashboard, 
  UserCircle, 
  Bell, 
  Shield,
  Search,
  Plus,
  Zap,
  Star,
  Crown,
  Settings,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter, usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

export const MobileDashboardHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      logout();
      toast.success('Logout realizado com sucesso!');
      router.push('/login');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Erro no logout:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  const handleNavigation = (path: string, label: string) => {
    try {
      router.push(path);
      toast.success(`Navegando para ${label}`);
      setIsMenuOpen(false);
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
      description: 'Página inicial com todos os comandos'
    },
    { 
      icon: Heart, 
      label: 'Favoritos', 
      path: '/favorites',
      color: 'from-red-500 to-pink-600',
      description: 'Seus comandos salvos',
      badge: '12'
    },
    { 
      icon: UserCircle, 
      label: 'Perfil', 
      path: '/profile',
      color: 'from-purple-500 to-violet-600',
      description: 'Gerencie sua conta'
    },
    { 
      icon: Shield, 
      label: 'Admin', 
      path: '/admin',
      color: 'from-amber-500 to-orange-600',
      description: 'Painel administrativo'
    },
  ];

  const quickActions = [
    {
      icon: Search,
      label: 'Buscar',
      action: () => {
        // Focus search input or open search modal
        const searchInput = document.querySelector('input[placeholder*="Buscar"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          setIsMenuOpen(false);
        }
      },
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Plus,
      label: 'Novo Comando',
      action: () => handleNavigation('/admin/commands/new', 'Novo Comando'),
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: MessageSquare,
      label: 'Suporte',
      action: () => toast.info('Em breve: Chat de suporte'),
      color: 'from-purple-500 to-violet-600'
    }
  ];

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 transition-colors">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <EasyScaleLogo className="scale-90" />
            </div>
            
            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl"
              >
                <Bell className="h-5 w-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </Button>

              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Menu Trigger */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                
                <SheetContent side="right" className="w-80 p-0 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            Olá, Admin!
                            <Crown className="h-4 w-4 text-amber-500" />
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Zap className="h-3 w-3 text-blue-500" />
                            {user?.email}
                          </div>
                        </div>
                      </div>
                      
                      {/* Quick stats */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">45</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Comandos Usados</div>
                        </div>
                        <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">12</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Favoritos</div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <Star className="h-4 w-4 text-amber-500" />
                        Ações Rápidas
                      </h3>
                      <div className="grid grid-cols-3 gap-2">
                        {quickActions.map((action, index) => {
                          const Icon = action.icon;
                          return (
                            <Button
                              key={index}
                              onClick={action.action}
                              variant="ghost"
                              className="flex flex-col items-center gap-2 p-3 h-auto text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl"
                            >
                              <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color}`}>
                                <Icon className="h-4 w-4 text-white" />
                              </div>
                              <span className="text-xs font-medium">{action.label}</span>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Navigation */}
                    <div className="flex-1 p-4">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <LayoutDashboard className="h-4 w-4 text-blue-500" />
                        Navegação
                      </h3>
                      <nav className="space-y-2">
                        {navItems.map((item) => {
                          const Icon = item.icon;
                          const isActive = pathname === item.path;
                          
                          return (
                            <Button
                              key={item.path}
                              onClick={() => handleNavigation(item.path, item.label)}
                              variant="ghost"
                              className={`w-full justify-start text-left p-3 h-auto rounded-xl transition-all duration-200 ${
                                isActive 
                                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50' 
                                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                              }`}
                            >
                              <div className="flex items-center gap-3 w-full">
                                <div className={`p-2 rounded-lg ${isActive ? `bg-gradient-to-r ${item.color}` : 'bg-gray-100 dark:bg-gray-800'} transition-all duration-200`}>
                                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                                </div>
                                <div className="flex-1 text-left">
                                  <div className="font-semibold text-sm">{item.label}</div>
                                  <div className="text-xs opacity-70">{item.description}</div>
                                </div>
                                {item.badge && (
                                  <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">
                                    {item.badge}
                                  </Badge>
                                )}
                              </div>
                            </Button>
                          );
                        })}
                      </nav>
                    </div>
                    
                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl p-3"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Configurações
                      </Button>
                      
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl p-3"
                      >
                        <HelpCircle className="h-4 w-4 mr-3" />
                        Ajuda
                      </Button>
                      
                      <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full justify-start text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl p-3"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sair
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Header (hidden on mobile) */}
      <header className="hidden lg:block bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 transition-colors relative overflow-hidden">
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
              <div className="relative group">
                <ThemeToggle />
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
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
                    <User className="h-4 w-4 text-white" />
                  </div>
                  
                  {/* Status indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white dark:border-gray-800 shadow-sm">
                    <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                <div className="text-sm">
                  <div className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1">
                    Olá, Admin!
                    <Crown className="h-3 w-3 text-amber-500" />
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs flex items-center gap-1">
                    <Zap className="h-3 w-3 text-blue-500" />
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
                  className="border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 transition-all duration-300 rounded-xl px-4 py-2 font-semibold group-hover:scale-105 z-20"
                >
                  <LogOut className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Sair
                </Button>
                
                {/* Glow effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
      </header>
    </>
  );
};