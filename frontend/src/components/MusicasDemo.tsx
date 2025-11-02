/**
 * Componente de exemplo que demonstra o uso da API
 * Mostra músicas com integração ao backend
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Music, Search, Loader2, AlertCircle } from 'lucide-react';
import { useMusicas } from '../hooks/useMusicas';
import { grafoAPI, spotifyAPI } from '../services/api';

export function MusicasDemo() {
  const [generoFiltro, setGeneroFiltro] = useState('');
  const [artistaFiltro, setArtistaFiltro] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState({ genero: '', artista: '' });
  
  const { musicas, isLoading, error, total, refetch } = useMusicas({
    genero: filtroAtivo.genero,
    artista: filtroAtivo.artista,
  });

  const [grafoInfo, setGrafoInfo] = useState<any>(null);
  const [importando, setImportando] = useState(false);
  const [importMessage, setImportMessage] = useState('');

  // Carrega informações do grafo
  useEffect(() => {
    loadGrafoInfo();
  }, []);

  const loadGrafoInfo = async () => {
    try {
      const info = await grafoAPI.getInfo();
      setGrafoInfo(info);
    } catch (err) {
      console.error('Erro ao carregar info do grafo:', err);
    }
  };

  const handleBuscar = () => {
    setFiltroAtivo({ genero: generoFiltro, artista: artistaFiltro });
  };

  const handleLimparFiltros = () => {
    setGeneroFiltro('');
    setArtistaFiltro('');
    setFiltroAtivo({ genero: '', artista: '' });
  };

  const handleImportarArtista = async () => {
    if (!artistaFiltro.trim()) return;
    
    setImportando(true);
    setImportMessage('');
    
    try {
      const result = await spotifyAPI.importarArtista(artistaFiltro);
      setImportMessage(`✅ ${result.message}`);
      await loadGrafoInfo();
      refetch();
    } catch (err) {
      setImportMessage(`❌ Erro: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    } finally {
      setImportando(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Informações do Grafo */}
      {grafoInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📊 Status do Grafo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{grafoInfo.vertices}</div>
                <div className="text-sm text-muted-foreground">Vértices</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{grafoInfo.arestas}</div>
                <div className="text-sm text-muted-foreground">Arestas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {grafoInfo.vertices_por_tipo?.musica || 0}
                </div>
                <div className="text-sm text-muted-foreground">Músicas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {grafoInfo.vertices_por_tipo?.artista || 0}
                </div>
                <div className="text-sm text-muted-foreground">Artistas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros de Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Buscar Músicas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Gênero</label>
                <Input
                  placeholder="Ex: Rock, Jazz, Pop..."
                  value={generoFiltro}
                  onChange={(e) => setGeneroFiltro(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Artista</label>
                <Input
                  placeholder="Ex: The Beatles, Adele..."
                  value={artistaFiltro}
                  onChange={(e) => setArtistaFiltro(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleBuscar} className="flex-1">
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
              <Button onClick={handleLimparFiltros} variant="outline">
                Limpar
              </Button>
              <Button 
                onClick={handleImportarArtista} 
                variant="secondary"
                disabled={!artistaFiltro.trim() || importando}
              >
                {importando ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Music className="w-4 h-4 mr-2" />
                )}
                Importar do Spotify
              </Button>
            </div>

            {importMessage && (
              <div className={`text-sm p-3 rounded-md ${
                importMessage.startsWith('✅') 
                  ? 'bg-green-500/10 text-green-600' 
                  : 'bg-red-500/10 text-red-600'
              }`}>
                {importMessage}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              Músicas Encontradas
            </span>
            {!isLoading && (
              <span className="text-sm font-normal text-muted-foreground">
                {total} resultado(s)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 p-4 bg-destructive/10 text-destructive rounded-md">
              <AlertCircle className="w-5 h-5" />
              <div>
                <div className="font-medium">Erro ao carregar músicas</div>
                <div className="text-sm">{error}</div>
              </div>
            </div>
          ) : musicas.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma música encontrada</p>
              <p className="text-sm mt-2">
                Tente importar artistas do Spotify ou ajustar os filtros
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {musicas.map((musica) => (
                <div
                  key={musica.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{musica.nome}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {musica.artistas.length > 0 && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Music className="w-3 h-3" />
                            {musica.artistas.join(', ')}
                          </div>
                        )}
                      </div>
                      {musica.generos.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {musica.generos.map((genero, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full"
                            >
                              {genero}
                            </span>
                          ))}
                        </div>
                      )}
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
