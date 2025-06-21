import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Validação explícita para não deixar passar despercebido
if (!process.env.RESEND_API_KEY) {
  throw new Error('Faltando a variável de ambiente RESEND_API_KEY');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { nome, email } = await request.json();

    await resend.emails.send({
      from: 'delivered@resend.dev', // Troca pelo seu remetente autorizado
      to: email,
      subject: `Bem-vindo(a), ${nome}!`,
      html: `<p>Olá <strong>${nome}</strong>, seu cadastro foi um sucesso! 🎉</p><p>Agradecemos por se juntar à nossa comunidade!</p>`,
    });

    return NextResponse.json({ message: 'Email enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: `Erro ao enviar email: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ error: 'Erro desconhecido ao enviar email' }, { status: 500 });
  }
}
