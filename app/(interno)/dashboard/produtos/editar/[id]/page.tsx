'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import FormularioProduto from '../../components/FormularioProduto'; 
import type { Produto } from '../../../../../../types/Produto'; 
import ConfirmModal from '../../components/ConfirmModal'; // Caminho ajustado
import Toast from '../../components/Toast'; // Caminho ajustado

export default function EditarProdutoPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id ? parseInt(params.id as string) : null;

    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [produtoAtual, setProdutoAtual] = useState<Produto | null>(null);
    const [loading, setLoading] = useState(true);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

    useEffect(() => {
        const storedProdutos = localStorage.getItem('produtosMock');
        if (storedProdutos) {
            const parsedProdutos: Produto[] = JSON.parse(storedProdutos);
            setProdutos(parsedProdutos);
            const foundProduct = parsedProdutos.find(p => p.id === productId);
            if (foundProduct) {
                setProdutoAtual(foundProduct);
            } else {
                console.error('Produto não encontrado!');
                router.push('/dashboard/produtos/lista');
            }
        } else {
            console.error('Nenhum produto encontrado. Carregue o mock de produtos.');
            router.push('/dashboard/produtos/lista');
        }
        setLoading(false);
    }, [productId, router]);

    const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSave = (produtoEditado: Produto) => {
        const produtosAtualizados = produtos.map(p =>
            p.id === produtoEditado.id ? produtoEditado : p
        );
        localStorage.setItem('produtosMock', JSON.stringify(produtosAtualizados));
        showToast('Produto atualizado com sucesso!', 'success');
        router.push('/dashboard/produtos/lista');
    };

    const handleCancel = () => {
        router.push('/dashboard/produtos/lista');
    };

    const handleDelete = (prodToDelete: Produto) => {
        setIsConfirmModalOpen(true);
    };

    const confirmarExclusao = () => {
        if (produtoAtual) {
            const produtosAtualizados = produtos.filter(p => p.id !== produtoAtual.id);
            localStorage.setItem('produtosMock', JSON.stringify(produtosAtualizados));
            showToast(`Produto "${produtoAtual.nome}" excluído com sucesso!`, 'success');
            setIsConfirmModalOpen(false);
            router.push('/dashboard/produtos/lista');
        }
    };

    const cancelarExclusao = () => {
        setIsConfirmModalOpen(false);
    };

    const colors = {
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
                    onDelete={() => handleDelete(produtoAtual)}
                />
            </div>
            {isConfirmModalOpen && (
                <ConfirmModal
                    isOpen={isConfirmModalOpen}
                    onClose={cancelarExclusao}
                    onConfirm={confirmarExclusao}
                    title="Confirmar Exclusão"
                    message={`Tem certeza que deseja excluir o produto "${produtoAtual?.nome}"? Esta ação não pode ser desfeita.`}
                    confirmText="Excluir"
                    cancelText="Cancelar"
                />
            )}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}