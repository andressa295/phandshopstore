import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: Request) {
  try {
    const { nome, email } = await request.json();

    await resend.emails.send({
      from: 'onboarding@resend.dev',  // Mude para o seu remetente autorizado na Resend
      to: email,
      subject: `Bem-vindo(a), ${nome}!`,
      html: `<p>Olá <strong>${nome}</strong>, seu cadastro foi um sucesso! 🎉</p>`,
    });

    return NextResponse.json({ message: 'Email enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return NextResponse.json({ error: 'Erro ao enviar email' }, { status: 500 });
  }
}
