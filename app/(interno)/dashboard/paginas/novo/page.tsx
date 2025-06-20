// app\(interno)\dashboard\paginas\novo\page.tsx (NOVO ARQUIVO: PÁGINA PARA ADICIONAR PÁGINA)
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FormularioPagina from '../components/FormularioPagina'; // Caminho para o FormularioPagina
import type { PaginaInformativa } from '../../../../../types/PaginaInformativa'; // <<< AJUSTE O CAMINHO

// Definindo cores e fontes (no topo do arquivo)
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

export default function NovaPaginaInformativaPage() {
    const router = useRouter();
    const [paginas, setPaginas] = useState<PaginaInformativa[]>([]);

    useEffect(() => {
        const storedPaginas = localStorage.getItem('paginasInformativasMock');
        if (storedPaginas) {
            setPaginas(JSON.parse(storedPaginas));
        }
    }, []);

    const handleSave = (novaPagina: PaginaInformativa) => {
        const novoId = Math.max(...paginas.map(p => p.id), 0) + 1;
        const paginasAtualizadas = [...paginas, { ...novaPagina, id: novoId }];
        localStorage.setItem('paginasInformativasMock', JSON.stringify(paginasAtualizadas));
        alert('Página adicionada com sucesso!');
        router.push('/dashboard/paginas'); // Voltar para a lista de páginas
    };

    const handleCancel = () => {
        router.push('/dashboard/paginas'); // Voltar para a lista de páginas
    };

    return (
        <div style={{
            padding: '20px',
            fontFamily: typography.fontFamily,
            color: colors.text,
            backgroundColor: colors.background,
            minHeight: 'calc(100vh - 100px)', // Para rolagem da página
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
                Adicionar Nova Página Informativa
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
                    paginaInicial={null}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
}