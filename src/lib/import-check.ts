// Verificação de imports para identificar problemas de parsing

// Imports básicos do React
import React from 'react';
import { useState, useEffect } from 'react';

// Imports de UI components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// Imports de ícones
import { User, Mail, Settings } from '../../node_modules/lucide-react';

// Imports do Supabase
import { supabase } from '@/integrations/supabase/client';

// Imports de contextos
import { useAuth } from '@/components/auth/auth-provider';

// Imports de utilitários
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Função de teste para verificar se todos os imports funcionam
export const testImports = () => {
  console.log('✅ Todos os imports estão funcionando corretamente');
  
  // Teste básico de componentes
  const TestComponent = () => {
    const [test, setTest] = useState('OK');
    
    useEffect(() => {
      console.log('useEffect funcionando');
    }, []);
    
    return React.createElement('div', { className: cn('test-class') }, test);
  };
  
  return {
    TestComponent,
    icons: { User, Mail, Settings },
    utils: { toast, cn },
    supabase,
    components: { Button, Card, Input }
  };
};

export default testImports;