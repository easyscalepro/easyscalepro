"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { EasyScaleLogo } from '@/components/easyscale-logo';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  BarChart3, 
  Settings,
  LogOut,
  Plus
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';

export const AdminSidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: FileText, label: 'Comandos', path: '/admin/commands' },
    { icon: Users, label: 'Usuários', path: '/admin/users' },
    { icon: BarChart3, label: 'Relatórios', path: '/admin/reports' },
    { icon: Settings, label: 'Configurações', path: '/admin/settings' },
  ];

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
    <div className="w-64 bg-[#0F1115] text-white h-screen flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <EasyScaleLogo className="text-white" />
        <p className="text-sm text-gray-400 mt-2">Painel Administrativo</p>
      </div>

      <div className="flex-1 p-4">
        <Button
          onClick={() => router.push('/admin/commands/new')}
          className="w-full mb-6 bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0F1115] font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Comando
        </Button>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <Button
                key={item.path}
                onClick={() => router.push(item.path)}
                variant="ghost"
                className={`w-full justify-start text-left ${
                  isActive 
                    ? 'bg-[#2563EB] text-white hover:bg-[#1d4ed8]' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-700">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sair
        </Button>
      </div>
    </div>
  );
};