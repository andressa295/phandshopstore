'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

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
            const lojaSlug = slugify(lojaNome);
            
            const { data: lojaInserida, error: dbError } = await supabase
                .from('lojas')
                .insert({
                    nome_loja: lojaNome,
                    slug: lojaSlug,
                    user_id: user.id
                })
                .select('id')
                .single();
            
            if (dbError) {
                console.error("Erro ao inserir loja:", dbError);
                setError('Erro ao registrar a loja. Tente novamente.');
                setLoading(false);
                return;
            }

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
            
        } catch (err) {
            setError('Ocorreu um erro inesperado. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Bem-vindo!</h1>
            <p>Sua conta foi criada. Agora vamos configurar sua loja.</p>
            
            <div style={{ marginTop: '2rem' }}>
                <input 
                    type="text" 
                    value={lojaNome}
                    onChange={(e) => setLojaNome(e.target.value)}
                    placeholder="Nome da sua marca"
                    style={{ padding: '0.5rem', width: '300px' }}
                />
                <button 
                    onClick={handleCreateStore} 
                    disabled={loading || !lojaNome}
                    style={{ marginLeft: '1rem' }}
                >
                    {loading ? 'Criando...' : 'Criar minha loja'}
                </button>
            </div>
            {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        </div>
    );
}