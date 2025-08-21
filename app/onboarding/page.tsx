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
            const savedNomeLoja = localStorage.getItem('nomeLoja');
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
            let baseSlug = slugify(lojaNome);
            let finalSlug = baseSlug;
            let counter = 0;
            let slugIsUnique = false;

            // Lógica para garantir que o slug seja único
            while (!slugIsUnique) {
                const { data: existingLoja, error: checkSlugError } = await supabase
                    .from('lojas')
                    .select('slug')
                    .eq('slug', finalSlug)
                    .single();

                if (checkSlugError && checkSlugError.code !== 'PGRST116') { // PGRST116 é 'no rows found'
                    console.error("Erro ao verificar slug existente:", checkSlugError);
                    setError('Erro ao verificar nome da loja. Tente novamente.');
                    setLoading(false);
                    return;
                }

                if (existingLoja) {
                    counter++;
                    finalSlug = `${baseSlug}-${counter}`;
                } else {
                    slugIsUnique = true;
                }
            }

            // 1. Cria a loja com o slug único
            const { data: lojaInserida, error: dbError } = await supabase
                .from('lojas')
                .insert({
                    nome_loja: lojaNome,
                    slug: finalSlug,
                    owner_id: user.id
                })
                .select('id, slug')
                .single();
            
            if (dbError) {
                console.error("Erro ao inserir loja (detalhes):", dbError.message, dbError.code, dbError.details, dbError.hint);
                setError('Erro ao registrar a loja. Tente novamente.');
                setLoading(false);
                return;
            }

            // 2. Busca o Plano Grátis
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

            // 4. CRIA O REGISTRO DO USUÁRIO NA TABELA 'public.usuarios'
            const { error: perfilError } = await supabase
                .from('usuarios')
                .insert({
                    id: user.id, // O ID do usuário autenticado
                    email: user.email, // O email do usuário autenticado
                    nome_completo: lojaNome // Nome da loja como nome completo inicial
                    // Outros campos podem ser nulos ou preenchidos depois
                });

            if (perfilError) {
                console.error("Erro ao criar perfil de usuário na tabela 'usuarios':", perfilError);
                setError('Erro ao configurar seu perfil de usuário. Tente novamente.');
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
