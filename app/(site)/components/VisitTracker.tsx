'use client';

import { useEffect } from 'react';

interface VisitTrackerProps {
  lojaId: string; 
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
        pagina: window.location.pathname + window.location.search,
        origem: document.referrer, 
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
        }
      } catch (error) {
        console.error('Erro de rede ao registrar visita:', error);
      }
    };

    registerVisit();

    }, [lojaId]); 

  return null;
}
