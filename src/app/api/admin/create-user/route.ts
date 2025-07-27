import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Cliente Supabase com service_role para Admin API
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 API: Iniciando criação de usuário via Admin API...');
    
    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ SUPABASE_SERVICE_ROLE_KEY não configurada');
      return NextResponse.json(
        { success: false, error: 'Configuração do servidor incompleta' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email, password, name, company, phone } = body;

    // Validações básicas
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      );
    }

    console.log('📧 API: Criando usuário para email:', email);

    // Criar usuário usando Admin API
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password: password,
      email_confirm: true, // Confirmar email automaticamente
      user_metadata: {
        name: name?.trim() || '',
        company: company?.trim() || '',
        phone: phone?.trim() || ''
      }
    });

    if (authError) {
      console.error('❌ API: Erro ao criar usuário no Auth:', authError);
      
      // Tratar erros específicos
      let errorMessage = 'Erro ao criar conta de acesso';
      
      if (authError.message.includes('already registered')) {
        errorMessage = 'Este email já está registrado no sistema';
      } else if (authError.message.includes('invalid email')) {
        errorMessage = 'Email inválido';
      } else if (authError.message.includes('weak password')) {
        errorMessage = 'Senha muito fraca. Use pelo menos 6 caracteres';
      } else {
        errorMessage = authError.message;
      }
      
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }

    if (!authData.user) {
      console.error('❌ API: Usuário não retornado após criação');
      return NextResponse.json(
        { success: false, error: 'Falha na criação do usuário' },
        { status: 500 }
      );
    }

    console.log('✅ API: Usuário criado com sucesso:', authData.user.id);

    return NextResponse.json({
      success: true,
      userId: authData.user.id,
      email: authData.user.email
    });

  } catch (error: any) {
    console.error('💥 API: Erro geral na criação de usuário:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor ao criar usuário' 
      },
      { status: 500 }
    );
  }
}