/**
 * Componente de Dashboard com Estatísticas em Tempo Real
 * Mostra métricas do sistema de grafos
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  GitBranch, Activity, Music, Users, Layers, TrendingUp, Zap, Database
} from 'lucide-react';

interface GrafoStats {
  vertices: number;
  arestas: number;
  vertices_por_tipo: {
    musica?: number;
    artista?: number;
    genero?: number;
  };
}

export function DashboardEstatisticas() {
  const [stats, setStats] = useState<GrafoStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarStats = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/grafo/info');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarStats();
    const interval = setInterval(carregarStats, 5000); // Atualiza a cada 5s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-6">
              <div className="h-20 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const musicas = stats?.vertices_por_tipo?.musica || 0;
  const artistas = stats?.vertices_por_tipo?.artista || 0;
  const generos = stats?.vertices_por_tipo?.genero || 0;
  const vertices = stats?.vertices || 0;
  const arestas = stats?.arestas || 0;

  // Calcula métricas derivadas
  const densidade = vertices > 0 ? ((arestas * 2) / (vertices * (vertices - 1)) * 100) : 0;
  const grauMedio = vertices > 0 ? (arestas * 2 / vertices) : 0;

  const statsData = [
    {
      titulo: 'Vértices Totais',
      valor: vertices.toLocaleString(),
      descricao: `${musicas} músicas + ${artistas} artistas + ${generos} gêneros`,
      icone: Database,
      cor: 'text-blue-500',
      bgCor: 'bg-blue-500/10'
    },
    {
      titulo: 'Conexões (Arestas)',
      valor: arestas.toLocaleString(),
      descricao: `Grau médio: ${grauMedio.toFixed(1)}`,
      icone: Activity,
      cor: 'text-green-500',
      bgCor: 'bg-green-500/10'
    },
    {
      titulo: 'Músicas no Grafo',
      valor: musicas.toLocaleString(),
      descricao: `${artistas} artistas conectados`,
      icone: Music,
      cor: 'text-purple-500',
      bgCor: 'bg-purple-500/10'
    },
    {
      titulo: 'Densidade do Grafo',
      valor: `${densidade.toFixed(1)}%`,
      descricao: densidade > 30 ? 'Bem conectado' : 'Esparsidade média',
      icone: TrendingUp,
      cor: 'text-orange-500',
      bgCor: 'bg-orange-500/10'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Visão Geral do Sistema</h3>
          <p className="text-sm text-muted-foreground">Métricas em tempo real do grafo musical</p>
        </div>
        <Badge variant="outline" className="gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Ativo
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => {
          const Icon = stat.icone;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.titulo}
                    </p>
                    <p className="text-3xl font-bold">{stat.valor}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.descricao}
                    </p>
                  </div>
                  <div className={`${stat.bgCor} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.cor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {vertices === 0 && (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center py-8">
            <GitBranch className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-2">
              O grafo está vazio
            </p>
            <p className="text-sm text-muted-foreground">
              Use a aba "API Demo" para inicializar com dados de demonstração
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default DashboardEstatisticas;
