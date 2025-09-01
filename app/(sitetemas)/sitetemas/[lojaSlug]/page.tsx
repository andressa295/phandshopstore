'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useParams } from 'next/navigation';
import { ThemeConfig, LojaData, ProdutoData, CategoryData, BannerData, InfoBarItem } from '../../../(painel)/personalizar/types';
import { Padrao } from '../../../(painel)/personalizar/themes/Padrao';
import { ThemeProvider } from '../../../(painel)/personalizar/context/ThemeContext';
import TemaPadrao from './components/temas/TemaPadrao';
import HomePageContent from './components/HomePageContent';


export default function Page() {
    const params = useParams();
    const lojaSlug = params.lojaSlug as string;
    const [themeData, setThemeData] = useState({
        initialThemeConfig: Padrao as ThemeConfig,
        lojaData: null as LojaData | null,
        produtos: [] as ProdutoData[],
        banners: [] as BannerData[],
        categorias: [] as CategoryData[],
        infoBarItems: [] as InfoBarItem[],
        isLoading: true,
        error: null as string | null,
    });
    
    const supabase = createClientComponentClient();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // CORRIGIDO: Busca a loja e a configuração do tema em uma única consulta
                const { data: loja, error: lojaError } = await supabase
                    .from('lojas')
                    .select('*, temas(nome_tema, configuracoes_json)')
                    .eq('slug', lojaSlug)
                    .single();

                let temaConfig: ThemeConfig = Padrao;
                
                if (lojaError || !loja) {
                    console.error('Erro: Loja não encontrada ou erro na busca. Usando tema padrão.');
                    setThemeData(prev => ({ ...prev, isLoading: false, error: 'Loja não encontrada.', initialThemeConfig: Padrao }));
                    return;
                }

                if (loja.temas && loja.temas.configuracoes_json) {
                    temaConfig = loja.temas.configuracoes_json as ThemeConfig;
                } else {
                    console.warn(`Configuração JSON para o tema '${loja.temas?.nome_tema || 'Padrão'}' não encontrada. Usando fallback.`);
                    temaConfig = Padrao;
                }

                // Carrega os dados de produtos e banners
                const [produtosResult, bannersResult, categoriasResult] = await Promise.all([
                    supabase.from('produtos').select(`id, nome, descricao, preco, estoque, imagem_url, categoria_id`),
                    supabase.from('banners').select(`id, imagem_url, link_url, titulo, subtitulo, ordem`),
                    supabase.from('categorias').select(`id, nome, slug, imagem_url`),
                ]);

                setThemeData({
                    initialThemeConfig: temaConfig,
                    lojaData: loja,
                    produtos: (produtosResult.data || []) as ProdutoData[],
                    banners: (bannersResult.data || []) as BannerData[],
                    categorias: (categoriasResult.data || []) as CategoryData[],
                    infoBarItems: [],
                    isLoading: false,
                    error: null,
                });
            } catch (err: any) {
                console.error('Erro inesperado na busca:', err.message);
                setThemeData(prev => ({ ...prev, isLoading: false, error: err.message, initialThemeConfig: Padrao }));
            }
        };

        if (lojaSlug) {
            fetchData();
        } else {
            setThemeData(prev => ({ ...prev, isLoading: false, error: 'Slug da loja não encontrado.', initialThemeConfig: Padrao }));
        }
    }, [lojaSlug, supabase]);

    if (themeData.isLoading) {
        return <div className="p-4 text-center">Carregando loja...</div>;
    }

    if (themeData.error) {
        return <div className="p-4 text-center text-red-500">Erro: {themeData.error}</div>;
    }
    
    return (
        <ThemeProvider
            lojaSlug={lojaSlug}
            initialThemeConfig={themeData.initialThemeConfig}
            lojaData={themeData.lojaData || undefined}
            produtos={themeData.produtos}
            banners={themeData.banners}
            categorias={themeData.categorias}
            infoBarItems={themeData.infoBarItems}
            isIframeHost={false}
        >
            <TemaPadrao>
                <HomePageContent />
            </TemaPadrao>
        </ThemeProvider>
    );
}
