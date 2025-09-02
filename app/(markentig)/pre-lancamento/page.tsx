'use client';

import { useState, FormEvent, useEffect } from 'react';
import './styles/styles.css'; 
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import Image from 'next/image';
import { User, Mail, Smartphone, ArrowRight, Check } from 'lucide-react'; // Ícones para o formulário

const Countdown = () => {
    const targetDate = new Date('2026-01-20T00:00:00');
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();
            if (difference <= 0) {
                clearInterval(timer);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="countdown-container">
            <div className="countdown-item">
                <span className="countdown-value">{timeLeft.days}</span>
                <span className="countdown-label">Dias</span>
            </div>
            <div className="countdown-item">
                <span className="countdown-value">{timeLeft.hours}</span>
                <span className="countdown-label">Horas</span>
            </div>
            <div className="countdown-item">
                <span className="countdown-value">{timeLeft.minutes}</span>
                <span className="countdown-label">Min</span>
            </div>
            <div className="countdown-item">
                <span className="countdown-value">{timeLeft.seconds}</span>
                <span className="countdown-label">Seg</span>
            </div>
        </div>
    );
};

export default function PreLancamento() {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [whatsapp, setWhatsapp] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, whatsapp }),
            });
            const data = await response.json();
            if (response.ok) {
                setSuccess(true);
                setName('');
                setEmail('');
                setWhatsapp('');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Erro ao enviar o formulário:', error);
            alert('Erro ao enviar. Tente novamente mais tarde.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <header className="header">
                <div className="header-content-wrapper">
                    <div className="logo">
                        <img src="/logo.png" alt="Logo da Phandshop" style={{ height: '40px' }} />
                    </div>
                    <Countdown />
                </div>
            </header>

            <section className="hero-with-video">
                <video className="hero-background-video" autoPlay loop muted playsInline>
                    <source src="/phandshop-hero-desktop.mp4" media="(min-width: 769px)" type="video/mp4" />
                    <source src="/phandshop-hero-mobile.mp4" media="(max-width: 768px)" type="video/mp4" />
                    Seu navegador não suporta a tag de vídeo.
                </video>
            </section>
        
            <section className="hero-content-below">
                <h1>Seja um dos primeiros lojistas!</h1>
                <div className="highlight-message-wrapper">
                    <h3 className="highlight-message-title">Oportunidade Única em Dezembro!</h3>
                    <p className="highlight-message-body">
                        O lançamento oficial da nossa plataforma será no dia <b>20 de janeiro</b>. Mas, em <b>dezembro</b>, estamos abrindo uma oportunidade única para você.
                    </p>
                    <p className="highlight-message-benefit">
                        Garanta sua vaga para ser um dos primeiros a criar e testar sua loja online com acesso gratuito aos recursos completos e suporte VIP, ajudando a moldar a plataforma antes de todo mundo!
                    </p>
                </div>
                <p>Preencha o formulário abaixo:</p>
                <form onSubmit={handleSubmit} className="lead-form">
                    {success ? (
                        <div className="success-message-wrapper">
                            <Check size={32} />
                            <p className="success-message">Obrigado! Você entrou na lista VIP. 🎉</p>
                        </div>
                    ) : (
                        <>
                            <div className="form-fields">
                                <div className="input-with-icon">
                                    <User size={20} className="input-icon" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Seu nome"
                                        required
                                    />
                                </div>
                                <div className="input-with-icon">
                                    <Mail size={20} className="input-icon" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Seu melhor e-mail"
                                        required
                                    />
                                </div>
                                <div className="input-with-icon">
                                    <Smartphone size={20} className="input-icon" />
                                    <input
                                        type="tel"
                                        value={whatsapp}
                                        onChange={(e) => setWhatsapp(e.target.value)}
                                        placeholder="Seu WhatsApp (com DDD)"
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Enviando...' : (
                                    <>
                                        Quero ser avisado <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </form>
            </section>

            <section className="info">
                <h2>Vantagens para você!</h2>
                <ul className="info-list">
                    <li>
                        <h3>Exclusividade</h3>
                        <p>Seja um dos primeiros a criar sua loja virtual e saia na frente da concorrência.</p>
                    </li>
                    <li>
                        <h3>Descontos</h3>
                        <p>Condições únicas e exclusivas para os primeiros lojistas da Phandshop.</p>
                    </li>
                    <li>
                        <h3>Suporte prioritário VIP</h3>
                        <p>Conte com nossa equipe para tirar suas dúvidas e otimizar suas vendas desde o início.</p>
                    </li>
                    <li>
                        <h3>Participe do futuro</h3>
                        <p>Ajude a moldar a plataforma com seu feedback e tenha recursos pensados para você.</p>
                    </li>
                </ul>
            </section>

            <section className="theme-showcase">
              
                <div className="theme-image-container">
                    <Image
                        src="/vendas.png"
                        alt="Exemplo de tema de loja virtual da Phandshop"
                        width={1200}
                        height={600}
                        quality={80}
                        priority
                        className="store-theme-image"
                    />
                </div>
            </section>

            <footer className="footer">
                <div className="social-icons">
                    <a href="https://instagram.com/phandshop" target="_blank" rel="noopener noreferrer">
                        <FaInstagram className="icon" />
                    </a>
                    <a href="https://wa.me/5511949184370" target="_blank" rel="noopener noreferrer">
                        <FaWhatsapp className="icon" />
                    </a>
                </div>
                <p>© 2025 Phandshop - Todos os direitos reservados</p>
            </footer>
        </>
    );
}