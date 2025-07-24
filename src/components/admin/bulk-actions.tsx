"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Trash2, 
  Mail, 
  Download,
  AlertTriangle 
} from 'lucide-react';
import { toast } from 'sonner';
import type { User } from '@/contexts/users-context';

interface BulkActionsProps {
  users: User[];
  selectedUsers: string[];
  onSelectionChange: (userIds: string[]) => void;
  onBulkAction: (action: string, userIds: string[]) => Promise<void>;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  users,
  selectedUsers,
  onSelectionChange,
  onBulkAction
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [bulkAction, setBulkAction] = useState('');

  const allSelected = users.length > 0 && selectedUsers.length === users.length;
  const someSelected = selectedUsers.length > 0 && selectedUsers.length < users.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(users.map(user => user.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedUsers.length === 0) {
      toast.error('Selecione uma ação e pelo menos um usuário');
      return;
    }

    const actionLabels = {
      activate: 'ativar',
      deactivate: 'desativar',
      suspend: 'suspender',
      delete: 'excluir',
      export: 'exportar',
      email: 'enviar email para'
    };

    const actionLabel = actionLabels[bulkAction as keyof typeof actionLabels];
    const userCount = selectedUsers.length;

    if (bulkAction === 'delete') {
      const confirmed = confirm(
        `Tem certeza que deseja excluir ${userCount} usuário(s)?\n\nEsta ação não pode ser desfeita.`
      );
      if (!confirmed) return;
    } else if (bulkAction !== 'export' && bulkAction !== 'email') {
      const confirmed = confirm(
        `Deseja ${actionLabel} ${userCount} usuário(s) selecionado(s)?`
      );
      if (!confirmed) return;
    }

    try {
      setIsProcessing(true);
      await onBulkAction(bulkAction, selectedUsers);
      
      toast.success(`${userCount} usuário(s) processado(s) com sucesso!`);
      
      // Limpar seleção após ação bem-sucedida
      onSelectionChange([]);
      setBulkAction('');
      
    } catch (error: any) {
      console.error('Erro na ação em lote:', error);
      toast.error(`Erro ao ${actionLabel} usuários: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (users.length === 0) return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={allSelected}
              ref={(el) => {
                if (el) el.indeterminate = someSelected;
              }}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm font-medium">
              {selectedUsers.length > 0 
                ? `${selectedUsers.length} usuário(s) selecionado(s)`
                : 'Selecionar todos'
              }
            </span>
          </div>

          {selectedUsers.length > 0 && (
            <div className="flex items-center gap-2">
              <Select value={bulkAction} onValueChange={setBulkAction}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Escolha uma ação..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activate">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-green-600" />
                      Ativar usuários
                    </div>
                  </SelectItem>
                  <SelectItem value="deactivate">
                    <div className="flex items-center gap-2">
                      <UserX className="h-4 w-4 text-orange-600" />
                      Desativar usuários
                    </div>
                  </SelectItem>
                  <SelectItem value="suspend">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      Suspender usuários
                    </div>
                  </SelectItem>
                  <SelectItem value="email">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-600" />
                      Enviar email
                    </div>
                  </SelectItem>
                  <SelectItem value="export">
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-purple-600" />
                      Exportar selecionados
                    </div>
                  </SelectItem>
                  <SelectItem value="delete">
                    <div className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4 text-red-600" />
                      Excluir usuários
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleBulkAction}
                disabled={!bulkAction || isProcessing}
                variant={bulkAction === 'delete' ? 'destructive' : 'default'}
                size="sm"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processando...
                  </div>
                ) : (
                  <>
                    <Users className="h-4 w-4 mr-2" />
                    Executar
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {selectedUsers.length > 0 && (
          <Button
            onClick={() => onSelectionChange([])}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            Limpar seleção
          </Button>
        )}
      </div>
    </div>
  );
};