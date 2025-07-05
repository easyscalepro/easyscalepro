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
  Plus,
  Zap
} from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { toast } from 'sonner';

export const AdminSidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: FileText, label: 'Comandos', path: '/admin/commands' },
    { icon: Users, label: 'Usuários', path: '/admin/users' },
    { icon: Zap, label: 'Integrações', path: '/admin/integrations' },
    { icon: BarChart3, label: 'Relatórios', path: '/admin/reports' },
    { icon: Settings, label: 'Configurações', path: '/admin/settings' },
  ];

  const handleNavigation = (path: string) => {
    console.log('Navegando para:', path);
    try {
      router.push(path);
    } catch (error) {
      console.error('Erro na navegação:', error);
      toast.error('Erro ao navegar');
    }
  };

  const handleNewCommand = () => {
    console.log('Criando novo comando');
    try {
      router.push('/admin/commands/new');
    } catch (error) {
      console.error('Erro ao criar comando:', error);
      toast.error('Erro ao abrir formulário');
    }
  };

  const handleLogout = async () => {
    console.log('Iniciando processo de logout...');
    
    try {
      // Mostrar loading
      toast.loading('Fazendo logout...', { id: 'logout' });
      
      // Fazer logout
      await signOut();
      
      // Limpar toast de loading
      toast.dismiss('logout');
      
      // Redirecionar para login
      router.push('/login');
      
      // Mostrar sucesso
      toast.success('Logout realizado com sucesso!');
      
    } catch (error: any) {
      console.error('Erro no logout:', error);
      
      // Limpar toast de loading
      toast.dismiss('logout');
      
      // Mostrar erro específico
      if (error.message) {
        toast.error(`Erro ao fazer logout: ${error.message}`);
      } else {
        toast.error('Erro ao fazer logout. Tente novamente.');
      }
      
      // Fallback: forçar redirecionamento mesmo com erro
      setTimeout(() => {
        try {
          router.push('/login');
        } catch (redirectError) {
          console.error('Erro no redirecionamento:', redirectError);
          // Último recurso: recarregar a página
          window.location.href = '/login';
        }
      }, 2000);
    }
  };

  return (
    <div className="w-64 bg-[#0F1115] text-white h-screen flex flex-col relative z-10">
      <div className="p-6 border-b border-gray-700">
        <EasyScaleLogo className="text-white" />
        <p className="text-sm text-gray-400 mt-2">Painel Administrativo</p>
      </div>

      <div className="flex-1 p-4">
        <Button
          onClick={handleNewCommand}
          className="w-full mb-6 bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0F1115] font-medium transition-all duration-200 hover:scale-105 relative z-20"
          type="button"
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
                onClick={() => handleNavigation(item.path)}
                variant="ghost"
                type="button"
                className={`w-full justify-start text-left transition-all duration-200 hover:scale-105 relative z-20 ${
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
          type="button"
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200 hover:scale-105 relative z-20"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sair
        </Button>
      </div>
    </div>
  );
};