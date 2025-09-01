import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import React from 'react';
import { ThemeConfig, LojaData, ProdutoData, CategoryData, BannerData, InfoBarItem } from '../../../(painel)/personalizar/types';
import { Padrao } from '../../../(painel)/personalizar/themes/Padrao';
import { ThemeProvider } from '../../../(painel)/personalizar/context/ThemeContext';
import TemaPadrao from './components/temas/TemaPadrao';
import HomePageContent from './components/HomePageContent';


export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: { lojaSlug: string } }) {
    const lojaSlug = params.lojaSlug;
    const supabase = createServerComponentClient({ cookies });

    let temaConfig: ThemeConfig = Padrao;
    let lojaData: LojaData | null = null;
    let produtos: ProdutoData[] = [];
    let banners: BannerData[] = [];
    let categorias: CategoryData[] = [];
    const infoBarItems: InfoBarItem[] = [];
    let error: string | null = null;

    try {
        const { data: loja, error: lojaError } = await supabase
            .from('lojas')
            .select('*, temas!inner(nome_tema, configuracoes_json)')
            .eq('slug', lojaSlug)
            .single();

        if (lojaError || !loja) {
            console.error('Erro: Loja não encontrada ou erro na busca.', lojaError);
            error = 'Loja não encontrada.';
        } else {
            lojaData = loja;
            if (loja.temas?.configuracoes_json) {
                temaConfig = loja.temas.configuracoes_json as ThemeConfig;
            } else {
                console.warn(`Configuração JSON para o tema '${loja.temas?.nome_tema || 'Padrão'}' não encontrada. Usando fallback.`);
                temaConfig = Padrao;
            }
        }
    } catch (err: any) {
        console.error('Erro inesperado na busca:', err.message);
        error = 'Erro inesperado na busca.';
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">Erro: {error}</div>;
    }

    return (
        <ThemeProvider
            lojaSlug={lojaSlug}
            initialThemeConfig={temaConfig}
            lojaData={lojaData || undefined}
            produtos={produtos}
            banners={banners}
            categorias={categorias}
            infoBarItems={infoBarItems}
            isIframeHost={false}
        >
            <TemaPadrao>
                <HomePageContent />
            </TemaPadrao>
        </ThemeProvider>
    );
}