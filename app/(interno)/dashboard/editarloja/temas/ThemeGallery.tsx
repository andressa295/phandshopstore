'use client';

import React, { useState, useCallback } from 'react';
import temasData from './themes.json';
import ThemeCard from './ThemeCard';
import { ThemeModal } from './ThemeModal';
import styles from './ThemeGallery.module.css'; // <-- Importa o CSS Module da Galeria

interface Tema {
  id: string;
  nome: string;
  categoria: string;
  descricao?: string;
  imagemUrl: string;
}

const temas: Tema[] = temasData as Tema[];

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

    console.log(`Aplicando tema: ${temaSelecionado.nome}, personalizar: ${!somenteAplicar}`);
    window.location.href = `/personalizar?tema=${temaSelecionado.id}&personalizar=${!somenteAplicar}`;
  }, [temaSelecionado]);

  return (
    <>
      <div className={styles.galleryGrid}> {/* Usando a classe do CSS Module */}
        {temas.map((tema: Tema) => (
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