import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb'; 
import ThemeConfigModel from '@/models/ThemeConfig'; 
import defaultThemeConfig from '../../../(painel)/personalizar/context/defaultThemeConfig'; 
import { ThemeConfig } from '@/app/(painel)/personalizar/types'; 


export async function GET(
  request: NextRequest,
  context: { params: { themeName: string } } 
) {
    await dbConnect(); // Conecta ao banco de dados
    const { themeName } = context.params; // Acessa themeName através de context.params

    try {
        const themeConfigDoc = await ThemeConfigModel.findOne({ themeName: themeName });

        if (!themeConfigDoc) {
            console.log(`[API GET - INFO]: Configuração para "${themeName}" não encontrada no DB. Retornando padrão.`);
            return NextResponse.json(defaultThemeConfig, { status: 200 });
        }

        console.log(`[API GET - SUCESSO]: Configurações para "${themeName}" carregadas do DB.`);
        return NextResponse.json(themeConfigDoc.config, { status: 200 });

    } catch (error: any) { 
        console.error(`[API GET - ERRO]: Erro ao carregar configurações do tema para ${themeName}:`, error);
        return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
    }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { themeName: string } } 
) {
    await dbConnect(); // Conecta ao banco de dados
    const { themeName } = params;
    const config: ThemeConfig = await request.json(); 

    if (!config) {
        return NextResponse.json({ message: 'Corpo da requisição de configuração é obrigatório.' }, { status: 400 });
    }

    try {
        const updatedDoc = await ThemeConfigModel.findOneAndUpdate(
            { themeName: themeName }, // Critério de busca: o nome do tema
            { config: config, lastUpdated: new Date() }, // Dados a serem atualizados/inseridos
            { new: true, upsert: true, runValidators: true } // Opções: retorna o doc atualizado, cria se não existe, roda validações do Schema
        );

        console.log(`[API POST - SUCESSO]: Configuração para "${themeName}" salva/atualizada no DB.`);
        return NextResponse.json({ message: 'Configuração salva com sucesso!', data: updatedDoc.config }, { status: 200 });

    } catch (error: any) { 
        console.error(`[API POST - ERRO]: Erro ao salvar/atualizar configuração do tema para ${themeName}:`, error);
        if (error.name === 'ValidationError') { // Erro específico do Mongoose para validação de Schema
            return NextResponse.json({ message: 'Erro de validação ao salvar a configuração.', details: error.message }, { status: 400 });
        }
        return NextResponse.json({ message: 'Erro interno do servidor ao salvar a configuração.' }, { status: 500 });
    }
}