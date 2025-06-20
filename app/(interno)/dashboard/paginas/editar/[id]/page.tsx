// app\(interno)\dashboard\paginas\editar\[id]\page.tsx (NOVO ARQUIVO: PÁGINA PARA EDITAR PÁGINA)
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import FormularioPagina from '../../components/FormularioPagina'; // Caminho para o FormularioPagina
import type { PaginaInformativa } from '../../../../../../types/PaginaInformativa'; // <<< AJUSTE O CAMINHO

// Definindo cores e fontes (no topo do arquivo)
const colors = {
    primary: '#6b21a8',
    background: '#f8f9fa',
    white: '#ffffff',
    text: '#333333',
    danger: '#dc3545',
};
const typography = {
    fontFamily: 'Poppins, sans-serif',
    headingSize: '1.8rem',
};

export default function EditarPaginaInformativaPage() {
    const router = useRouter();
    const params = useParams();
    const pageId = params.id ? parseInt(params.id as string) : null;

    const [paginas, setPaginas] = useState<PaginaInformativa[]>([]);
    const [paginaAtual, setPaginaAtual] = useState<PaginaInformativa | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedPaginas = localStorage.getItem('paginasInformativasMock');
        if (storedPaginas) {
            const parsedPaginas: PaginaInformativa[] = JSON.parse(storedPaginas);
            setPaginas(parsedPaginas);
            const foundPage = parsedPaginas.find(p => p.id === pageId);
            if (foundPage) {
                setPaginaAtual(foundPage);
            } else {
                alert('Página não encontrada!');
                router.push('/dashboard/paginas');
            }
        } else {
            alert('Nenhuma página informativa encontrada. Crie páginas primeiro.');
            router.push('/dashboard/paginas');
        }
        setLoading(false);
    }, [pageId, router]);

    const handleSave = (paginaEditada: PaginaInformativa) => {
        const paginasAtualizadas = paginas.map(p =>
            p.id === paginaEditada.id ? paginaEditada : p
        );
        localStorage.setItem('paginasInformativasMock', JSON.stringify(paginasAtualizadas));
        alert('Página atualizada com sucesso!');
        router.push('/dashboard/paginas');
    };

    const handleCancel = () => {
        router.push('/dashboard/paginas');
    };

    const handleDelete = (pageToDelete: PaginaInformativa) => {
        if (window.confirm(`Tem certeza que deseja excluir a página "${pageToDelete.titulo}"?`)) {
            const paginasAtualizadas = paginas.filter(p => p.id !== pageToDelete.id);
            localStorage.setItem('paginasInformativasMock', JSON.stringify(paginasAtualizadas));
            alert(`Página "${pageToDelete.titulo}" excluída com sucesso!`);
            router.push('/dashboard/paginas');
        }
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
                Carregando página...
            </div>
        );
    }

    if (!paginaAtual) {
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
                Página não encontrada ou ID inválido.
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
                Editar Página: {paginaAtual.titulo}
            </h1>
            <div style={{
                backgroundColor: colors.white,
                padding: '30px',
                borderRadius: '8px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                maxWidth: '700px', // Aumenta largura para o RTE
                margin: '20px auto',
                boxSizing: 'border-box',
            }}>
                <FormularioPagina
                    paginaInicial={paginaAtual}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
}