// app/(sitetemas)/[lojaSlug]/components/NewsletterSection.tsx
'use client';

import React, { useState } from 'react';
// Se precisar de ícones para e-mail, etc., importe do Lucide React
import { Mail } from 'lucide-react';

// REMOVIDO: import '../styles/newsletter-section.css'; // O estilo virá do tema ativo

interface NewsletterSectionProps {
    sectionTitle?: string;
    sectionSubtitle?: string;
    // Você pode adicionar props para configurar a mensagem de sucesso/erro
}

const NewsletterSection: React.FC<NewsletterSectionProps> = ({ 
    sectionTitle = "Receba nossas novidades e ofertas!", 
    sectionSubtitle = "Inscreva-se e fique por dentro de tudo o que acontece na nossa loja." 
}) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState(''); // CORREÇÃO: Adicionado o estado 'error'

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError(''); // Limpa erros anteriores
        setLoading(true);
        setIsSuccess(false);

        // Validação básica de e-mail
        if (!email || !email.includes('@') || !email.includes('.')) {
            setMessage('Por favor, insira um e-mail válido.');
            setIsSuccess(false);
            setLoading(false);
            return;
        }

        try {
            // Lógica de inscrição na newsletter aqui
            // Em uma aplicação real, você enviaria este e-mail para uma API (Supabase, Mailchimp, etc.)
            console.log(`Inscrição de e-mail: ${email}`);

            // Simulação de delay da API
            await new Promise(resolve => setTimeout(resolve, 1500));

            setMessage('Obrigado por se inscrever! Em breve você receberá nossas novidades.');
            setIsSuccess(true);
            setEmail(''); // Limpa o campo de e-mail
        } catch (err) {
            console.error('Erro ao se inscrever:', err);
            setError('Ocorreu um erro ao se inscrever. Tente novamente mais tarde.'); // Usando setError
            setIsSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="ph-newsletter-section">
            <h2 className="ph-newsletter-title">{sectionTitle}</h2>
            <p className="ph-newsletter-subtitle">{sectionSubtitle}</p>
            
            <form onSubmit={handleSubmit} className="ph-newsletter-form">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu melhor e-mail"
                    className="ph-newsletter-input"
                    required
                    disabled={loading}
                />
                <button type="submit" className="ph-newsletter-button" disabled={loading}>
                    {loading ? 'Enviando...' : 'Inscrever-se'}
                </button>
            </form>

            {message && (
                <p className={`ph-newsletter-message ${isSuccess ? 'ph-success' : 'ph-error'}`}>
                    {message}
                </p>
            )}
            {error && ( // Exibe o erro se houver
                <p className="ph-newsletter-message ph-error">
                    {error}
                </p>
            )}
        </section>
    );
};

export default NewsletterSection;
