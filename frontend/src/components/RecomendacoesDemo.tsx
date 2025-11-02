/**
 * Componente de exemplo mostrando integração com a API
 * Exibe recomendações musicais do backend
 */

import { useState } from 'react';
import { useRecomendacoes } from '../hooks/useRecomendacoes';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Music, Loader2, RefreshCw, Filter } from 'lucide-react';

export function RecomendacoesDemo() {
  const [generoFiltro, setGeneroFiltro] = useState('');
  const [artistaFiltro, setArtistaFiltro] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState(false);

  const { recomendacoes, isLoading, error, total, refetch } = useRecomendacoes({
    genero: filtroAtivo ? generoFiltro : undefined,
    artista: filtroAtivo ? artistaFiltro : undefined,
    limite: 10,
    autoLoad: true,
  });

  const handleAplicarFiltro = () => {
    setFiltroAtivo(true);
    refetch();
  };

  const handleLimparFiltro = () => {
    setGeneroFiltro('');
    setArtistaFiltro('');
    setFiltroAtivo(false);
    refetch();
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros de Recomendação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="genero">Gênero</Label>
              <Input
                id="genero"
                placeholder="Ex: Rock, Jazz, Pop..."
                value={generoFiltro}
                onChange={(e) => setGeneroFiltro(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="artista">Artista</Label>
              <Input
                id="artista"
                placeholder="Ex: The Beatles, Queen..."
                value={artistaFiltro}
                onChange={(e) => setArtistaFiltro(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleAplicarFiltro} disabled={isLoading}>
              Aplicar Filtros
            </Button>
            <Button 
              variant="outline" 
              onClick={handleLimparFiltro}
              disabled={isLoading}
            >
              Limpar
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={refetch}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              Recomendações ({total})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
              <p className="font-semibold">Erro ao carregar recomendações:</p>
              <p className="text-sm mt-1">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refetch}
                className="mt-3"
              >
                Tentar Novamente
              </Button>
            </div>
          )}

          {!isLoading && !error && recomendacoes.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Music className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma recomendação encontrada.</p>
              <p className="text-sm mt-1">
                Tente ajustar os filtros ou adicionar mais músicas ao sistema.
              </p>
            </div>
          )}

          {!isLoading && !error && recomendacoes.length > 0 && (
            <div className="space-y-3">
              {recomendacoes.map((recomendacao) => (
                <div
                  key={recomendacao.id}
                  className="flex items-start gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Music className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">
                      {recomendacao.nome}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {recomendacao.artistas.join(', ') || 'Artista desconhecido'}
                    </p>
                    {recomendacao.generos.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {recomendacao.generos.map((genero, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                          >
                            {genero}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <div className="text-sm font-semibold text-primary">
                      {Math.round(recomendacao.score * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      match
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
