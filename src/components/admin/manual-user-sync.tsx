"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/auth-provider';

export const ManualUserSync: React.FC = () => {
  const { user: currentUser, profile } = useAuth();
  const [isCreating, setIsCreating] = useState(false);

  const syncCurrentUser = async () => {
    if (!currentUser) {
      toast.error('Usuário não autenticado');
      return;
    }

    setIsCreating(true);
    
    try {
      console.log('🔄 Sincronizando usuário atual...');
      
      toast.loading('Verificando perfil do usuário atual...', { id: 'sync-current' });

      // Verificar se o perfil já existe
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', currentUser.id)
        .single();

      if (existingProfile) {
        toast.dismiss('sync-current');
        toast.info('✅ Seu perfil já está sincronizado!');
        return;
      }

      // Criar perfil para o usuário atual
      const adminEmails = ['admin@easyscale.com', 'julionavyy@gmail.com'];
      const isAdmin = adminEmails.includes(currentUser.email || '');

      const profileData = {
        id: currentUser.id,
        email: currentUser.email || '',
        name: currentUser.user_metadata?.name || 
              currentUser.user_metadata?.full_name || 
              currentUser.email?.split('@')[0] || 
              'Usuário',
        role: isAdmin ? 'admin' : 'user',
        status: 'ativo',
        phone: currentUser.user_metadata?.phone || null,
        company: currentUser.user_metadata?.company || null,
        commands_used: 0,
        last_access: new Date().toISOString(),
        created_at: currentUser.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('📝 Criando perfil:', profileData);

      const { data: insertedProfile, error: insertError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (insertError) {
        console.error('❌ Erro ao criar perfil:', insertError);
        throw new Error('Erro ao criar perfil: ' + insertError.message);
      }

      console.log('✅ Perfil criado com sucesso:', insertedProfile);

      toast.dismiss('sync-current');
      toast.success('✅ Seu perfil foi sincronizado com sucesso!', {
        description: 'Agora você tem acesso completo à plataforma'
      });

      // Recarregar para atualizar o contexto
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error: any) {
      console.error('💥 Erro na sincronização:', error);
      
      toast.dismiss('sync-current');
      toast.error('❌ Erro ao sincronizar perfil', {
        description: error.message || 'Tente novamente'
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Só mostrar se o usuário não tem perfil
  if (profile) {
    return null;
  }

  return (
    <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertCircle className="h-5 w-5" />
          Perfil Não Sincronizado
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-amber-700 dark:text-amber-300 text-sm">
            Seu perfil não está sincronizado com a plataforma. Clique no botão abaixo para criar seu perfil automaticamente.
          </p>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={syncCurrentUser}
              disabled={isCreating}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sincronizando...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sincronizar Meu Perfil
                </>
              )}
            </Button>
            
            <div className="text-xs text-amber-600 dark:text-amber-400">
              Email: {currentUser?.email}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};