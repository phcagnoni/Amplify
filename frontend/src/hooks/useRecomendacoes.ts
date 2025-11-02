/**
 * Hook customizado para gerenciar recomendações musicais
 * Integra com a API do backend Amplify
 */

import { useState, useEffect } from 'react';
import { recomendacoesAPI, Recomendacao } from '../services/api';

interface UseRecomendacoesOptions {
  genero?: string;
  artista?: string;
  limite?: number;
  autoLoad?: boolean;
}

interface UseRecomendacoesReturn {
  recomendacoes: Recomendacao[];
  isLoading: boolean;
  error: string | null;
  total: number;
  refetch: () => Promise<void>;
}

export function useRecomendacoes(
  options: UseRecomendacoesOptions = {}
): UseRecomendacoesReturn {
  const { genero, artista, limite = 10, autoLoad = true } = options;
  
  const [recomendacoes, setRecomendacoes] = useState<Recomendacao[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchRecomendacoes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await recomendacoesAPI.gerar({
        genero,
        artista,
        limite,
      });

      setRecomendacoes(response.recomendacoes);
      setTotal(response.total);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar recomendações';
      setError(errorMessage);
      console.error('Erro ao buscar recomendações:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoLoad) {
      fetchRecomendacoes();
    }
  }, [genero, artista, limite, autoLoad]);

  return {
    recomendacoes,
    isLoading,
    error,
    total,
    refetch: fetchRecomendacoes,
  };
}
