"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const EmailConfirmationTool: React.FC = () => {
  const [checking, setChecking] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [unconfirmedUsers, setUnconfirmedUsers] = useState<any[]>([]);

  const checkUnconfirmedUsers = async () => {
    setChecking(true);
    
    try {
      console.log('🔍 Verificando usuários não confirmados...');
      toast.loading('Verificando usuários não confirmados...', { id: 'check-unconfirmed' });

      // Tentar acessar usuários via Admin API
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        throw new Error('Sem acesso à Admin API: ' + authError.message);
      }

      // Filtrar usuários não confirmados
      const unconfirmed = authUsers.users?.filter(user => !user.email_confirmed_at) || [];
      
      console.log('📧 Usuários não confirmados encontrados:', unconfirmed.length);
      setUnconfirmedUsers(unconfirmed);

      toast.dismiss('check-unconfirmed');
      
      if (unconfirmed.length === 0) {
        toast.success('✅ Todos os usuários têm email confirmado!');
      } else {
        toast.info(`📧 Encontrados ${unconfirmed.length} usuários com email não confirmado`);
      }

    } catch (error: any) {
      console.error('💥 Erro ao verificar usuários:', error);
      toast.dismiss('check-unconfirmed');
      toast.error('❌ Erro ao verificar usuários: ' + error.message);
    } finally {
      setChecking(false);
    }
  };

  const confirmAllEmails = async () => {
    if (unconfirmedUsers.length === 0) {
      toast.info('Nenhum usuário para confirmar');
      return;
    }

    setConfirming(true);
    
    try {
      console.log('📧 Confirmando emails de usuários...');
      toast.loading(`Confirmando ${unconfirmedUsers.length} emails...`, { id: 'confirm-emails' });

      let successCount = 0;
      let errorCount = 0;

      for (const user of unconfirmedUsers) {
        try {
          console.log(`📧 Confirmando email para: ${user.email}`);
          
          const { data: updatedUser, error: confirmError } = await supabase.auth.admin.updateUserById(
            user.id,
            { email_confirm: true }
          );

          if (confirmError) {
            console.error(`❌ Erro ao confirmar ${user.email}:`, confirmError);
            errorCount++;
          } else {
            console.log(`✅ Email confirmado para: ${user.email}`);
            successCount++;
          }
        } catch (error) {
          console.error(`💥 Erro inesperado para ${user.email}:`, error);
          errorCount++;
        }
      }

      toast.dismiss('confirm-emails');
      
      if (successCount > 0) {
        toast.success(`✅ ${successCount} emails confirmados com sucesso!`);
      }
      
      if (errorCount > 0) {
        toast.error(`❌ ${errorCount} emails falharam na confirmação`);
      }

      // Verificar novamente após confirmação
      setTimeout(() => {
        checkUnconfirmedUsers();
      }, 1000);

    } catch (error: any) {
      console.error('💥 Erro ao confirmar emails:', error);
      toast.dismiss('confirm-emails');
      toast.error('❌ Erro ao confirmar emails: ' + error.message);
    } finally {
      setConfirming(false);
    }
  };

  const confirmSingleEmail = async (userId: string, email: string) => {
    try {
      console.log(`📧 Confirmando email individual para: ${email}`);
      toast.loading(`Confirmando email de ${email}...`, { id: 'confirm-single' });

      const { data: updatedUser, error: confirmError } = await supabase.auth.admin.updateUserById(
        userId,
        { email_confirm: true }
      );

      if (confirmError) {
        throw confirmError;
      }

      toast.dismiss('confirm-single');
      toast.success(`✅ Email confirmado para ${email}`);
      
      // Remover da lista local
      setUnconfirmedUsers(prev => prev.filter(user => user.id !== userId));

    } catch (error: any) {
      console.error(`💥 Erro ao confirmar email de ${email}:`, error);
      toast.dismiss('confirm-single');
      toast.error(`❌ Erro ao confirmar email de ${email}: ` + error.message);
    }
  };

  return (
    <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
          <Mail className="h-5 w-5" />
          Confirmação de Emails
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-orange-700 dark:text-orange-300 text-sm">
            Verifique e confirme emails de usuários que não conseguem fazer login devido a "Email not confirmed".
          </p>
          
          <div className="flex gap-2">
            <Button
              onClick={checkUnconfirmedUsers}
              disabled={checking}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {checking ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Verificando...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Verificar Emails
                </>
              )}
            </Button>

            {unconfirmedUsers.length > 0 && (
              <Button
                onClick={confirmAllEmails}
                disabled={confirming}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {confirming ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Confirmando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirmar Todos ({unconfirmedUsers.length})
                  </>
                )}
              </Button>
            )}
          </div>

          {unconfirmedUsers.length > 0 && (
            <div className="mt-4 space-y-3 p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                Usuários com Email Não Confirmado:
              </h4>
              
              <div className="space-y-2">
                {unconfirmedUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center gap-3">
                      <XCircle className="h-4 w-4 text-orange-600" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Criado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => confirmSingleEmail(user.id, user.email)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Confirmar
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {unconfirmedUsers.length === 0 && checking === false && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Todos os usuários têm email confirmado
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};