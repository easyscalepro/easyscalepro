import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const pathname = req.nextUrl.pathname

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/login', '/signup', '/']
  
  // Rotas que requerem admin
  const adminRoutes = ['/admin']
  
  // Se é uma rota pública, permitir acesso
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return res
  }

  try {
    // Criar cliente Supabase para middleware
    const supabase = createMiddlewareClient({ req, res })
    
    // Verificar sessão
    const { data: { session } } = await supabase.auth.getSession()
    
    // Se não há sessão, redirecionar para login
    if (!session) {
      const redirectUrl = new URL('/login', req.url)
      redirectUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Para rotas admin, verificar se o usuário é admin
    if (adminRoutes.some(route => pathname.startsWith(route))) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, status')
        .eq('id', session.user.id)
        .single()

      if (!profile || profile.role !== 'admin' || profile.status !== 'ativo') {
        return NextResponse.redirect(new URL('/dashboard?error=access_denied', req.url))
      }
    }

    return res
  } catch (error) {
    console.error('Erro no middleware:', error)
    // Em caso de erro, redirecionar para login
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}