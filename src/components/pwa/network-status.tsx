"use client";

import React from 'react';
import { useNetworkStatus } from '@/hooks/use-pwa';
import { Wifi, WifiOff, Signal } from 'lucide-react';
import { toast } from 'sonner';

export const NetworkStatus: React.FC = () => {
  const { isOnline, connectionType } = useNetworkStatus();

  React.useEffect(() => {
    if (!isOnline) {
      toast.error('Você está offline. Algumas funcionalidades podem não estar disponíveis.', {
        duration: 5000,
      });
    } else {
      toast.success('Conexão restaurada!', {
        duration: 2000,
      });
    }
  }, [isOnline]);

  if (isOnline) {
    return null; // Não mostrar nada quando online
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white px-4 py-2 text-center text-sm font-medium">
      <div className="flex items-center justify-center gap-2">
        <WifiOff className="h-4 w-4" />
        <span>Você está offline</span>
      </div>
    </div>
  );
};

// Componente para mostrar qualidade da conexão
export const ConnectionQuality: React.FC = () => {
  const { connectionType, isOnline } = useNetworkStatus();

  if (!isOnline) return null;

  const getConnectionIcon = () => {
    switch (connectionType) {
      case 'slow-2g':
      case '2g':
        return <Signal className="h-3 w-3 text-red-500" />;
      case '3g':
        return <Signal className="h-3 w-3 text-yellow-500" />;
      case '4g':
        return <Signal className="h-3 w-3 text-green-500" />;
      default:
        return <Wifi className="h-3 w-3 text-blue-500" />;
    }
  };

  const getConnectionLabel = () => {
    switch (connectionType) {
      case 'slow-2g':
        return 'Conexão lenta';
      case '2g':
        return '2G';
      case '3g':
        return '3G';
      case '4g':
        return '4G';
      default:
        return 'WiFi';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow-lg z-40">
      <div className="flex items-center gap-2 text-xs">
        {getConnectionIcon()}
        <span className="text-gray-600 dark:text-gray-300">{getConnectionLabel()}</span>
      </div>
    </div>
  );
};