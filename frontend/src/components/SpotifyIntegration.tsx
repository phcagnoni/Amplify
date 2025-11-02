/**
 * Componente de Integração com Spotify - Versão Completa
 * Inclui: Busca de artistas, importação para grafo, visualização e estatísticas
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Music, Search, Download, CheckCircle, XCircle, AlertCircle, 
  GitBranch, Activity, TrendingUp, Users, Play, Heart
} from 'lucide-react';

interface SpotifyStatus {
  configurado: boolean;
  conectado: boolean;
  mensagem: string;
}

interface Artista {
  id: string;
  nome: string;
  generos: string[];
  popularidade: number;
  imagem: string | null;
}

interface GrafoInfo {
  vertices: number;
  arestas: number;
  vertices_por_tipo: {
    musica?: number;
    artista?: number;
    genero?: number;
  };
}

interface Musica {
  id: number;
  nome: string;
  artistas: string[];
  generos: string[];
}

const SpotifyIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('importar');
  const [status, setStatus] = useState<SpotifyStatus | null>(null);
  const [busca, setBusca] = useState('');
  const [artistas, setArtistas] = useState<Artista[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [importando, setImportando] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  const [grafoInfo, setGrafoInfo] = useState<GrafoInfo | null>(null);
  const [musicasGrafo, setMusicasGrafo] = useState<Musica[]>([]);

  useEffect(() => {
    verificarStatus();
    carregarInfoGrafo();
  }, []);

  const verificarStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/spotify/status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Erro ao verificar status do Spotify:', error);
      setStatus({
        configurado: false,
        conectado: false,
        mensagem: 'Erro ao conectar com o backend'
      });
    }
  };

  const carregarInfoGrafo = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/grafo/info');
      const data = await response.json();
      setGrafoInfo(data);
    } catch (error) {
      console.error('Erro ao carregar informações do grafo:', error);
    }
  };

  const carregarMusicas = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/musicas');
      const data = await response.json();
      setMusicasGrafo(data.musicas);
    } catch (error) {
      console.error('Erro ao carregar músicas:', error);
    }
  };

  const buscarArtista = async () => {
    if (!busca.trim()) return;

    setCarregando(true);
    setMensagem(null);
    
    try {
      const response = await fetch(
        `http://localhost:8000/api/spotify/buscar-artista?nome=${encodeURIComponent(busca)}`
      );
      
      if (!response.ok) {
        throw new Error('Erro ao buscar artista');
      }
      
      const data = await response.json();
      setArtistas(data.artistas);
      
      if (data.artistas.length === 0) {
        setMensagem({ tipo: 'error', texto: 'Nenhum artista encontrado' });
      }
    } catch (error) {
      setMensagem({ tipo: 'error', texto: 'Erro ao buscar artista no Spotify' });
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  const importarArtista = async (nomeArtista: string) => {
    setImportando(nomeArtista);
    setMensagem(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/spotify/importar-artista', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artista_nome: nomeArtista })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erro ao importar artista');
      }
      
      const data = await response.json();
      setMensagem({
        tipo: 'success',
        texto: `${nomeArtista} importado! ${data.detalhes.novos_vertices} novos vértices adicionados ao grafo.`
      });
      
      // Atualiza informações do grafo
      await carregarInfoGrafo();
      await carregarMusicas();
      
    } catch (error: any) {
      setMensagem({ tipo: 'error', texto: error.message || 'Erro ao importar artista' });
      console.error(error);
    } finally {
      setImportando(null);
    }
  };

  // Renderização do status do Spotify
  const renderStatusCard = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="w-5 h-5" />
          Status da Integração Spotify
        </CardTitle>
      </CardHeader>
      <CardContent>
        {status ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Configurado:</span>
              <div className="flex items-center gap-2">
                {status.configurado ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Sim</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium">Não</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Conectado:</span>
              <div className="flex items-center gap-2">
                {status.conectado ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Sim</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium">Não</span>
                  </>
                )}
              </div>
            </div>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{status.mensagem}</AlertDescription>
            </Alert>
            {!status.configurado && (
              <div className="text-xs text-muted-foreground space-y-1 mt-2">
                <p>Para configurar o Spotify:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Copie <code>backend/.env.example</code> para <code>backend/.env</code></li>
                  <li>Obtenha credenciais em <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-primary underline">Spotify Dashboard</a></li>
                  <li>Edite o arquivo <code>.env</code> com suas credenciais</li>
                  <li>Reinicie o backend</li>
                </ol>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Carregando status...</p>
        )}
      </CardContent>
    </Card>
  );

  // Renderização das estatísticas do grafo
  const renderGrafoStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <GitBranch className="w-8 h-8 mx-auto text-primary" />
            <div className="text-2xl font-bold">{grafoInfo?.vertices || 0}</div>
            <div className="text-xs text-muted-foreground">Total de Vértices</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <Activity className="w-8 h-8 mx-auto text-blue-500" />
            <div className="text-2xl font-bold">{grafoInfo?.arestas || 0}</div>
            <div className="text-xs text-muted-foreground">Conexões</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <Music className="w-8 h-8 mx-auto text-green-500" />
            <div className="text-2xl font-bold">{grafoInfo?.vertices_por_tipo?.musica || 0}</div>
            <div className="text-xs text-muted-foreground">Músicas</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <Users className="w-8 h-8 mx-auto text-purple-500" />
            <div className="text-2xl font-bold">{grafoInfo?.vertices_por_tipo?.artista || 0}</div>
            <div className="text-xs text-muted-foreground">Artistas</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Status e Estatísticas */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          {renderStatusCard()}
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas do Grafo</CardTitle>
              <CardDescription>Visualização em tempo real da estrutura de dados</CardDescription>
            </CardHeader>
            <CardContent>
              {renderGrafoStats()}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mensagens */}
      {mensagem && (
        <Alert variant={mensagem.tipo === 'error' ? 'destructive' : 'default'}>
          {mensagem.tipo === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>{mensagem.texto}</AlertDescription>
        </Alert>
      )}

      {/* Tabs de Funcionalidades */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="importar">Importar do Spotify</TabsTrigger>
          <TabsTrigger value="visualizar">Visualizar Grafo</TabsTrigger>
          <TabsTrigger value="musicas">Músicas Importadas</TabsTrigger>
        </TabsList>

        {/* Tab: Importar do Spotify */}
        <TabsContent value="importar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Buscar e Importar Artistas</CardTitle>
              <CardDescription>
                Busque artistas no Spotify e importe suas músicas para o grafo de recomendações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite o nome do artista..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && buscarArtista()}
                  disabled={!status?.conectado}
                />
                <Button 
                  onClick={buscarArtista} 
                  disabled={carregando || !status?.conectado}
                  className="gap-2"
                >
                  <Search className="w-4 h-4" />
                  Buscar
                </Button>
              </div>

              {/* Resultados da Busca */}
              {artistas.length > 0 && (
                <div className="space-y-3 mt-6">
                  <h3 className="font-semibold">Resultados da Busca</h3>
                  {artistas.map((artista) => (
                    <Card key={artista.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                          {artista.imagem && (
                            <img 
                              src={artista.imagem} 
                              alt={artista.nome}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-grow space-y-1">
                            <h4 className="font-semibold">{artista.nome}</h4>
                            <div className="flex gap-1 flex-wrap">
                              {artista.generos.slice(0, 3).map((genero, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {genero}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <TrendingUp className="w-3 h-3" />
                              Popularidade: {artista.popularidade}%
                            </div>
                          </div>
                          <Button
                            onClick={() => importarArtista(artista.nome)}
                            disabled={importando === artista.nome}
                            className="gap-2"
                          >
                            <Download className="w-4 h-4" />
                            {importando === artista.nome ? 'Importando...' : 'Importar'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Visualizar Grafo */}
        <TabsContent value="visualizar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visualização do Grafo Musical</CardTitle>
              <CardDescription>
                Estrutura de conexões entre músicas, artistas e gêneros
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative bg-muted/30 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
                {grafoInfo && grafoInfo.vertices > 0 ? (
                  <div className="text-center space-y-4">
                    <GitBranch className="w-16 h-16 mx-auto text-primary" />
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">Grafo Ativo</h3>
                      <p className="text-muted-foreground max-w-md">
                        O grafo contém {grafoInfo.vertices} vértices conectados por {grafoInfo.arestas} arestas,
                        formando uma rede complexa de relações musicais.
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-6 max-w-md mx-auto">
                      <div className="bg-background rounded-lg p-3">
                        <div className="text-lg font-bold text-green-600">
                          {grafoInfo.vertices_por_tipo?.musica || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">Músicas</div>
                      </div>
                      <div className="bg-background rounded-lg p-3">
                        <div className="text-lg font-bold text-purple-600">
                          {grafoInfo.vertices_por_tipo?.artista || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">Artistas</div>
                      </div>
                      <div className="bg-background rounded-lg p-3">
                        <div className="text-lg font-bold text-blue-600">
                          {grafoInfo.vertices_por_tipo?.genero || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">Gêneros</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4 text-muted-foreground">
                    <GitBranch className="w-16 h-16 mx-auto opacity-50" />
                    <p>Nenhum dado no grafo. Importe artistas do Spotify para começar!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Informações sobre Grafos */}
          <Card>
            <CardHeader>
              <CardTitle>O que é um Grafo Musical?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Um grafo é uma estrutura de dados composta por <strong>vértices</strong> (nós) e <strong>arestas</strong> (conexões).
              </p>
              <p>
                No Amplify, cada música, artista e gênero é um vértice. As conexões entre eles formam arestas,
                criando uma rede que permite encontrar músicas similares através de algoritmos de similaridade.
              </p>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span><strong>Vértice Verde:</strong> Músicas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span><strong>Vértice Roxo:</strong> Artistas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span><strong>Vértice Azul:</strong> Gêneros</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Músicas Importadas */}
        <TabsContent value="musicas" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Músicas no Grafo</CardTitle>
                  <CardDescription>
                    {musicasGrafo.length} músicas importadas do Spotify
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  onClick={carregarMusicas}
                  className="gap-2"
                >
                  <Activity className="w-4 h-4" />
                  Atualizar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {musicasGrafo.length > 0 ? (
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {musicasGrafo.map((musica) => (
                    <div 
                      key={musica.id}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <Music className="w-8 h-8 text-primary" />
                      <div className="flex-grow min-w-0">
                        <div className="font-medium truncate">{musica.nome}</div>
                        <div className="text-sm text-muted-foreground truncate">
                          {musica.artistas.join(', ')}
                        </div>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {musica.generos.map((genero, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {genero}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma música importada ainda.</p>
                  <p className="text-sm mt-2">Use a aba "Importar do Spotify" para adicionar músicas.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SpotifyIntegration;
