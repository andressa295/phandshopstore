// app/api/send-welcome-email/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  // Garante que o erro exploda logo no boot (ideal em produção)
  throw new Error('RESEND_API_KEY não está configurada nas variáveis de ambiente.');
}

const resend = new Resend(resendApiKey);

export async function POST(req: Request) {
  try {
    const { nome, email, plano, recorrencia } = await req.json();

    // Validação de dados obrigatórios
    if (!nome || !email || !plano || !recorrencia) {
      return NextResponse.json(
        { error: 'Dados incompletos para envio de e-mail.' },
        { status: 400 }
      );
    }

    // Template de e-mail
    const emailHtmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo(a) à PhandShop!</title>
  <style>
    body {
      font-family: 'Poppins', sans-serif;
      background-color: #f7f7fa;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
      overflow: hidden;
    }
    .header {
      background-color: #7B68EE;
      color: #fff;
      padding: 20px 25px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .content {
      padding: 25px;
      line-height: 1.6;
      font-size: 16px;
    }
    .content p {
      margin-bottom: 15px;
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .button {
      background-color: #7B68EE;
      color: #fff;
      padding: 12px 25px;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      transition: background-color 0.3s ease;
    }
    .button:hover {
      background-color: #6A5ACD;
    }
    .footer {
      background-color: #f0f0f0;
      color: #777;
      padding: 15px 25px;
      text-align: center;
      font-size: 13px;
    }
    strong {
      color: #7B68EE;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Bem-vindo(a) à PhandShop!</h1>
    </div>
    <div class="content">
      <p>Olá, <strong>${nome}</strong>!</p>
      <p>Seu cadastro foi realizado com sucesso!</p>
      <p>Você escolheu o plano <strong>${plano}</strong>, com pagamento <strong>${recorrencia === 'anual' ? 'anual' : 'mensal'}</strong>.</p>
      <p>Estamos muito felizes em tê-lo(a) conosco. Prepare-se para criar sua loja online e impulsionar suas vendas!</p>
      <div class="button-container">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" class="button">Acessar sua Dashboard</a>
      </div>
      <p>Se tiver qualquer dúvida, nossa equipe de suporte está à disposição.</p>
      <p>Boas vendas!<br>— Equipe PhandShop</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} PhandShop. Todos os direitos reservados.</p>
      <p>Este é um e-mail automático, por favor, não responda.</p>
    </div>
  </div>
</body>
</html>`;

    const { data, error } = await resend.emails.send({
      from: 'PhandShop <no-reply@phandshop.com>',
      to: email,
      subject: `🎉 Bem-vindo(a) à PhandShop! Seu plano ${plano} está ativo.`,
      html: emailHtmlContent,
    });

    if (error) {
      console.error('[RESEND_ERROR]', error);
      return NextResponse.json(
        { error: 'Erro ao enviar o e-mail. Tente novamente mais tarde.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Email de boas-vindas enviado com sucesso!', data },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('[SEND_WELCOME_EMAIL_ERROR]', err);
    return NextResponse.json(
      { error: 'Erro interno ao enviar o e-mail.' },
      { status: 500 }
    );
  }
}
