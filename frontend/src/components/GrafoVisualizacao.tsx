/**
 * Componente de Visualização do Grafo
 * Mostra uma representação visual simplificada das conexões
 */

import React from 'react';
import { Badge } from './ui/badge';

interface Musica {
  id: number;
  nome: string;
  artistas: string[];
  generos: string[];
}

interface Recomendacao extends Musica {
  score_similaridade: number;
}

interface GrafoVisualizacaoProps {
  musicaBase: Musica | null;
  recomendacoes: Recomendacao[];
}

export function GrafoVisualizacao({ musicaBase, recomendacoes }: GrafoVisualizacaoProps) {
  if (!musicaBase || recomendacoes.length === 0) {
    return null;
  }

  // Calcula posições em círculo
  const centerX = 250;
  const centerY = 200;
  const radius = 120;

  return (
    <div className="relative bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg p-6 overflow-hidden">
      <svg width="100%" height="400" viewBox="0 0 500 400" className="mx-auto">
        {/* Definições de gradientes e sombras */}
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </radialGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Glow do centro */}
        <circle cx={centerX} cy={centerY} r="60" fill="url(#centerGlow)" />

        {/* Linhas de conexão com recomendações */}
        {recomendacoes.map((rec, index) => {
          const angle = (index * 2 * Math.PI) / recomendacoes.length - Math.PI / 2;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          const opacity = rec.score_similaridade / 100;

          return (
            <g key={rec.id}>
              {/* Linha de conexão */}
              <line
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke="hsl(var(--primary))"
                strokeWidth={2 + opacity * 2}
                strokeOpacity={opacity * 0.6}
                strokeDasharray={opacity < 0.5 ? "5,5" : "0"}
              />
              
              {/* Círculo da recomendação */}
              <circle
                cx={x}
                cy={y}
                r={15 + opacity * 10}
                fill="hsl(var(--primary))"
                fillOpacity={0.2 + opacity * 0.3}
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                filter="url(#glow)"
              />

              {/* Label com score */}
              <g transform={`translate(${x}, ${y + 35})`}>
                <rect
                  x="-25"
                  y="-10"
                  width="50"
                  height="20"
                  rx="10"
                  fill="hsl(var(--background))"
                  fillOpacity="0.9"
                  stroke="hsl(var(--border))"
                />
                <text
                  textAnchor="middle"
                  y="4"
                  fontSize="11"
                  fontWeight="bold"
                  fill="hsl(var(--primary))"
                >
                  {rec.score_similaridade.toFixed(0)}%
                </text>
              </g>
            </g>
          );
        })}

        {/* Nó central (música base) */}
        <g>
          <circle
            cx={centerX}
            cy={centerY}
            r="30"
            fill="hsl(var(--primary))"
            stroke="hsl(var(--primary-foreground))"
            strokeWidth="3"
            filter="url(#glow)"
          />
          
          {/* Ícone de música no centro */}
          <path
            d="M 240 192 L 240 210 Q 240 215 245 215 Q 250 215 250 210 L 250 192 Z M 248 188 L 248 192 L 242 192 L 242 188 Q 242 185 245 185 Q 248 185 248 188 Z"
            fill="hsl(var(--primary-foreground))"
          />
        </g>
      </svg>

      {/* Legenda */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-primary"></div>
          <span className="text-muted-foreground">
            <strong>{musicaBase.nome}</strong> (Base)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-0.5 bg-primary/50"></div>
          <span className="text-muted-foreground">Similaridade</span>
        </div>
      </div>

      {/* Detalhes da música base */}
      <div className="mt-4 p-3 bg-background/50 rounded-lg border">
        <div className="text-sm font-medium mb-2">{musicaBase.nome}</div>
        <div className="flex gap-2 flex-wrap">
          {musicaBase.artistas.map((artista, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              🎤 {artista}
            </Badge>
          ))}
          {musicaBase.generos.map((genero, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              🎵 {genero}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GrafoVisualizacao;
