'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import styles from './onboarding.module.css'; // Importando o CSS Module

export default function OnboardingPage() {
    const supabase = createClientComponentClient();
    const router = useRouter();
    const [lojaNome, setLojaNome] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }
            // Não é recomendado usar localStorage para dados sensíveis ou persistência de estado complexa.
            // Se 'nomeLoja' for um dado temporário de preenchimento, ok.
            const savedNomeLoja = localStorage.getItem('nomeLoja');
            // CORREÇÃO 1: Typo 'savedNomeNomeLoja' corrigido para 'savedNomeLoja'
            // CORREÇÃO 2: Adicionada verificação para 'null' para setLojaNome
            if (savedNomeLoja) { 
                setLojaNome(savedNomeLoja);
                localStorage.removeItem('nomeLoja');
            }
        };
        checkUser();
    }, [supabase, router]);

    const slugify = (text: string) => {
        return text
            .toString()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-');
    };

    const handleCreateStore = async () => {
        setError('');
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            setError('Usuário não autenticado. Faça login novamente.');
            setLoading(false);
            return;
        }

        try {
            const lojaSlug = slugify(lojaNome);

            // 1. Cria a loja
            const { data: lojaInserida, error: dbError } = await supabase
                .from('lojas')
                .insert({
                    nome_loja: lojaNome,
                    slug: lojaSlug,
                    owner_id: user.id
                })
                .select('id, slug')
                .single();
            
            if (dbError) {
                console.error("Erro ao inserir loja (detalhes):", dbError.message, dbError.code, dbError.details, dbError.hint);

                if (dbError.code === '23505' && dbError.message.includes('slug')) {
                    setError('Este nome de loja já está em uso. Por favor, escolha outro.');
                } else {
                    setError('Erro ao registrar a loja. Tente novamente.');
                }
                setLoading(false);
                return;
            }

            // 2. Busca o Plano Grátis (assumindo que 'planos' e 'assinaturas' estão configurados)
            const { data: planoGratis, error: planoError } = await supabase
                .from('planos')
                .select('id')
                .eq('nome_plano', 'Plano Grátis')
                .single();

            if (planoError || !planoGratis) {
                console.error("Erro ao buscar Plano Grátis:", planoError);
                setError('Erro ao configurar o plano gratuito. Tente novamente.');
                setLoading(false);
                return;
            }

            // 3. Cria a assinatura gratuita
            const { error: assinaturaError } = await supabase
                .from('assinaturas')
                .insert({
                    loja_id: lojaInserida.id,
                    plano_id: planoGratis.id,
                    status: 'ativa',
                    periodo_atual_inicio: new Date().toISOString(),
                    periodo_atual_fim: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
                });
            
            if (assinaturaError) {
                console.error("Erro ao inserir assinatura:", assinaturaError);
                setError('Erro ao configurar a assinatura. Tente novamente.');
                setLoading(false);
                return;
            }

            router.push('/dashboard'); 
            
        } catch (err: any) {
            console.error('Ocorreu um erro inesperado:', err);
            setError(`Ocorreu um erro inesperado: ${err.message || 'Tente novamente.'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Bem-vindo!</h1>
            <p className={styles.subtitle}>Sua conta foi criada. Agora vamos configurar sua loja.</p>
            
            <div className={styles.formContainer}>
                <input 
                    type="text" 
                    value={lojaNome}
                    onChange={(e) => setLojaNome(e.target.value)}
                    placeholder="Nome da sua marca"
                    className={styles.input}
                />
                <button 
                    onClick={handleCreateStore} 
                    disabled={loading || !lojaNome}
                    className={styles.button}
                >
                    {loading ? 'Criando...' : 'Criar minha loja'}
                </button>
            </div>
            {error && <p className={styles.errorText}>{error}</p>}
        </div>
    );
}
