'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import FormularioProduto from '../components/FormularioProduto';
import type { Produto } from '../../../../../types/Produto';

export default function NovoProdutoPage() {
    const router = useRouter();
    const supabase = createClientComponentClient();
    const [lojaId, setLojaId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLojaId() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }
            const { data: loja, error } = await supabase
                .from('lojas')
                .select('id')
                .eq('usuario_id', user.id)
                .single();
            if (error) {
                console.error('Erro ao buscar loja:', error);
                // Redireciona ou exibe erro se a loja não for encontrada
                router.push('/dashboard');
                return;
            }
            setLojaId(loja.id);
            setLoading(false);
        }

        fetchLojaId();
    }, [supabase, router]);

    const handleSave = async (novoProduto: Produto) => {
        if (!lojaId) {
            console.error('Loja ID não disponível.');
            return;
        }

        const { error } = await supabase.from('produtos').insert({
            loja_id: lojaId,
            nome: novoProduto.nome,
            categoria_id: novoProduto.categoria,
            estoque: novoProduto.estoque,
            preco: novoProduto.preco,
            preco_promocional: novoProduto.precoPromocional,
            ativo: novoProduto.ativo,
            imagens: novoProduto.imagensAdicionais,
            descricao: novoProduto.descricao,
            sku: novoProduto.sku,
            peso: novoProduto.peso,
            altura: novoProduto.altura,
            largura: novoProduto.largura,
            comprimento: novoProduto.comprimento,
            meta_titulo: novoProduto.metaTitulo,
            meta_descricao: novoProduto.metaDescricao,
            palavras_chave: novoProduto.palavrasChave,
            url_amigavel: novoProduto.urlAmigavel,
            has_variacoes: novoProduto.hasVariacoes,
            variacoes: novoProduto.variacoes,
            is_personalizado: novoProduto.isPersonalizado,
            personalizacao_texto_campos: novoProduto.personalizacaoTextoCampos,
            personalizacao_numerica_campos: novoProduto.personalizacaoNumericaCampos,
        });

        if (error) {
            console.error('Erro ao adicionar produto:', error);
            alert('Erro ao adicionar produto.');
        } else {
            alert('Produto adicionado com sucesso!');
            router.push('/dashboard/produtos/lista');
        }
    };

    const handleCancel = () => {
        router.push('/dashboard/produtos/lista');
    };
    
    if (loading) {
        return <div className="flex justify-center items-center h-screen">Carregando...</div>;
    }

    return (
        <div style={{
            padding: '20px',
            fontFamily: 'Poppins, sans-serif',
            color: '#333333',
            backgroundColor: '#f8f9fa',
            minHeight: 'calc(100vh - 100px)',
            boxSizing: 'border-box',
        }}>
            <h1 style={{
                marginBottom: '25px',
                fontSize: '1.8rem',
                color: '#6b21a8',
                textAlign: 'center',
                fontWeight: 'bold',
                margin: 0, padding: 0,
            }}>
                Adicionar Novo Produto
            </h1>
            <div style={{
                backgroundColor: '#ffffff',
                padding: '30px',
                borderRadius: '8px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                maxWidth: '600px',
                margin: '20px auto',
                boxSizing: 'border-box',
            }}>
                <FormularioProduto
                    produtoInicial={null}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
}
