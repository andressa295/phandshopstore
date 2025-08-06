import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// O middleware será executado em todas as requisições.
// Este é um exemplo mínimo para resolver o erro.
export function middleware(request: NextRequest) {
  // Apenas para demonstração. Não há lógica de autenticação ainda.
  // Você pode adicionar a lógica aqui para checar o token de autenticação
  // e redirecionar o usuário se ele não estiver logado.
  console.log('Middleware executado para a rota:', request.nextUrl.pathname);

  // Retorna a resposta, permitindo que a requisição prossiga.
  return NextResponse.next();
}

// Opcional: Você pode configurar quais rotas o middleware deve ignorar.
// Isso evita que ele seja executado em arquivos estáticos ou APIs.
// Para este exemplo, estamos ignorando tudo.
export const config = {
  matcher: [
    // Você pode adicionar as rotas do backoffice aqui quando a lógica estiver pronta.
    // Por exemplo: '/(backoffice)/:path*'
  ],
};

