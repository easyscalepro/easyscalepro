"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, CheckCircle, XCircle, AlertTriangle, User } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const LoginTest: React.FC = () => {
  const [testEmail, setTestEmail] = useState('teste@gmail.com');
  const [testPassword, setTestPassword] = useState('123456');
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<{
    userExists: boolean;
    canLogin: boolean;
    profileExists: boolean;
    errors: string[];
  } | null>(null);

  const runLoginTest = async () => {
    setTesting(true);
    setTestResults(null);
    
    const results = {
      userExists: false,
      canLogin: false,
      profileExists: false,
      errors: [] as string[]
    };

    try {
      console.log('🧪 Testando login para:', testEmail);
      
      // Salvar sessão atual
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      // 1. Verificar se o perfil existe
      toast.loading('Verificando se usuário existe...', { id: 'login-test' });
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', testEmail)
        .single();

      if (profileError) {
        results.errors.push(`Profile Error: ${profileError.message}`);
      } else if (profileData) {
        results.profileExists = true;
        results.userExists = true;
        console.log('✅ Perfil encontrado:', profileData);
      }

      // 2. Tentar fazer login
      toast.loading('Testando login...', { id: 'login-test' });
      
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      });

      if (loginError) {
        results.errors.push(`Login Error: ${loginError.message}`);
        console.error('❌ Erro no login:', loginError);
      } else if (loginData.user) {
        results.canLogin = true;
        results.userExists = true;
        console.log('✅ Login realizado com sucesso:', loginData.user.email);
        
        // Fazer logout imediatamente
        await supabase.auth.signOut();
        
        // Restaurar sessão anterior
        if (currentSession) {
          await supabase.auth.setSession(currentSession);
        }
      }

      setTestResults(results);
      
      toast.dismiss('login-test');
      
      if (results.canLogin && results.profileExists) {
        toast.success('✅ Login funcionando! Usuário pode acessar o sistema');
      } else if (results.userExists && !results.canLogin) {
        toast.error('❌ Usuário existe mas não consegue fazer login');
      } else {
        toast.error('❌ Usuário não encontrado ou não foi criado corretamente');
      }

    } catch (error: any) {
      console.error('💥 Erro no teste de login:', error);
      results.errors.push(`Test Error: ${error.message}`);
      setTestResults(results);
      
      toast.dismiss('login-test');
      toast.error('❌ Erro durante o teste de login');
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
    <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
          <LogIn className="h-5 w-5" />
          Teste de Login
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-green-700 dark:text-green-300 text-sm">
            Teste se o usuário criado consegue fazer login no sistema.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="loginTestEmail">Email</Label>
              <Input
                id="loginTestEmail"
                
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="teste@gmail.com"
                disabled={testing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loginTestPassword">Senha</Label>
              <Input
                id="loginTestPassword"
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                placeholder="123456"
                disabled={testing}
              />
            </div>
          </div>

          <Button
            onClick={runLoginTest}
            disabled={testing}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {testing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Testando Login...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                Testar Login
              </>
            )}
          </Button>

          {testResults && (
            <div className="mt-4 space-y-3 p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Resultados do Teste:</h4>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.userExists, testResults.errors.some(e => e.includes('Profile')))}
                  <span className="text-sm">Usuário Existe no Sistema</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.profileExists, testResults.errors.some(e => e.includes('Profile')))}
                  <span className="text-sm">Perfil na Tabela Profiles</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.canLogin, testResults.errors.some(e => e.includes('Login')))}
                  <span className="text-sm">Consegue Fazer Login</span>
                </div>
              </div>

              {testResults.errors.length > 0 && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <h5 className="font-medium text-red-800 dark:text-red-200 mb-2">Erros Encontrados:</h5>
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