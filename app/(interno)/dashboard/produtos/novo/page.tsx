'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FormularioProduto from '../components/FormularioProduto'; // Caminho para o FormularioProduto
import type { Produto } from '../../../../../types/Produto'; // <<< AJUSTE ESTE CAMINHO PARA O SEU ARQUIVO Produto.ts

export default function NovoProdutoPage() {
    const router = useRouter();
    const [produtos, setProdutos] = useState<Produto[]>([]);

    useEffect(() => {
        // Carregar produtos do localStorage ao montar o componente
        const storedProdutos = localStorage.getItem('produtosMock');
        if (storedProdutos) {
            setProdutos(JSON.parse(storedProdutos));
        }
    }, []);

    const handleSave = (novoProduto: Produto) => {
        // Lógica para adicionar o novo produto ao estado e localStorage
        const novoId = Math.max(...produtos.map(p => p.id), 0) + 1; // Garante um novo ID
        const produtosAtualizados = [...produtos, { ...novoProduto, id: novoId }];
        localStorage.setItem('produtosMock', JSON.stringify(produtosAtualizados));
        alert('Produto adicionado com sucesso!'); // Feedback provisório
        router.push('/dashboard/produtos/lista'); // Voltar para a lista de produtos
    };

    const handleCancel = () => {
        router.push('/dashboard/produtos/lista'); // Voltar para a lista de produtos
    };

    const colors = { // Cores para o layout da página de formulário
        primary: '#6b21a8',
        background: '#f8f9fa',
        white: '#ffffff',
        text: '#333333',
    };
    const typography = {
        fontFamily: 'Poppins, sans-serif',
        headingSize: '1.8rem',
    };

    return (
        <div style={{
            padding: '20px',
            fontFamily: typography.fontFamily,
            color: colors.text,
            backgroundColor: colors.background,
            minHeight: 'calc(100vh - 100px)', // Ajuste para ocupar a altura restante do painel
            boxSizing: 'border-box',
        }}>
            <h1 style={{
                marginBottom: '25px',
                fontSize: typography.headingSize,
                color: colors.primary,
                textAlign: 'center',
                fontWeight: 'bold',
                margin: 0, padding: 0,
            }}>
                Adicionar Novo Produto
            </h1>
            <div style={{
                backgroundColor: colors.white,
                padding: '30px',
                borderRadius: '8px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                maxWidth: '600px', // Limita a largura do formulário
                margin: '20px auto', // Centraliza o formulário
                boxSizing: 'border-box',
            }}>
                <FormularioProduto
                    produtoInicial={null} // Passa null para indicar que é um novo produto
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
}