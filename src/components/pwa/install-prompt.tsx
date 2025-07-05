"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X, Smartphone, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if app is already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show install prompt after a delay
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if user has dismissed the prompt before
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const now = new Date();
      const daysSinceDismissed = (now.getTime() - dismissedDate.getTime()) / (1000 * 3600 * 24);
      
      // Show again after 7 days
      if (daysSinceDismissed < 7) {
        setShowInstallPrompt(false);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      if (isIOS) {
        toast.info('Para instalar no iOS: toque em "Compartilhar" e depois "Adicionar à Tela de Início"');
      }
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        toast.success('App instalado com sucesso!');
      } else {
        toast.info('Instalação cancelada');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      console.error('Erro ao instalar PWA:', error);
      toast.error('Erro ao instalar o app');
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
    toast.info('Você pode instalar o app a qualquer momento através do menu do navegador');
  };

  // Don't show if already installed or user is not on mobile
  if (isStandalone || (!deferredPrompt && !isIOS) || !showInstallPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
        <CardContent className="p-4 relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Smartphone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Instalar EasyScale</h3>
                  <p className="text-white/80 text-xs">Acesso rápido aos seus comandos</p>
                </div>
              </div>
              
              <Button
                onClick={handleDismiss}
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white hover:bg-white/20 p-1 h-auto"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2 mb-4 text-xs text-white/90">
              <Zap className="h-3 w-3" />
              <span>Funciona offline</span>
              <span>•</span>
              <span>Notificações</span>
              <span>•</span>
              <span>Acesso rápido</span>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleInstallClick}
                size="sm"
                className="flex-1 bg-white text-blue-600 hover:bg-white/90 font-bold"
              >
                <Download className="h-4 w-4 mr-2" />
                {isIOS ? 'Instruções' : 'Instalar'}
              </Button>
              
              <Button
                onClick={handleDismiss}
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white hover:bg-white/20"
              >
                Agora não
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};