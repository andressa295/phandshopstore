import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Váriavel de ambiente para o e-mail de envio
const RESEND_SENDER_EMAIL = process.env.RESEND_SENDER_EMAIL || 'PhandShop <no-reply@phandshop.com>';
// Váriavel de ambiente para a URL do seu site
const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao processar a requisição JSON.' }, { status: 400 });
  }

  const { nome, email, plano, recorrencia } = body;

  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.error('RESEND_API_KEY não está configurada no servidor.');
    return NextResponse.json({ error: 'Erro interno do servidor: chave de API de e-mail ausente.' }, { status: 500 });
  }

  const resend = new Resend(resendApiKey);

  try {
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
        <a href="${NEXT_PUBLIC_SITE_URL}/dashboard" class="button">Acessar sua Dashboard</a>
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
      from: RESEND_SENDER_EMAIL, // Usando a variável de ambiente
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