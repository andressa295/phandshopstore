// app/api/rastro/route.ts

import { NextResponse } from 'next/server';
// Importa o cliente Supabase do servidor usando o helper corrigido
import { getSupabaseServerClient } from '@/lib/supabaseServer';

export async function POST(request: Request) {
  // Inicializa o cliente Supabase usando o helper
  const supabase = getSupabaseServerClient();

  try {
    const { lojaId, pagina, origem, dispositivo } = await request.json();

    // Validação básica dos dados recebidos
    if (!lojaId || !pagina) {
      return NextResponse.json({ error: 'lojaId e pagina são obrigatórios.' }, { status: 400 });
    }

    // Obter o IP do visitante dos cabeçalhos (forma mais confiável no Next.js)
    // 'x-forwarded-for' é o mais comum para proxies/CDNs como Vercel
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');
    const userAgent = request.headers.get('user-agent');

    // Mapeamento simples de user-agent para dispositivo
    let deviceType = 'Desktop';
    if (userAgent) {
      if (/Mobi|Android|iPhone|iPad|Pod|BlackBerry|Opera Mini|IEMobile|webOS|Windows Phone|tablet/i.test(userAgent)) {
        deviceType = 'Mobile';
      } else if (/Tablet/i.test(userAgent)) {
        deviceType = 'Tablet';
      }
    }

    const { data, error } = await supabase
      .from('visitas_loja')
      .insert({
        loja_id: lojaId,
        pagina: pagina,
        origem: origem, // Pode ser null se não houver referrer
        ip: ip,
        navegador: userAgent, // Salva o user-agent completo para análise posterior se necessário
        dispositivo: deviceType,
      });

    if (error) {
      console.error('Erro ao inserir visita na Supabase:', error);
      return NextResponse.json({ error: 'Erro ao registrar visita.', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Visita registrada com sucesso!', data }, { status: 200 });

  } catch (error: any) {
    console.error('Erro no handler da API de rastro:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.', details: error.message }, { status: 500 });
  }
}
