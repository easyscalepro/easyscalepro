"use client";

import { useState, useEffect } from 'react';

interface PWAInfo {
  isStandalone: boolean;
  isInstallable: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  canInstall: boolean;
  deferredPrompt: any;
}

export function usePWA(): PWAInfo {
  const [pwaInfo, setPwaInfo] = useState<PWAInfo>({
    isStandalone: false,
    isInstallable: false,
    isIOS: false,
    isAndroid: false,
    canInstall: false,
    deferredPrompt: null,
  });

  useEffect(() => {
    // Detectar se está em modo standalone (PWA instalado)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone ||
                        document.referrer.includes('android-app://');

    // Detectar plataforma
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    // Verificar se pode instalar
    const canInstall = !isStandalone && (isIOS || isAndroid || 'serviceWorker' in navigator);

    setPwaInfo(prev => ({
      ...prev,
      isStandalone,
      isIOS,
      isAndroid,
      canInstall,
    }));

    // Listener para evento de instalação
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPwaInfo(prev => ({
        ...prev,
        isInstallable: true,
        deferredPrompt: e,
      }));
    };

    // Listener para quando o app é instalado
    const handleAppInstalled = () => {
      setPwaInfo(prev => ({
        ...prev,
        isStandalone: true,
        isInstallable: false,
        deferredPrompt: null,
      }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  return pwaInfo;
}

// Hook para instalar PWA
export function useInstallPWA() {
  const { deferredPrompt, isInstallable } = usePWA();

  const installPWA = async () => {
    if (!deferredPrompt || !isInstallable) {
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      return outcome === 'accepted';
    } catch (error) {
      console.error('Erro ao instalar PWA:', error);
      return false;
    }
  };

  return { installPWA, canInstall: isInstallable };
}

// Hook para detectar conexão
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    const updateConnectionType = () => {
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection;
      
      if (connection) {
        setConnectionType(connection.effectiveType || 'unknown');
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    updateOnlineStatus();
    updateConnectionType();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return { isOnline, connectionType };
}