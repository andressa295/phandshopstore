// app/api/enviar-email/route.ts (COMPLETO E CORRIGIDO: USO DE NEXT_PUBLIC_RESEND_API_KEY)
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// CORREÇÃO: Acessa a variável de ambiente usando NEXT_PUBLIC_
// O operador '!' (non-null assertion operator) indica ao TypeScript que acreditamos que a variável estará presente.
// É CRUCIAL que esta variável esteja configurada no ambiente da Vercel (Production, Preview) e no seu .env.local (Development).
const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY!);

export async function POST(request: Request) {
  try {
    const { nome, email } = await request.json();

    // Verificação adicional para garantir que a chave existe antes de tentar usar a Resend
    // Embora o '!' acima já faça o TypeScript confiar, esta verificação é uma boa prática em runtime.
    if (!process.env.NEXT_PUBLIC_RESEND_API_KEY) {
      console.error('ERRO: NEXT_PUBLIC_RESEND_API_KEY não está configurada no ambiente.');
      return NextResponse.json({ error: 'Configuração do servidor de e-mail ausente.' }, { status: 500 });
    }

    // Tenta enviar o e-mail usando a instância da Resend
    await resend.emails.send({
      from: 'delivered@resend.dev',   // Mude para o seu remetente autorizado na Resend (ex: 'contato@seusite.com')
      to: email, // O e-mail do destinatário (do formulário)
      subject: `Bem-vindo(a), ${nome}!`, // Assunto do e-mail
      html: `<p>Olá <strong>${nome}</strong>, seu cadastro foi um sucesso! 🎉</p><p>Agradecemos por se juntar à nossa comunidade!</p>`, // Conteúdo HTML do e-mail
    });

    // Retorna uma resposta de sucesso
    return NextResponse.json({ message: 'Email enviado com sucesso!' });

  } catch (error) {
    // Captura e loga qualquer erro que ocorra durante o processo de envio
    console.error('Erro ao enviar email:', error);
    
    // Retorna uma resposta de erro, tentando ser mais descritiva
    if (error instanceof Error) {
        return NextResponse.json({ error: `Erro ao enviar email: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ error: 'Erro desconhecido ao enviar email' }, { status: 500 });
  }
}