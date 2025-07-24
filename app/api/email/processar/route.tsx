// app/api/send-welcome-email/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { nome, email, plano } = await req.json();

  try {
    const { data, error } = await resend.emails.send({
      from: 'Phandshop <no-reply@phandshop.com>',
      to: email,
      subject: `🎉 Bem-vindo ao ${plano}!`,
      html: `<p>Olá, <strong>${nome}</strong>!<br><br>Seu cadastro no plano <strong>${plano}</strong> foi realizado com sucesso. Seja muito bem-vindo(a) à Phandshop! 🚀<br><br>Qualquer dúvida, estamos aqui. 😉</p>`,
    });

    if (error) {
      console.error('Erro ao enviar email:', error);
      return NextResponse.json({ error: 'Falha ao enviar o e-mail.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Email enviado com sucesso!' });
  } catch (err) {
    return NextResponse.json({ error: 'Erro inesperado ao enviar o e-mail.' }, { status: 500 });
  }
}
