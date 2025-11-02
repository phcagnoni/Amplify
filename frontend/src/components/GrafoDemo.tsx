/**
 * Componente de Demonstração Interativa do Grafo
 * Carrega dados reais do backend e mostra recomendações baseadas em similaridade
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Music, Play, GitBranch, Activity, Zap, RefreshCw, CheckCircle, AlertCircle
} from 'lucide-react';
import { GrafoVisualizacao } from './GrafoVisualizacao';

interface Musica {
  id: number;
  nome: string;
  artistas: string[];
  generos: string[];
}

interface Recomendacao extends Musica {
  score_similaridade: number;
}

interface GrafoStats {
  vertices: number;
  arestas: number;
  artistas: number;
  generos: number;
  musicas: number;
}

export function GrafoDemo() {
  const [stats, setStats] = useState<GrafoStats | null>(null);
  const [musicas, setMusicas] = useState<Musica[]>([]);
  const [musicaSelecionada, setMusicaSelecionada] = useState<string | null>(null);
  const [recomendacoes, setRecomendacoes] = useState<Recomendacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{tipo: 'success' | 'error', texto: string} | null>(null);

  // Inicializa dados de demonstração
  const inicializarDemo = async () => {
    setLoading(true);
    setMensagem(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/demo/inicializar', {
        method: 'POST'
      });
      
      if (!response.ok) throw new Error('Erro ao inicializar demonstração');
      
      const data = await response.json();
      setMensagem({
        tipo: 'success',
        texto: `${data.detalhes.musicas} músicas, ${data.detalhes.artistas} artistas e ${data.detalhes.generos} gêneros carregados!`
      });
      
      await carregarDados();
    } catch (error) {
      setMensagem({ tipo: 'error', texto: 'Erro ao inicializar dados de demonstração' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Carrega estatísticas e músicas do grafo
  const carregarDados = async () => {
    try {
      // Carrega estatísticas
      const statsRes = await fetch('http://localhost:8000/api/grafo/info');
      const statsData = await statsRes.json();
      
      setStats({
        vertices: statsData.vertices || 0,
        arestas: statsData.arestas || 0,
        musicas: statsData.vertices_por_tipo?.musica || 0,
        artistas: statsData.vertices_por_tipo?.artista || 0,
        generos: statsData.vertices_por_tipo?.genero || 0
      });

      // Carrega músicas
      const musicasRes = await fetch('http://localhost:8000/api/musicas');
      const musicasData = await musicasRes.json();
      setMusicas(musicasData.musicas || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  // Busca recomendações para uma música
  const buscarRecomendacoes = async (nomeMusica: string) => {
    setMusicaSelecionada(nomeMusica);
    setLoading(true);
    setRecomendacoes([]);
    
    try {
      const response = await fetch(
        `http://localhost:8000/api/recomendacoes/${encodeURIComponent(nomeMusica)}?limite=5`
      );
      
      if (!response.ok) throw new Error('Erro ao buscar recomendações');
      
      const data = await response.json();
      setRecomendacoes(data.recomendacoes || []);
    } catch (error) {
      console.error('Erro ao buscar recomendações:', error);
      setMensagem({ tipo: 'error', texto: 'Erro ao gerar recomendações' });
    } finally {
      setLoading(false);
    }
  };

  // Carrega dados ao montar
  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <div className="space-y-4">
      {/* Cabeçalho Compacto com Botão */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base flex items-center gap-2 mb-1">
                <GitBranch className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">Demo do Grafo Musical</span>
              </CardTitle>
              <CardDescription className="text-xs line-clamp-1">
                Algoritmo de Jaccard
              </CardDescription>
            </div>
            <Button 
              onClick={inicializarDemo} 
              disabled={loading}
              size="sm"
              className="gap-1.5 h-9 flex-shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Inicializar Demo</span>
              <span className="sm:hidden">Iniciar</span>
            </Button>
          </div>
        </CardHeader>
      </Card>

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

      {/* Estatísticas do Grafo - Compactas */}
      {stats && (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-4 pb-3">
              <div className="text-center space-y-1">
                <GitBranch className="w-6 h-6 mx-auto text-primary" />
                <div className="text-xl font-bold">{stats.vertices}</div>
                <div className="text-[10px] text-muted-foreground">Vértices</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-4 pb-3">
              <div className="text-center space-y-1">
                <Activity className="w-6 h-6 mx-auto text-blue-500" />
                <div className="text-xl font-bold">{stats.arestas}</div>
                <div className="text-[10px] text-muted-foreground">Arestas</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-4 pb-3">
              <div className="text-center space-y-1">
                <Music className="w-6 h-6 mx-auto text-green-500" />
                <div className="text-xl font-bold">{stats.musicas}</div>
                <div className="text-[10px] text-muted-foreground">Músicas</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-4 pb-3">
              <div className="text-center space-y-1">
                <Play className="w-6 h-6 mx-auto text-purple-500" />
                <div className="text-xl font-bold">{stats.artistas}</div>
                <div className="text-[10px] text-muted-foreground">Artistas</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-4 pb-3">
              <div className="text-center space-y-1">
                <Zap className="w-6 h-6 mx-auto text-orange-500" />
                <div className="text-xl font-bold">{stats.generos}</div>
                <div className="text-[10px] text-muted-foreground">Gêneros</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Visualização do Grafo */}
      {musicaSelecionada && recomendacoes.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              Mapa de Similaridade
            </CardTitle>
            <CardDescription className="text-xs line-clamp-1">
              Conexões entre músicas no grafo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GrafoVisualizacao
              musicaBase={musicas.find(m => m.nome === musicaSelecionada) || null}
              recomendacoes={recomendacoes}
            />
          </CardContent>
        </Card>
      )}

      {/* Grid Principal - Compacto */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Lista de Músicas */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Músicas no Grafo</CardTitle>
            <CardDescription className="text-xs line-clamp-1">
              Clique para ver recomendações
            </CardDescription>
          </CardHeader>
          <CardContent>
            {musicas.length > 0 ? (
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {musicas.map((musica) => (
                  <div
                    key={musica.id}
                    onClick={() => buscarRecomendacoes(musica.nome)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-all hover:bg-muted/50 hover:shadow-sm ${
                      musicaSelecionada === musica.nome ? 'bg-primary/10 border-primary shadow-sm' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Music className="w-4 h-4 text-primary flex-shrink-0" />
                      <div className="flex-grow min-w-0">
                        <div className="font-medium text-sm truncate">{musica.nome}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {musica.artistas.join(', ')}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {musica.generos.map((genero, idx) => (
                        <Badge key={idx} variant="outline" className="text-[10px] px-1.5 py-0">
                          {genero}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma música no grafo.</p>
                <p className="text-sm mt-2">Clique em "Inicializar Demo" para carregar dados.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recomendações - Compacto */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <CardTitle className="text-base flex items-center gap-2 flex-1 min-w-0">
                <Zap className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">Recomendações</span>
              </CardTitle>
              {musicaSelecionada && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 flex-shrink-0 max-w-[150px] truncate">
                  {musicaSelecionada}
                </Badge>
              )}
            </div>
            <CardDescription className="text-xs line-clamp-1">
              Jaccard Similaridade
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-6 h-6 mx-auto animate-spin text-primary mb-2" />
                <p className="text-xs text-muted-foreground">Calculando...</p>
              </div>
            ) : recomendacoes.length > 0 ? (
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {recomendacoes.map((rec, index) => (
                  <div key={rec.id} className="p-2.5 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        #{index + 1}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="font-medium text-sm truncate">{rec.nome}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {rec.artistas.join(', ')}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-base font-bold text-primary">
                          {(rec.score_similaridade * 100).toFixed(0)}%
                        </div>
                        <div className="text-[10px] text-muted-foreground">Score</div>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {rec.generos.map((genero, idx) => (
                        <Badge key={idx} variant="outline" className="text-[10px] px-1.5 py-0">
                          {genero}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Zap className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-xs">Selecione uma música</p>
                <p className="text-[10px] mt-1">
                  Análise de similaridade via grafo
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Explicação do Algoritmo - Compacta */}
      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Como Funciona?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-muted-foreground">
          <p>
            O sistema usa o <strong className="text-foreground">Coeficiente de Jaccard</strong> para calcular similaridade:
          </p>
          <div className="bg-muted/50 rounded-lg p-3 font-mono text-[10px] text-center">
            similaridade(A, B) = |A ∩ B| / |A ∪ B|
          </div>
          <p className="text-[10px]">
            Compara conexões (artistas e gêneros). Mais em comum = maior similaridade!
          </p>
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full flex-shrink-0"></div>
              <span className="text-[10px] truncate"><strong>Verde:</strong> Músicas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-purple-500 rounded-full flex-shrink-0"></div>
              <span className="text-[10px] truncate"><strong>Roxo:</strong> Artistas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0"></div>
              <span className="text-[10px] truncate"><strong>Azul:</strong> Gêneros</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default GrafoDemo;
