'use client';

import { useEffect } from 'react';

interface VisitTrackerProps {
  lojaId: string; // O ID da loja que está sendo visitada
}

export default function VisitTracker({ lojaId }: VisitTrackerProps) {
  useEffect(() => {
    const registerVisit = async () => {
      if (!lojaId) {
        console.warn('VisitTracker: lojaId não fornecido. Visita não será registrada.');
        return;
      }

      const data = {
        lojaId: lojaId,
        pagina: window.location.pathname + window.location.search, // Caminho completo da URL
        origem: document.referrer, // URL da página de onde o visitante veio
      };

      try {
        const response = await fetch('/api/rastro', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Falha ao registrar visita:', response.status, errorData);
        } else {
          // console.log('Visita registrada com sucesso para a loja:', lojaId);
        }
      } catch (error) {
        console.error('Erro de rede ao registrar visita:', error);
      }
    };

    // Chama a função para registrar a visita quando o componente é montado
    registerVisit();

    // Opcional: Você pode adicionar um listener para 'popstate' para rastrear navegações SPA
    // Mas para pageviews simples, o useEffect no layout já é suficiente para a primeira carga.
    // Se a navegação interna da loja for client-side (sem recarregar a página),
    // você precisaria de um listener mais sofisticado ou usar o router do Next.js.
    // Por enquanto, vamos focar na carga inicial da página.

  }, [lojaId]); // Dependência: só roda se o lojaId mudar (o que não deve acontecer aqui)

  // Este componente não renderiza nada visível, apenas executa o efeito colateral
  return null;
}
