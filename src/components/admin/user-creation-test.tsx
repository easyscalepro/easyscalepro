"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TestTube, Database, User, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const UserCreationTest: React.FC = () => {
  const [testEmail, setTestEmail] = useState('teste@exemplo.com');
  const [testPassword, setTestPassword] = useState('123456');
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<{
    authCreated: boolean;
    profileCreated: boolean;
    canLogin: boolean;
    errors: string[];
  } | null>(null);

  const runTest = async () => {
    setTesting(true);
    setTestResults(null);
    
    const results = {
      authCreated: false,
      profileCreated: false,
      canLogin: false,
      errors: [] as string[]
    };

    try {
      console.log('🧪 Iniciando teste de criação de usuário...');
      
      // Salvar sessão atual
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      // 1. Testar criação com signup normal
      toast.loading('Testando criação com signup...', { id: 'test-user' });
      
      try {
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
          email: testEmail,
          password: testPassword,
          options: {
            data: {
              name: 'Usuário Teste'
            }
          }
        });

        if (signupError) {
          results.errors.push(`Signup Error: ${signupError.message}`);
        } else if (signupData.user) {
          results.authCreated = true;
          console.log('✅ Usuário criado com signup:', signupData.user.id);
          
          // Fazer logout do usuário de teste
          await supabase.auth.signOut();
          
          // Restaurar sessão do admin
          if (currentSession) {
            await supabase.auth.setSession(currentSession);
          }
          
          // 2. Verificar se perfil foi criado
          toast.loading('Verificando criação do perfil...', { id: 'test-user' });
          
          // Aguardar um pouco para o trigger executar
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', signupData.user.id)
            .single();

          if (profileError) {
            results.errors.push(`Profile Error: ${profileError.message}`);
            
            // Tentar criar perfil manualmente
            console.log('🔧 Tentando criar perfil manualmente...');
            const { data: manualProfile, error: manualError } = await supabase
              .from('profiles')
              .insert({
                id: signupData.user.id,
                email: testEmail,
                name: 'Usuário Teste',
                role: 'user',
                status: 'ativo',
                commands_used: 0,
                last_access: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .select()
              .single();

            if (manualError) {
              results.errors.push(`Manual Profile Error: ${manualError.message}`);
            } else {
              results.profileCreated = true;
              console.log('✅ Perfil criado manualmente:', manualProfile);
            }
          } else {
            results.profileCreated = true;
            console.log('✅ Perfil criado automaticamente:', profileData);
          }

          // 3. Testar login
          toast.loading('Testando login...', { id: 'test-user' });
          
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: testEmail,
            password: testPassword
          });

          if (loginError) {
            results.errors.push(`Login Error: ${loginError.message}`);
          } else {
            results.canLogin = true;
            console.log('✅ Login funcionando');
            
            // Fazer logout imediatamente
            await supabase.auth.signOut();
            
            // Restaurar sessão do admin
            if (currentSession) {
              await supabase.auth.setSession(currentSession);
            }
          }

          // 4. Limpar usuário de teste
          console.log('🧹 Limpando usuário de teste...');
          
          // Deletar perfil primeiro
          if (results.profileCreated) {
            await supabase.from('profiles').delete().eq('id', signupData.user.id);
          }
          
          // Tentar deletar do Auth (pode não funcionar sem Admin API)
          try {
            await supabase.auth.admin.deleteUser(signupData.user.id);
          } catch (deleteError) {
            console.warn('⚠️ Não foi possível deletar do Auth (sem Admin API):', deleteError);
            results.errors.push('Aviso: Usuário de teste não foi removido do Auth (sem Admin API)');
          }
        }
      } catch (error: any) {
        results.errors.push(`Test Error: ${error.message}`);
      }

      setTestResults(results);
      
      toast.dismiss('test-user');
      
      if (results.authCreated && results.profileCreated && results.canLogin) {
        toast.success('✅ Teste passou! Criação de usuário está funcionando');
      } else {
        toast.error('❌ Teste falhou! Há problemas na criação de usuário');
      }

    } catch (error: any) {
      console.error('💥 Erro no teste:', error);
      results.errors.push(`General Error: ${error.message}`);
      setTestResults(results);
      
      toast.dismiss('test-user');
      toast.error('❌ Erro durante o teste');
    } finally {
      setTesting(false);
    }
  };

  const getStatusIcon = (status: boolean, hasErrors: boolean) => {
    if (hasErrors) return <XCircle className="h-4 w-4 text-red-500" />;
    if (status) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <AlertTriangle className="h-4 w-4 text-gray-400" />;
  };

  return (
    <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
          <TestTube className="h-5 w-5" />
          Teste de Criação de Usuário (Signup Normal)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            Execute este teste para verificar se a criação de usuários via signup está funcionando.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="testEmail">Email de Teste</Label>
              <Input
                id="testEmail"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="teste@exemplo.com"
                disabled={testing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="testPassword">Senha de Teste</Label>
              <Input
                id="testPassword"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                placeholder="123456"
                disabled={testing}
              />
            </div>
          </div>

          <Button
            onClick={runTest}
            disabled={testing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {testing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Executando Teste...
              </>
            ) : (
              <>
                <TestTube className="h-4 w-4 mr-2" />
                Executar Teste
              </>
            )}
          </Button>

          {testResults && (
            <div className="mt-4 space-y-3 p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Resultados do Teste:</h4>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.authCreated, testResults.errors.some(e => e.includes('Signup')))}
                  <span className="text-sm">Criação via Signup</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.profileCreated, testResults.errors.some(e => e.includes('Profile')))}
                  <span className="text-sm">Criação do Perfil na Tabela</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.canLogin, testResults.errors.some(e => e.includes('Login')))}
                  <span className="text-sm">Capacidade de Login</span>
                </div>
              </div>

              {testResults.errors.length > 0 && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <h5 className="font-medium text-red-800 dark:text-red-200 mb-2">Erros/Avisos:</h5>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    {testResults.errors.map((error, index) => (
                      <li key={index} className="break-words">• {error}</li>
                    ))}
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