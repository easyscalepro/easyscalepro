"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Shield, Save, RefreshCw, Key, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PasswordPolicy {
  id?: string;
  name: string;
  min_length: number;
  max_length: number;
  require_uppercase: boolean;
  require_lowercase: boolean;
  require_numbers: boolean;
  require_special_chars: boolean;
  special_chars_list: string;
  min_uppercase: number;
  min_lowercase: number;
  min_numbers: number;
  min_special_chars: number;
  disallow_common_passwords: boolean;
  disallow_personal_info: boolean;
  password_history_count: number;
  is_active: boolean;
}

export const PasswordPolicySettings: React.FC = () => {
  const [policy, setPolicy] = useState<PasswordPolicy>({
    name: 'default',
    min_length: 8,
    max_length: 128,
    require_uppercase: true,
    require_lowercase: true,
    require_numbers: true,
    require_special_chars: false,
    special_chars_list: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    min_uppercase: 1,
    min_lowercase: 1,
    min_numbers: 1,
    min_special_chars: 0,
    disallow_common_passwords: true,
    disallow_personal_info: true,
    password_history_count: 0,
    is_active: true
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testPassword, setTestPassword] = useState('');
  const [testResult, setTestResult] = useState<{ valid: boolean; errors: string[] } | null>(null);

  useEffect(() => {
    loadPasswordPolicy();
  }, []);

  const loadPasswordPolicy = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('password_policies')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPolicy(data);
      }
    } catch (error: any) {
      console.error('Erro ao carregar política de senha:', error);
      toast.error('Erro ao carregar configurações de senha');
    } finally {
      setLoading(false);
    }
  };

  const savePasswordPolicy = async () => {
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('password_policies')
        .upsert({
          ...policy,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setPolicy(data);
      toast.success('Política de senha salva com sucesso!');
    } catch (error: any) {
      console.error('Erro ao salvar política de senha:', error);
      toast.error('Erro ao salvar política de senha: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Comprimento mínimo
    if (password.length < policy.min_length) {
      errors.push(`Deve ter pelo menos ${policy.min_length} caracteres`);
    }

    // Comprimento máximo
    if (password.length > policy.max_length) {
      errors.push(`Deve ter no máximo ${policy.max_length} caracteres`);
    }

    // Letras maiúsculas
    if (policy.require_uppercase) {
      const uppercaseCount = (password.match(/[A-Z]/g) || []).length;
      if (uppercaseCount < policy.min_uppercase) {
        errors.push(`Deve ter pelo menos ${policy.min_uppercase} letra(s) maiúscula(s)`);
      }
    }

    // Letras minúsculas
    if (policy.require_lowercase) {
      const lowercaseCount = (password.match(/[a-z]/g) || []).length;
      if (lowercaseCount < policy.min_lowercase) {
        errors.push(`Deve ter pelo menos ${policy.min_lowercase} letra(s) minúscula(s)`);
      }
    }

    // Números
    if (policy.require_numbers) {
      const numberCount = (password.match(/[0-9]/g) || []).length;
      if (numberCount < policy.min_numbers) {
        errors.push(`Deve ter pelo menos ${policy.min_numbers} número(s)`);
      }
    }

    // Caracteres especiais
    if (policy.require_special_chars) {
      const specialCharsRegex = new RegExp(`[${policy.special_chars_list.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`, 'g');
      const specialCount = (password.match(specialCharsRegex) || []).length;
      if (specialCount < policy.min_special_chars) {
        errors.push(`Deve ter pelo menos ${policy.min_special_chars} caractere(s) especial(is): ${policy.special_chars_list}`);
      }
    }

    // Senhas comuns (lista básica)
    if (policy.disallow_common_passwords) {
      const commonPasswords = ['123456', 'password', '123456789', '12345678', '12345', '1234567', 'admin', 'qwerty'];
      if (commonPasswords.includes(password.toLowerCase())) {
        errors.push('Não é possível usar senhas muito comuns');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  };

  const handleTestPassword = () => {
    if (!testPassword) {
      setTestResult(null);
      return;
    }

    const result = validatePassword(testPassword);
    setTestResult(result);
  };

  useEffect(() => {
    if (testPassword) {
      handleTestPassword();
    } else {
      setTestResult(null);
    }
  }, [testPassword, policy]);

  if (loading) {
    return (
      <Card className="border-gray-200 dark:border-gray-700">
        <CardContent className="flex items-center justify-center py-12">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-300">Carregando configurações...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Shield className="h-5 w-5 text-blue-600" />
            Configurações de Política de Senha
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Comprimento da senha */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Comprimento da Senha</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min_length">Comprimento Mínimo</Label>
                <Input
                  id="min_length"
                  type="number"
                  min="1"
                  max="128"
                  value={policy.min_length}
                  onChange={(e) => setPolicy({...policy, min_length: parseInt(e.target.value) || 8})}
                  className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_length">Comprimento Máximo</Label>
                <Input
                  id="max_length"
                  type="number"
                  min="1"
                  max="256"
                  value={policy.max_length}
                  onChange={(e) => setPolicy({...policy, max_length: parseInt(e.target.value) || 128})}
                  className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                />
              </div>
            </div>
          </div>

          <Separator className="bg-gray-200 dark:bg-gray-700" />

          {/* Requisitos de caracteres */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Requisitos de Caracteres</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Letras maiúsculas */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Letras Maiúsculas</Label>
                  <Switch
                    checked={policy.require_uppercase}
                    onCheckedChange={(checked) => setPolicy({...policy, require_uppercase: checked})}
                  />
                </div>
                {policy.require_uppercase && (
                  <div className="space-y-2">
                    <Label htmlFor="min_uppercase">Quantidade Mínima</Label>
                    <Input
                      id="min_uppercase"
                      type="number"
                      min="1"
                      value={policy.min_uppercase}
                      onChange={(e) => setPolicy({...policy, min_uppercase: parseInt(e.target.value) || 1})}
                      className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                    />
                  </div>
                )}
              </div>

              {/* Letras minúsculas */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Letras Minúsculas</Label>
                  <Switch
                    checked={policy.require_lowercase}
                    onCheckedChange={(checked) => setPolicy({...policy, require_lowercase: checked})}
                  />
                </div>
                {policy.require_lowercase && (
                  <div className="space-y-2">
                    <Label htmlFor="min_lowercase">Quantidade Mínima</Label>
                    <Input
                      id="min_lowercase"
                      type="number"
                      min="1"
                      value={policy.min_lowercase}
                      onChange={(e) => setPolicy({...policy, min_lowercase: parseInt(e.target.value) || 1})}
                      className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                    />
                  </div>
                )}
              </div>

              {/* Números */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Números</Label>
                  <Switch
                    checked={policy.require_numbers}
                    onCheckedChange={(checked) => setPolicy({...policy, require_numbers: checked})}
                  />
                </div>
                {policy.require_numbers && (
                  <div className="space-y-2">
                    <Label htmlFor="min_numbers">Quantidade Mínima</Label>
                    <Input
                      id="min_numbers"
                      type="number"
                      min="1"
                      value={policy.min_numbers}
                      onChange={(e) => setPolicy({...policy, min_numbers: parseInt(e.target.value) || 1})}
                      className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                    />
                  </div>
                )}
              </div>

              {/* Caracteres especiais */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Caracteres Especiais</Label>
                  <Switch
                    checked={policy.require_special_chars}
                    onCheckedChange={(checked) => setPolicy({...policy, require_special_chars: checked})}
                  />
                </div>
                {policy.require_special_chars && (
                  <div className="space-y-2">
                    <Label htmlFor="min_special_chars">Quantidade Mínima</Label>
                    <Input
                      id="min_special_chars"
                      type="number"
                      min="1"
                      value={policy.min_special_chars}
                      onChange={(e) => setPolicy({...policy, min_special_chars: parseInt(e.target.value) || 1})}
                      className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Lista de caracteres especiais */}
            {policy.require_special_chars && (
              <div className="space-y-2">
                <Label htmlFor="special_chars">Caracteres Especiais Permitidos</Label>
                <Input
                  id="special_chars"
                  value={policy.special_chars_list}
                  onChange={(e) => setPolicy({...policy, special_chars_list: e.target.value})}
                  placeholder="!@#$%^&*()_+-=[]{}|;:,.<>?"
                  className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                />
              </div>
            )}
          </div>

          <Separator className="bg-gray-200 dark:bg-gray-700" />

          {/* Configurações de segurança */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Configurações de Segurança</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Bloquear Senhas Comuns</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Impede o uso de senhas muito comuns como "123456"</p>
                </div>
                <Switch
                  checked={policy.disallow_common_passwords}
                  onCheckedChange={(checked) => setPolicy({...policy, disallow_common_passwords: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Bloquear Informações Pessoais</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Impede o uso de nome, email, etc. na senha</p>
                </div>
                <Switch
                  checked={policy.disallow_personal_info}
                  onCheckedChange={(checked) => setPolicy({...policy, disallow_personal_info: checked})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_history">Histórico de Senhas</Label>
                <Input
                  id="password_history"
                  type="number"
                  min="0"
                  max="24"
                  value={policy.password_history_count}
                  onChange={(e) => setPolicy({...policy, password_history_count: parseInt(e.target.value) || 0})}
                  className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Número de senhas anteriores que não podem ser reutilizadas (0 = desabilitado)
                </p>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-200 dark:bg-gray-700" />

          {/* Teste de senha */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Testar Política</h3>
            <div className="space-y-2">
              <Label htmlFor="test_password">Senha de Teste</Label>
              <Input
                id="test_password"
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                placeholder="Digite uma senha para testar as regras"
                className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              />
            </div>

            {testResult && (
              <div className={`p-4 rounded-lg border ${
                testResult.valid 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {testResult.valid ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className={`font-medium ${
                    testResult.valid ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
                  }`}>
                    {testResult.valid ? 'Senha válida!' : 'Senha inválida'}
                  </span>
                </div>
                {!testResult.valid && (
                  <ul className="list-disc list-inside space-y-1 text-sm text-red-700 dark:text-red-300">
                    {testResult.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Botão salvar */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={savePasswordPolicy}
              disabled={saving}
              className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0F1115] font-medium"
            >
              {saving ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Salvando...
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Política
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};