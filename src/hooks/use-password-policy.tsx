"use client";

import { useState, useEffect } from 'react';
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

interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
  strength: number;
}

const defaultPolicy: PasswordPolicy = {
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
};

export const usePasswordPolicy = () => {
  const [policy, setPolicy] = useState<PasswordPolicy>(defaultPolicy);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPasswordPolicy();
  }, []);

  const loadPasswordPolicy = async () => {
    try {
      const { data, error } = await supabase
        .from('password_policies')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.warn('Erro ao carregar política de senha, usando padrão:', error);
        setPolicy(defaultPolicy);
      } else if (data) {
        setPolicy(data);
      }
    } catch (error) {
      console.warn('Erro ao carregar política de senha, usando padrão:', error);
      setPolicy(defaultPolicy);
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password: string, userInfo?: { name?: string; email?: string }): PasswordValidationResult => {
    const errors: string[] = [];
    let strength = 0;

    // Comprimento mínimo
    if (password.length < policy.min_length) {
      errors.push(`Deve ter pelo menos ${policy.min_length} caracteres`);
    } else {
      strength += 1;
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
      } else {
        strength += 1;
      }
    }

    // Letras minúsculas
    if (policy.require_lowercase) {
      const lowercaseCount = (password.match(/[a-z]/g) || []).length;
      if (lowercaseCount < policy.min_lowercase) {
        errors.push(`Deve ter pelo menos ${policy.min_lowercase} letra(s) minúscula(s)`);
      } else {
        strength += 1;
      }
    }

    // Números
    if (policy.require_numbers) {
      const numberCount = (password.match(/[0-9]/g) || []).length;
      if (numberCount < policy.min_numbers) {
        errors.push(`Deve ter pelo menos ${policy.min_numbers} número(s)`);
      } else {
        strength += 1;
      }
    }

    // Caracteres especiais
    if (policy.require_special_chars) {
      const specialCharsRegex = new RegExp(`[${policy.special_chars_list.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`, 'g');
      const specialCount = (password.match(specialCharsRegex) || []).length;
      if (specialCount < policy.min_special_chars) {
        errors.push(`Deve ter pelo menos ${policy.min_special_chars} caractere(s) especial(is): ${policy.special_chars_list}`);
      } else {
        strength += 1;
      }
    }

    // Senhas comuns
    if (policy.disallow_common_passwords) {
      const commonPasswords = [
        '123456', 'password', '123456789', '12345678', '12345', '1234567', 
        'admin', 'qwerty', 'abc123', 'password123', '123123', 'welcome',
        'login', 'master', 'hello', 'guest', 'admin123', 'root'
      ];
      if (commonPasswords.includes(password.toLowerCase())) {
        errors.push('Não é possível usar senhas muito comuns');
      }
    }

    // Informações pessoais
    if (policy.disallow_personal_info && userInfo) {
      const personalInfo = [
        userInfo.name?.toLowerCase(),
        userInfo.email?.toLowerCase().split('@')[0]
      ].filter(Boolean);

      for (const info of personalInfo) {
        if (info && password.toLowerCase().includes(info)) {
          errors.push('A senha não pode conter informações pessoais');
          break;
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      strength: Math.min(strength, 5)
    };
  };

  const getPasswordStrengthText = (strength: number): string => {
    switch (strength) {
      case 0:
       case 1: return 'Muito fraca';
      case 2: return 'Fraca';
      case 3: return 'Média';
      case 4: return 'Forte';
      case 5: return 'Muito forte';
      default: return '';
    }
  };

  const getPasswordStrengthColor = (strength: number): string => {
    switch (strength) {
      case 0: case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-blue-500';
      case 5: return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  const generatePassword = (): string => {
    let chars = '';
    let password = '';

    // Adicionar caracteres obrigatórios
    if (policy.require_lowercase) {
      chars += 'abcdefghijklmnopqrstuvwxyz';
      for (let i = 0; i < policy.min_lowercase; i++) {
        password += 'abcdefghijklmnopqrstuvwxyz'.charAt(Math.floor(Math.random() * 26));
      }
    }

    if (policy.require_uppercase) {
      chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      for (let i = 0; i < policy.min_uppercase; i++) {
        password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(Math.floor(Math.random() * 26));
      }
    }

    if (policy.require_numbers) {
      chars += '0123456789';
      for (let i = 0; i < policy.min_numbers; i++) {
        password += '0123456789'.charAt(Math.floor(Math.random() * 10));
      }
    }

    if (policy.require_special_chars) {
      chars += policy.special_chars_list;
      for (let i = 0; i < policy.min_special_chars; i++) {
        password += policy.special_chars_list.charAt(Math.floor(Math.random() * policy.special_chars_list.length));
      }
    }

    // Preencher até o comprimento mínimo
    while (password.length < policy.min_length) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Embaralhar a senha
    return password.split('').sort(() => Math.random() - 0.5).join('');
  };

  return {
    policy,
    loading,
    validatePassword,
    getPasswordStrengthText,
    getPasswordStrengthColor,
    generatePassword,
    refreshPolicy: loadPasswordPolicy
  };
};