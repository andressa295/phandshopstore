'use client';

import React, { useState, useCallback } from 'react';
import temasData from './themes.json';
import ThemeCard from './ThemeCard';
import dynamic from 'next/dynamic';
import styles from './ThemeGallery.module.css';

const ThemeModal = dynamic(() => import('./ThemeModal'), { ssr: false }); // <-- Força render client-only

interface Tema {
  id: string;
  nome: string;
  categoria: string;
  descricao?: string;
  imagemUrl: string;
}

const temas: Tema[] = temasData;

export default function ThemeGallery() {
  const [modalAberto, setModalAberto] = useState(false);
  const [temaSelecionado, setTemaSelecionado] = useState<Tema | null>(null);

  const abrirModal = useCallback((tema: Tema) => {
    setTemaSelecionado(tema);
    setModalAberto(true);
  }, []);

  const fecharModal = useCallback(() => {
    setModalAberto(false);
    setTemaSelecionado(null);
  }, []);

  const aplicarTema = useCallback((somenteAplicar: boolean) => {
    if (!temaSelecionado) return;
    window.location.href = `/personalizar?tema=${temaSelecionado.id}&personalizar=${!somenteAplicar}`;
  }, [temaSelecionado]);

  return (
    <>
      <div className={styles.galleryGrid}>
        {temas.map((tema) => (
          <ThemeCard key={tema.id} tema={tema} onSelecionar={abrirModal} />
        ))}
      </div>

      <ThemeModal
        isOpen={modalAberto}
        onClose={fecharModal}
        tema={temaSelecionado}
        onApply={aplicarTema}
      />
    </>
  );
}
