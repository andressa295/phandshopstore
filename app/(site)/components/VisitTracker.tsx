'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface VisitTrackerProps {
  lojaId: string; 
}

export default function VisitTracker({ lojaId }: VisitTrackerProps) {
  const supabase = createClientComponentClient();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const registerVisit = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const tipoVisitante = user ? 'autenticado' : 'anonimo';
      const caminhoPagina = window.location.pathname + window.location.search;
      const fonteReferencia = document.referrer;
      
      const visitData = {
        loja_id: lojaId,
        caminho_pagina: caminhoPagina,
        tipo_visitante: tipoVisitante,
        fonte_referencia: fonteReferencia,
      };

      try {
        const response = await fetch('/api/rastro', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(visitData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Falha ao registrar visita:', response.status, errorData);
        }
      } catch (error) {
        console.error('Erro de rede ao registrar visita:', error);
      }
    };

    if (lojaId) {
      registerVisit();
    } else {
      console.warn('VisitTracker: lojaId não fornecido. Visita não será registrada.');
    }

  }, [lojaId, supabase, isClient]); 

  return null;
}
