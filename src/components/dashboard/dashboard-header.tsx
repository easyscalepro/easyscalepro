"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { EasyScaleLogo } from '@/components/easyscale-logo';
import { useAuth } from '@/components/auth/auth-provider';
import { LogOut, User, Heart, LayoutDashboard, UserCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter, usePathname } from 'next/navigation';

export const DashboardHeader: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      toast.success('Logout realizado com sucesso!');
      router.push('/login');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <EasyScaleLogo />
          
          {/* Navegação */}
          <nav className="hidden md:flex items-center gap-4">
            <Button
              onClick={() => router.push('/dashboard')}
              variant={pathname === '/dashboard' ? 'default' : 'ghost'}
              size="sm"
              className={pathname === '/dashboard' 
                ? 'bg-[#2563EB] text-white' 
                : 'text-gray-600 hover:text-[#2563EB]'
              }
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            
            <Button
              onClick={() => router.push('/favorites')}
              variant={pathname === '/favorites' ? 'default' : 'ghost'}
              size="sm"
              className={pathname === '/favorites' 
                ? 'bg-[#2563EB] text-white' 
                : 'text-gray-600 hover:text-[#2563EB]'
              }
            >
              <Heart className="h-4 w-4 mr-2" />
              Favoritos
            </Button>

            <Button
              onClick={() => router.push('/profile')}
              variant={pathname === '/profile' ? 'default' : 'ghost'}
              size="sm"
              className={pathname === '/profile' 
                ? 'bg-[#2563EB] text-white' 
                : 'text-gray-600 hover:text-[#2563EB]'
              }
            >
              <UserCircle className="h-4 w-4 mr-2" />
              Perfil
            </Button>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[#0F1115]">
            <User className="h-4 w-4" />
            <span className="text-sm font-medium">demo@easyscale.com</span>
          </div>
          
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};