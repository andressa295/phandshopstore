// app/api/email/boasvindas/route.ts

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Importe seu componente de e-mail se estiver usando React Email
// import WelcomeEmail from '@/components/emails/WelcomeEmail'; // Exemplo, ajuste o caminho

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { nome, email, plano, recorrencia } = await req.json();

    if (!nome || !email || !plano || !recorrencia) {
      console.error('Dados incompletos recebidos para enviar o email de boas-vindas:', { nome, email, plano, recorrencia });
      return NextResponse.json({ error: 'Dados incompletos para enviar o e-mail de boas-vindas.' }, { status: 400 });
    }

    
    const emailHtmlContent = `
      <!DOCTYPE html>
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
                  background-color: #ffffff;
                  border-radius: 8px;
                  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
                  overflow: hidden;
              }
              .header {
                  background-color: #7B68EE; /* Cor da sua marca */
                  color: #ffffff;
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
                  display: inline-block;
                  background-color: #7B68EE; /* Cor da sua marca */
                  color: #ffffff;
                  padding: 12px 25px;
                  border-radius: 50px;
                  text-decoration: none;
                  font-weight: 600;
                  font-size: 16px;
                  transition: background-color 0.3s ease;
              }
              .button:hover {
                  background-color: #6A5ACD; /* Um tom ligeiramente mais escuro */
              }
              .footer {
                  background-color: #f0f0f0;
                  color: #777;
                  padding: 15px 25px;
                  text-align: center;
                  font-size: 13px;
              }
              strong {
                  font-weight: 700;
                  color: #7B68EE; /* Destaca o nome do plano/recorrência */
              }
          </style>
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
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
                  <p>Se tiver qualquer dúvida ou precisar de ajuda para dar os primeiros passos, nossa equipe de suporte está à disposição.</p>
                  <p>Boas vendas!<br>Atenciosamente,<br>A Equipe PhandShop</p>
              </div>
              <div class="footer">
                  <p>&copy; ${new Date().getFullYear()} PhandShop. Todos os direitos reservados.</p>
                  <p>Este é um e-mail automático, por favor, não responda.</p>
              </div>
          </div>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'PhandShop <no-reply@phandshop.com>', 
      to: email,
      subject: `🎉 Bem-vindo(a) à PhandShop! Seu plano ${plano} está ativo.`,
      html: emailHtmlContent, 
    });

    if (error) {
      console.error('Erro ao enviar e-mail com Resend:', error);
      return NextResponse.json({ error: 'Falha ao enviar o e-mail de boas-vindas.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Email de boas-vindas enviado com sucesso!', data }, { status: 200 });
  } catch (err: any) { 
    console.error('Erro inesperado na API de email:', err);
    return NextResponse.json({ error: 'Erro interno do servidor ao enviar o e-mail.' }, { status: 500 });
  }
}
