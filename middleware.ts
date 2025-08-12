import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  await supabase.auth.getSession();
  
  const { data: { session } } = await supabase.auth.getSession();
  const pathname = req.nextUrl.pathname;

  // Função para remover o prefixo de idioma da rota
  const getPathWithoutLocale = (path: string) => {
    const parts = path.split('/');
    if (parts.length > 2 && (parts[1] === 'pt-BR' || parts[1] === 'en-US' || parts[1] === 'es-ES')) {
        return '/' + parts.slice(2).join('/');
    }
    return path;
  };

  const pathWithoutLocale = getPathWithoutLocale(pathname);

  // Lista COMPLETA de rotas públicas
  const publicRoutes = [
    '/',
    '/login',
    '/cadastro',
    '/plataforma',
    '/planos',
    '/profissionais',
    '/recursos',
    '/sobre',
    '/trabalhe-conosco',
    '/afiliados',
    '/ajuda',
    '/contato',
    '/faq',
    '/blog',
    '/cases-de-sucesso',
    '/ferramentas',
    '/comunidade',
    '/parceiros',
    '/auth',
    '/conversao',
    '/sitecriadores/afiliado',
    '/sitecriadores/login',
    '/seja-um-parceiro/parceiros/temas',
    '/seja-um-parceiro',
    '/seja-um-parceiro/criadores',
    '/diretrizes',
    '/seja-um-parceiro/parceiros/cadastro',
    '/seja-um-parceiro/tecnologicos',
    '/seja-um-parceiro/conteudos',
    '/docs-api',
    '/contratar',
    '/contratar/diretorio',
    '/contratar/design',
    '/contratar/configuracao',
    '/contratar/migracao',
    '/contratar/desenvolvimento',
    '/contratar/marketing',
    '/contratar/auditoria',
    '/trabalhe-conosco',
    '/trabalhe-conosco/vagas',
    '/trabalhe-conosco/servico',
    '/plataforma',
    '/plataforma/conversao',
    '/plataforma/automacao',
    '/plataforma/analises',
  ];

  const protectedRoutePrefix = '/dashboard';

  // 1. Se o usuário NÃO tem sessão e tenta acessar a dashboard, redirecione para o login.
  if (!session && pathWithoutLocale.startsWith(protectedRoutePrefix)) {
    const redirectUrl = new URL('/login', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // 2. Se o usuário TEM sessão e tenta acessar uma rota pública, redirecione para a dashboard.
  if (session && publicRoutes.includes(pathWithoutLocale)) {
      const redirectUrl = new URL(protectedRoutePrefix, req.url);
      return NextResponse.redirect(redirectUrl);
  }
  
  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};