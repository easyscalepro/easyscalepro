"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  History, 
  User, 
  Edit, 
  Trash2, 
  UserPlus, 
  UserCheck, 
  UserX,
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AuditEntry {
  id: string;
  action: string;
  targetUserId: string;
  targetUserName: string;
  performedBy: string;
  performedByName: string;
  timestamp: string;
  details: any;
}

export const UserAuditLog: React.FC = () => {
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadAuditLog();
  }, []);

  const loadAuditLog = async () => {
    try {
      setLoading(true);
      
      // Simular dados de auditoria (em produção, viria do banco)
      const mockAuditData: AuditEntry[] = [
        {
          id: '1',
          action: 'user_created',
          targetUserId: 'user1',
          targetUserName: 'João Silva',
          performedBy: 'admin1',
          performedByName: 'Admin Sistema',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          details: { email: 'joao@empresa.com', role: 'user' }
        },
        {
          id: '2',
          action: 'user_updated',
          targetUserId: 'user2',
          targetUserName: 'Maria Santos',
          performedBy: 'admin1',
          performedByName: 'Admin Sistema',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          details: { field: 'status', oldValue: 'inativo', newValue: 'ativo' }
        },
        {
          id: '3',
          action: 'user_deleted',
          targetUserId: 'user3',
          targetUserName: 'Pedro Costa',
          performedBy: 'admin1',
          performedByName: 'Admin Sistema',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          details: { reason: 'Solicitação do usuário' }
        }
      ];

      setAuditEntries(mockAuditData);
    } catch (error) {
      console.error('Erro ao carregar log de auditoria:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    const icons = {
      user_created: <UserPlus className="h-4 w-4 text-green-600" />,
      user_updated: <Edit className="h-4 w-4 text-blue-600" />,
      user_deleted: <Trash2 className="h-4 w-4 text-red-600" />,
      user_activated: <UserCheck className="h-4 w-4 text-green-600" />,
      user_deactivated: <UserX className="h-4 w-4 text-orange-600" />,
      user_suspended: <UserX className="h-4 w-4 text-red-600" />
    };
    return icons[action as keyof typeof icons] || <User className="h-4 w-4 text-gray-600" />;
  };

  const getActionLabel = (action: string) => {
    const labels = {
      user_created: 'Usuário Criado',
      user_updated: 'Usuário Atualizado',
      user_deleted: 'Usuário Excluído',
      user_activated: 'Usuário Ativado',
      user_deactivated: 'Usuário Desativado',
      user_suspended: 'Usuário Suspenso'
    };
    return labels[action as keyof typeof labels] || action;
  };

  const getActionBadge = (action: string) => {
    const styles = {
      user_created: 'bg-green-100 text-green-800 border-green-200',
      user_updated: 'bg-blue-100 text-blue-800 border-blue-200',
      user_deleted: 'bg-red-100 text-red-800 border-red-200',
      user_activated: 'bg-green-100 text-green-800 border-green-200',
      user_deactivated: 'bg-orange-100 text-orange-800 border-orange-200',
      user_suspended: 'bg-red-100 text-red-800 border-red-200'
    };
    return (
      <Badge className={`${styles[action as keyof typeof styles] || 'bg-gray-100 text-gray-800 border-gray-200'} border text-xs`}>
        {getActionLabel(action)}
      </Badge>
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays} dias atrás`;
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportAuditLog = () => {
    const csvContent = [
      ['Timestamp', 'Ação', 'Usuário Alvo', 'Executado Por', 'Detalhes'],
      ...auditEntries.map(entry => [
        new Date(entry.timestamp).toLocaleString('pt-BR'),
        getActionLabel(entry.action),
        entry.targetUserName,
        entry.performedByName,
        JSON.stringify(entry.details)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_log_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-[#2563EB]" />
            Log de Auditoria
          </CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={exportAuditLog}
              variant="outline"
              size="sm"
              className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-gray-600">Carregando log...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {auditEntries.map((entry) => (
              <div key={entry.id} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  {getActionIcon(entry.action)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getActionBadge(entry.action)}
                    <span className="text-sm text-gray-500">
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    <strong>{entry.performedByName}</strong> {getActionLabel(entry.action).toLowerCase()} o usuário{' '}
                    <strong>{entry.targetUserName}</strong>
                  </div>
                  
                  {entry.details && Object.keys(entry.details).length > 0 && (
                    <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                      <strong>Detalhes:</strong>{' '}
                      {Object.entries(entry.details).map(([key, value]) => (
                        <span key={key} className="mr-3">
                          {key}: {String(value)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {auditEntries.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhuma atividade registrada ainda</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};