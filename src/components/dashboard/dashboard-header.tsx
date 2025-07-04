"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { EasyScaleLogo } from '@/components/easyscale-logo';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/components/auth/auth-provider';
import { LogOut, User } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const DashboardHeader: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logout realizado com sucesso!');
      router.push('/login');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <EasyScaleLogo />
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[#0F1115]">
            <User className="h-4 w-4" />
            <span className="text-sm font-medium">{user?.email}</span>
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