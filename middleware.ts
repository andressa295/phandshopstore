import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


export function middleware(request: NextRequest) {
  
  console.log('Middleware executado para a rota:', request.nextUrl.pathname);

  return NextResponse.next();
}


export const config = {
  matcher: [
    // Você pode adicionar as rotas do backoffice aqui quando a lógica estiver pronta.
    // Por exemplo: '/(backoffice)/:path*'
  ],
};

