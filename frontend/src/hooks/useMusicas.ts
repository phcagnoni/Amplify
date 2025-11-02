/**
 * Hook customizado para gerenciar músicas
 * Integra com a API do backend Amplify
 */

import { useState, useEffect } from 'react';
import { musicasAPI, Musica } from '../services/api';

interface UseMusicasOptions {
  genero?: string;
  artista?: string;
  autoLoad?: boolean;
}

interface UseMusicasReturn {
  musicas: Musica[];
  isLoading: boolean;
  error: string | null;
  total: number;
  refetch: () => Promise<void>;
}

export function useMusicas(
  options: UseMusicasOptions = {}
): UseMusicasReturn {
  const { genero, artista, autoLoad = true } = options;
  
  const [musicas, setMusicas] = useState<Musica[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchMusicas = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await musicasAPI.listar({ genero, artista });
      setMusicas(response.musicas);
      setTotal(response.total);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar músicas';
      setError(errorMessage);
      console.error('Erro ao buscar músicas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoLoad) {
      fetchMusicas();
    }
  }, [genero, artista, autoLoad]);

  return {
    musicas,
    isLoading,
    error,
    total,
    refetch: fetchMusicas,
  };
}
