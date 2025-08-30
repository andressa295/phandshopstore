import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
  auth: { persistSession: false },
});

export async function POST(request: Request) {
  const { name, email, whatsapp } = await request.json();

  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([{ name, email, whatsapp }]);

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({
          message: 'Parece que você já se cadastrou! Obrigado!',
          success: false
        }, { status: 409 });
      }
      console.error('Erro ao salvar lead:', error);
      return NextResponse.json({
        message: 'Houve um erro. Tente novamente!',
        success: false
      }, { status: 500 });
    }
    
    // --- LÓGICA DE ENVIO DE E-MAIL (AGORA MAIS ROBUSTA) ---
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);

      await resend.emails.send({
        from: 'no-reply@phandshop.com.br',
        to: [email],
        subject: 'Bem-vindo(a) à Lista VIP Phandshop!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Confirmação de Cadastro</title>
            <style>
              body { font-family: 'Poppins', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 0; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); overflow: hidden;}
              .header { text-align: center; background-color: #6b21a8; padding: 20px; }
              .header h1 { color: #ffffff; margin-top: 15px; font-size: 24px; }
              .logo-container { text-align: center; }
              .logo-container img { max-width: 150px; height: auto; display: block; margin: 0 auto; }
              .content { padding: 20px; line-height: 1.6; color: #555; background-color: #ffffff; }
              .content p { font-size: 16px; }
              .cta-button { text-align: center; margin: 20px 0; }
              .cta-button a {
                display: inline-block;
                padding: 12px 24px;
                background-color: #6b21a8;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
              }
              .footer { text-align: center; font-size: 12px; color: #999; padding: 20px; background-color: #f0f0f0; border-top: 1px solid #ddd; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo-container">
                  <img src="${process.env.PHANDSHOP_LOGO_URL}" alt="Logo Phandshop">
                </div>
                <h1>Bem-vindo(a) à nossa Lista VIP!</h1>
              </div>
              <div class="content">
                <p>Olá, **${name}**!</p>
                <p>Seu cadastro para a nossa lista de pré-lançamento foi confirmado com sucesso. Você agora faz parte de um grupo seleto de lojistas que terá acesso a novidades e benefícios exclusivos.</p>
                <p>Fique de olho na sua caixa de entrada! Em breve, entraremos em contato para o processo de seleção.</p>
                <p>Atenciosamente,<br>A Equipe Phandshop</p>
              </div>
              <div class="footer">
                <p>&copy; 2025 Phandshop. Todos os direitos reservados.</p>
              </div>
            </div>
          </body>
          </html>
        `
      });
    }

    return NextResponse.json({
      message: 'Cadastro realizado com sucesso!',
      success: true
    }, { status: 201 });
    
  } catch (err) {
    console.error('Erro na requisição:', err);
    return NextResponse.json({
      message: 'Houve um erro inesperado. Tente novamente!',
      success: false
    }, { status: 500 });
  }
}