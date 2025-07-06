"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const DatabaseCheck: React.FC = () =>  {
  const [checking, setChecking] = useState(false);
  const [checkResults, setCheckResults] = useState<{
    tableExists: boolean;
    triggerExists: boolean;
    policiesExist: boolean;
    errors: string[];
    details: any;
  } | null>(null);

  const runDatabaseCheck = async () => {
    setChecking(true);
    setCheckResults(null);
    
    const results = {
      tableExists: false,
      triggerExists: false,
      policiesExist: false,
      errors: [] as string[],
      details: {} as any
    };

    try {
      console.log('🔍 Verificando estrutura do banco de dados...');
      
      // 1. Verificar se a tabela profiles existe
      toast.loading('Verificando tabela profiles...', { id: 'db-check' });
      
      try {
        const { data: tableData, error: tableError } = await supabase
          .from('profiles')
          .select('count')
          .limit(1);

        if (!tableError) {
          results.tableExists = true;
          console.log('✅ Tabela profiles existe');
        } else {
          results.errors.push(`Table Error: ${tableError.message}`);
        }
      } catch (error: any) {
        results.errors.push(`Table Check Error: ${error.message}`);
      }

      // 2. Verificar dados na tabela
      if (results.tableExists) {
        try {
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .limit(5);

          results.details.profiles = profilesData || [];
          console.log('📊 Dados na tabela profiles:', profilesData);
        } catch (error: any) {
          results.errors.push(`Profiles Data Error: ${error.message}`);
        }
      }

      // 3. Verificar usuários no Auth
      try {
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
        
        if (!authError && authData) {
          results.details.authUsers = authData.users || [];
          console.log('👥 Usuários no Auth:', authData.users?.length);
        } else {
          results.details.authUsers = [];
          console.log('⚠️ Sem acesso ao Auth Admin API');
        }
      } catch (error: any) {
        results.details.authUsers = [];
        console.log('⚠️ Erro ao acessar Auth:', error);
      }

      // 4. Verificar se há usuários órfãos
      if (results.details.authUsers && results.details.profiles) {
        const authIds = results.details.authUsers.map((u: any) => u.id);
        const profileIds = results.details.profiles.map((p: any) => p.id);
        const orphanUsers = results.details.authUsers.filter((u: any) => !profileIds.includes(u.id));
        
        results.details.orphanUsers = orphanUsers;
        console.log('👻 Usuários órfãos (Auth sem Profile):', orphanUsers.length);
      }

      setCheckResults(results);
      
      toast.dismiss('db-check');
      
      if (results.tableExists) {
        toast.success('✅ Verificação concluída!');
      } else {
        toast.error('❌ Problemas encontrados na estrutura do banco');
      }

    } catch (error: any) {
      console.error('💥 Erro na verificação:', error);
      results.errors.push(`General Error: ${error.message}`);
      setCheckResults(results);
      
      toast.dismiss('db-check');
      toast.error('❌ Erro durante a verificação');
    } finally {
      setChecking(false);
    }
  };

  const fixOrphanUsers = async () => {
    if (!checkResults?.details.orphanUsers?.length) {
      toast.info('Nenhum usuário órfão encontrado');
      return;
    }

    try {
      toast.loading('Corrigindo usuários órfãos...', { id: 'fix-orphans' });
      
      for (const orphanUser of checkResults.details.orphanUsers) {
        try {
          const profileData = {
            id: orphanUser.id,
            email: orphanUser.email,
            name: orphanUser.user_metadata?.name || orphanUser.email,
            role: orphanUser.email === 'admin@easyscale.com' || orphanUser.email === 'julionavyy@gmail.com' ? 'admin' : 'user',
            status: 'ativo',
            commands_used: 0,
            last_access: new Date().toISOString(),
            created_at: orphanUser.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          const { error } = await supabase
            .from('profiles')
            .insert(profileData);

          if (error) {
            console.error('Erro ao criar perfil para:', orphanUser.email, error);
          } else {
            console.log('✅ Perfil criado para:', orphanUser.email);
          }
        } catch (error) {
          console.error('Erro ao processar usuário órfão:', orphanUser.email, error);
        }
      }

      toast.dismiss('fix-orphans');
      toast.success('✅ Usuários órfãos corrigidos!');
      
      // Executar verificação novamente
      setTimeout(() => {
        runDatabaseCheck();
      }, 1000);

    } catch (error: any) {
      toast.dismiss('fix-orphans');
      toast.error('❌ Erro ao corrigir usuários órfãos: ' + error.message);
    }
  };

  const getStatusIcon = (status: boolean, hasErrors: boolean) => {
    if (hasErrors) return <XCircle className="h-4 w-4 text-red-500" />;
    if (status) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <AlertTriangle className="h-4 w-4 text-gray-400" />;
  };

  return (
    <Card className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
          <Database className="h-5 w-5" />
          Verificação do Banco de Dados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-purple-700 dark:text-purple-300 text-sm">
            Verifique a estrutura do banco e corrija problemas de sincronização.
          </p>
          
          <Button
            onClick={runDatabaseCheck}
            disabled={checking}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {checking ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Verificando...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Verificar Banco de Dados
              </>
            )}
          </Button>

          {checkResults && (
            <div className="mt-4 space-y-3 p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Resultados da Verificação:</h4>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(checkResults.tableExists, checkResults.errors.some(e => e.includes('Table')))}
                  <span className="text-sm">Tabela Profiles Existe</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Usuários no Auth:</span>
                  <span className="font-medium">{checkResults.details.authUsers?.length || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Perfis na Tabela:</span>
                  <span className="font-medium">{checkResults.details.profiles?.length || 0}</span>
                </div>
                
                {checkResults.details.orphanUsers?.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-orange-600">Usuários Órfãos:</span>
                    <span className="font-medium text-orange-600">{checkResults.details.orphanUsers.length}</span>
                  </div>
                )}
              </div>

              {checkResults.details.orphanUsers?.length > 0 && (
                <div className="mt-4">
                  <Button
                    onClick={fixOrphanUsers}
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Corrigir Usuários Órfãos
                  </Button>
                </div>
              )}

              {checkResults.errors.length > 0 && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <h5 className="font-medium text-red-800 dark:text-red-200 mb-2">Erros Encontrados:</h5>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    {checkResults.errors.map((error, index) => (
                      <li key={index} className="break-words">• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {checkResults.details.profiles?.length > 0 && (
                <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h5 className="font-medium text-green-800 dark:text-green-200 mb-2">Perfis Encontrados:</h5>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    {checkResults.details.profiles.slice(0, 3).map((profile: any, index: number) => (
                      <li key={index}>• {profile.name} ({profile.email})</li>
                    ))}
                    {checkResults.details.profiles.length > 3 && (
                      <li>• ... e mais {checkResults.details.profiles.length - 3} perfis</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};