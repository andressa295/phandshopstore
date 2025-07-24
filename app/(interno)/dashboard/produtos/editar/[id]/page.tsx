'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import FormularioProduto from '../../components/FormularioProduto'; 
import type { Produto } from '../../../../../../types/Produto'; 

export default function EditarProdutoPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id ? parseInt(params.id as string) : null;

    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [produtoAtual, setProdutoAtual] = useState<Produto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedProdutos = localStorage.getItem('produtosMock');
        if (storedProdutos) {
            const parsedProdutos: Produto[] = JSON.parse(storedProdutos);
            setProdutos(parsedProdutos);
            const foundProduct = parsedProdutos.find(p => p.id === productId);
            if (foundProduct) {
                setProdutoAtual(foundProduct);
            } else {
                alert('Produto não encontrado!');
                router.push('/dashboard/produtos/lista');
            }
        } else {
            alert('Nenhum produto encontrado. Carregue o mock de produtos.');
            router.push('/dashboard/produtos/lista');
        }
        setLoading(false);
    }, [productId, router]);

    const handleSave = (produtoEditado: Produto) => {
        const produtosAtualizados = produtos.map(p =>
            p.id === produtoEditado.id ? produtoEditado : p
        );
        localStorage.setItem('produtosMock', JSON.stringify(produtosAtualizados));
        alert('Produto atualizado com sucesso!'); // Feedback provisório
        router.push('/dashboard/produtos/lista');
    };

    const handleCancel = () => {
        router.push('/dashboard/produtos/lista');
    };

    const handleDelete = (prodToDelete: Produto) => {
        if (window.confirm(`Tem certeza que deseja excluir o produto "${prodToDelete.nome}"?`)) {
            const produtosAtualizados = produtos.filter(p => p.id !== prodToDelete.id);
            localStorage.setItem('produtosMock', JSON.stringify(produtosAtualizados));
            alert(`Produto "${prodToDelete.nome}" excluído com sucesso!`); // Feedback provisório
            router.push('/dashboard/produtos/lista');
        }
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

    if (loading) {
        return (
            <div style={{
                padding: '20px',
                fontFamily: typography.fontFamily,
                color: colors.text,
                backgroundColor: colors.background,
                minHeight: 'calc(100vh - 100px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                Carregando produto...
            </div>
        );
    }

    if (!produtoAtual) {
        return (
            <div style={{
                padding: '20px',
                fontFamily: typography.fontFamily,
                color: colors.text,
                backgroundColor: colors.background,
                minHeight: 'calc(100vh - 100px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                Produto não encontrado ou ID inválido.
            </div>
        );
    }

    return (
        <div style={{
            padding: '20px',
            fontFamily: typography.fontFamily,
            color: colors.text,
            backgroundColor: colors.background,
            minHeight: 'calc(100vh - 100px)',
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
                Editar Produto: {produtoAtual.nome}
            </h1>
            <div style={{
                backgroundColor: colors.white,
                padding: '30px',
                borderRadius: '8px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                maxWidth: '600px',
                margin: '20px auto',
                boxSizing: 'border-box',
            }}>
                <FormularioProduto
                    produtoInicial={produtoAtual}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
}