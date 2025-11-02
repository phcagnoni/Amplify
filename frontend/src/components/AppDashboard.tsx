import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Music, 
  Sparkles,
  Search, 
  LogOut, 
  User, 
  Play, 
  Heart,
  GitBranch,
  Activity,
  Zap,
  Globe,
  MapPin,
  Database
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import SpotifyIntegration from "./SpotifyIntegration";
import GrafoDemo from "./GrafoDemo";
import { DashboardEstatisticas } from "./DashboardEstatisticas";


interface AppDashboardProps {
  onLogout: () => void;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  year: number;
  image: string;
  connections: number;
}

interface CulturalSong {
  id: string;
  title: string;
  artist: string;
  country: string;
  genre: string;
  year: number;
  image: string;
  description: string;
  cultural_significance: string;
}

interface GraphNode {
  id: string;
  title: string;
  artist: string;
  x: number;
  y: number;
  size: number;
  color: string;
}

interface GraphEdge {
  from: string;
  to: string;
  weight: number;
}

export function AppDashboard({ onLogout }: AppDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [activeTab, setActiveTab] = useState("discover");

  const mockSongs: Song[] = [
    {
      id: "1",
      title: "Stairway to Heaven",
      artist: "Led Zeppelin",
      album: "Led Zeppelin IV",
      genre: "Rock",
      year: 1971,
      image: "https://santaportal.com.br/wp/wp-content/uploads/2021/11/Capa-Led-Zeppein-IV-foto-divulgacao.jpg",
      connections: 847
    },
    {
      id: "2",
      title: "Bohemian Rhapsody",
      artist: "Queen",
      album: "A Night at the Opera",
      genre: "Rock",
      year: 1975,
      image: "https://universalmusic.vtexassets.com/arquivos/ids/157853/bohemian-rhapsody-the-original-soundtrack-cd-queen-00602567988700-26060256798870.jpg?v=636935580412170000",
      connections: 923
    },
    {
      id: "3",
      title: "Hotel California",
      artist: "Eagles",
      album: "Hotel California",
      genre: "Rock",
      year: 1976,
      image: "https://whiplash.net/imagens_capas/eagles_capa_hotel_california.jpg",
      connections: 756
    },
    {
      id: "4",
      title: "Sweet Child O' Mine",
      artist: "Guns N' Roses",
      album: "Appetite for Destruction",
      genre: "Hard Rock",
      year: 1987,
      image: "https://i1.sndcdn.com/artworks-000186048128-yhbzo4-t500x500.jpg",
      connections: 634
    }
  ];

  const recommendations: Song[] = [
    {
      id: "r1",
      title: "Paranoid Android",
      artist: "Radiohead",
      album: "OK Computer",
      genre: "Alternative Rock",
      year: 1997,
      image: "https://upload.wikimedia.org/wikipedia/pt/2/21/Radiohead_-_Paranoid_Android_CD1.jpg",
      connections: 521
    },
    {
      id: "r2",
      title: "Close to the Edge",
      artist: "Yes",
      album: "Close to the Edge",
      genre: "Progressive Rock",
      year: 1972,
      image: "https://rockontro.org/wp-content/uploads/2014/01/close-to-the-edge_00.jpg?w=700",
      connections: 389
    },
    {
      id: "r3",
      title: "Pull Me Under",
      artist: "Dream Theater",
      album: "Images and Words",
      genre: "Progressive Metal",
      year: 1992,
      image: "https://upload.wikimedia.org/wikipedia/en/0/0f/Cover_of_the_single_Pull_me_under_from_Dream_Theater.jpeg",
      connections: 412
    }
  ];

  const culturalRecommendations: CulturalSong[] = [
    {
      id: "c1",
      title: "Águas de Março",
      artist: "Tom Jobim",
      country: "Brasil",
      genre: "Bossa Nova",
      year: 1972,
      image: "https://i.scdn.co/image/ab67616d0000b273292018d60c3e04f17656657a",
      description: "Uma das mais belas canções da MPB, repleta de poesia e natureza",
      cultural_significance: "Patrimônio musical brasileiro"
    },
    {
      id: "c2", 
      title: "Bambéro",
      artist: "Celso Piña",
      country: "México",
      genre: "Cumbia",
      year: 1996,
      image: "https://i.scdn.co/image/ab67616d0000b273235046740a24651229223475",
      description: "Fusão da cumbia tradicional com elementos modernos",
      cultural_significance: "Inovação na música latina"
    },
    {
      id: "c3",
      title: "Ashokan Farewell",
      artist: "Jay Ungar",
      country: "Estados Unidos",
      genre: "Folk Americano",
      year: 1982,
      image: "https://m.media-amazon.com/images/I/81jiFUhkaGL._UF1000,1000_QL80_.jpg",
      description: "Melodia melancólica que evoca a história americana",
      cultural_significance: "Trilha sonora da memória histórica"
    },
    {
      id: "c4",
      title: "Vole Vole",
      artist: "Goran Bregović",
      country: "Sérvia",
      genre: "Folk Balcânico",
      year: 1995,
      image: "https://m.media-amazon.com/images/I/51EHCP9RjKL._UF1000,1000_QL80_.jpg",
      description: "Ritmos intensos dos Bálcãs com influência cigana",
      cultural_significance: "Tradição musical balcânica"
    }
  ];

  const graphNodes: GraphNode[] = [
    { id: "1", title: "Stairway to Heaven", artist: "Led Zeppelin", x: 300, y: 200, size: 30, color: "#6b46c1" },
    { id: "r1", title: "Paranoid Android", artist: "Radiohead", x: 150, y: 120, size: 25, color: "#8b5cf6" },
    { id: "r2", title: "Close to the Edge", artist: "Yes", x: 450, y: 150, size: 22, color: "#a78bfa" },
    { id: "r3", title: "Pull Me Under", artist: "Dream Theater", x: 320, y: 350, size: 20, color: "#c4b5fd" },
    { id: "2", title: "Bohemian Rhapsody", artist: "Queen", x: 200, y: 300, size: 28, color: "#7c3aed" },
    { id: "3", title: "Hotel California", artist: "Eagles", x: 400, y: 280, size: 26, color: "#ddd6fe" }
  ];

  const graphEdges: GraphEdge[] = [
    { from: "1", to: "r1", weight: 0.94 },
    { from: "1", to: "r2", weight: 0.89 },
    { from: "1", to: "r3", weight: 0.87 },
    { from: "1", to: "2", weight: 0.82 },
    { from: "1", to: "3", weight: 0.78 },
    { from: "r1", to: "r2", weight: 0.75 },
    { from: "r2", to: "r3", weight: 0.71 }
  ];

  const filteredSongs = mockSongs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const GraphVisualization = () => (
    <div className="relative w-full h-96 bg-muted/10 rounded-lg border overflow-hidden">
      <svg width="100%" height="100%" className="absolute inset-0">
        {/* Renderizar arestas */}
        {graphEdges.map((edge, index) => {
          const fromNode = graphNodes.find(n => n.id === edge.from);
          const toNode = graphNodes.find(n => n.id === edge.to);
          if (!fromNode || !toNode) return null;
          
          return (
            <line
              key={index}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="#6b46c1"
              strokeWidth={Math.max(1, edge.weight * 3)}
              opacity={0.4}
            />
          );
        })}
        
        {/* Renderizar nós */}
        {graphNodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r={node.size}
              fill={node.color}
              opacity={0.8}
              className="cursor-pointer hover:opacity-100"
            />
            <text
              x={node.x}
              y={node.y - node.size - 5}
              textAnchor="middle"
              className="text-xs font-medium fill-foreground"
            >
              {node.title.length > 15 ? node.title.slice(0, 15) + "..." : node.title}
            </text>
            <text
              x={node.x}
              y={node.y - node.size - 20}
              textAnchor="middle"
              className="text-xs fill-muted-foreground"
            >
              {node.artist}
            </text>
          </g>
        ))}
      </svg>
      
      <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span>Música Selecionada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary/60 rounded-full"></div>
            <span>Recomendações</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header Compacto */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Music className="w-7 h-7 text-primary" />
                <Sparkles className="w-3 h-3 text-primary/70 absolute -top-0.5 -right-0.5" />
              </div>
              <span className="text-lg font-bold">AmpliFy</span>
              <Badge variant="secondary" className="ml-2 text-xs">Beta</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-1.5 h-8">
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Perfil</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={onLogout} className="gap-1.5 h-8">
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className="container mx-auto px-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          {/* Abas Horizontais - Uma ao Lado da Outra */}
          <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full max-w-2xl mx-auto">
            <TabsTrigger 
              value="discover" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium gap-1.5 flex-1"
            >
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Descoberta</span>
              <span className="sm:hidden">Home</span>
            </TabsTrigger>
            <TabsTrigger 
              value="cultural" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium gap-1.5 flex-1"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Cultural</span>
              <span className="sm:hidden">🌍</span>
            </TabsTrigger>
            <TabsTrigger 
              value="spotify" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium gap-1.5 flex-1"
            >
              <Music className="w-4 h-4" />
              Spotify
            </TabsTrigger>
            <TabsTrigger 
              value="api" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium gap-1.5 flex-1"
            >
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">API Demo</span>
              <span className="sm:hidden">Demo</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Aba Descoberta */}
          <TabsContent value="discover" className="space-y-4 mt-4">
            {/* Dashboard de Estatísticas */}
            <DashboardEstatisticas />
            
            {/* Grid Principal */}
            <div className="grid lg:grid-cols-3 gap-4">
              {/* Painel Esquerdo - Busca e Lista */}
              <div className="lg:col-span-2 space-y-4">
                {/* Card de Busca */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Search className="w-4 h-4" />
                      Buscar Música
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Digite o nome da música ou artista..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-9"
                      />
                    </div>
              
                    <div className="mt-3 space-y-2 max-h-[400px] overflow-y-auto pr-1">
                      {filteredSongs.map((song) => (
                        <div
                          key={song.id}
                          className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all hover:bg-muted/50 hover:shadow-sm ${
                            selectedSong?.id === song.id ? "bg-primary/10 border-primary shadow-sm" : ""
                          }`}
                          onClick={() => setSelectedSong(song)}
                        >
                          <ImageWithFallback
                            src={song.image}
                            alt={`${song.album} - ${song.artist}`}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded object-cover flex-shrink-0"
                          />
                          <div className="flex-grow min-w-0">
                            <div className="font-medium text-sm truncate">{song.title}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {song.artist} • {song.album}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-xs font-medium">{song.year}</div>
                            <div className="text-[10px] text-muted-foreground">
                              {song.connections} ×
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Grafo de Recomendações */}
                {selectedSong && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <GitBranch className="w-4 h-4" />
                        Mapa de Conexões
                      </CardTitle>
                      <CardDescription className="text-xs line-clamp-1">
                        Similaridade: "{selectedSong.title}"
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <GraphVisualization />
                      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                        <div>
                          <div className="text-base font-semibold">{selectedSong.connections}</div>
                          <div className="text-[10px] text-muted-foreground">Conexões</div>
                        </div>
                        <div>
                          <div className="text-base font-semibold">94%</div>
                          <div className="text-[10px] text-muted-foreground">Precisão</div>
                        </div>
                        <div>
                          <div className="text-base font-semibold">Rápido</div>
                          <div className="text-[10px] text-muted-foreground">Análise</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Painel Direito - Lateral */}
              <div className="space-y-4">
                {/* Música Selecionada */}
                {selectedSong && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Música Selecionada</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="relative">
                          <ImageWithFallback
                            src={selectedSong.image}
                            alt={`${selectedSong.album} - ${selectedSong.artist}`}
                            width={300}
                            height={300}
                            className="w-full aspect-square rounded-lg object-cover"
                          />
                          <Button 
                            size="sm" 
                            className="absolute bottom-2 right-2 w-9 h-9 rounded-full p-0 shadow-lg"
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-1.5">
                          <h3 className="font-semibold text-sm line-clamp-2">{selectedSong.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">{selectedSong.artist}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {selectedSong.album} • {selectedSong.year}
                          </p>
                          <Badge variant="outline" className="text-xs">{selectedSong.genre}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recomendações */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Recomendações
                      </CardTitle>
                      {selectedSong && (
                        <Badge variant="secondary" className="text-xs">Grafos</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {selectedSong ? (
                      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                        {recommendations.map((song, index) => (
                          <div 
                            key={song.id} 
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors border"
                          >
                            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {index + 1}
                            </div>
                            <ImageWithFallback
                              src={song.image}
                              alt={`${song.album} - ${song.artist}`}
                              width={32}
                              height={32}
                              className="w-8 h-8 rounded object-cover flex-shrink-0"
                            />
                            <div className="flex-grow min-w-0">
                              <div className="font-medium text-xs truncate">{song.title}</div>
                              <div className="text-[10px] text-muted-foreground truncate">{song.artist}</div>
                            </div>
                            <div className="flex items-center gap-0.5 flex-shrink-0">
                              <Button variant="ghost" size="sm" className="w-7 h-7 p-0">
                                <Play className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="w-7 h-7 p-0">
                                <Heart className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Activity className="w-10 h-10 mx-auto mb-2 opacity-50" />
                        <p className="text-xs">Selecione uma música</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Estatísticas */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Estatísticas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Descobertas</span>
                        <span className="font-semibold text-sm">0</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Tempo de Uso</span>
                  <span className="font-medium">2 min</span>
                </div>
                <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Precisão</span>
                        <span className="font-semibold text-sm">--</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Aba Cultural */}
          <TabsContent value="cultural" className="space-y-4 mt-4">
            <div className="grid lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Descoberta Cultural
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Explore músicas de todo o mundo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-3">
                      {culturalRecommendations.map((song) => (
                        <div key={song.id} className="border rounded-lg p-3 space-y-2 hover:bg-muted/30 transition-colors">
                          <div className="flex items-start gap-2">
                            <ImageWithFallback
                              src={song.image}
                              alt={`${song.genre} - ${song.country}`}
                              width={60}
                              height={60}
                              className="w-15 h-15 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex-grow min-w-0">
                              <h3 className="font-semibold text-sm line-clamp-1">{song.title}</h3>
                              <p className="text-xs text-muted-foreground line-clamp-1">{song.artist}</p>
                              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                                <span className="text-[10px] text-muted-foreground truncate">{song.country}</span>
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">{song.genre}</Badge>
                              </div>
                            </div>
                          </div>
                          <p className="text-[10px] text-muted-foreground line-clamp-2">{song.description}</p>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-medium text-primary truncate flex-1">
                              {song.cultural_significance}
                            </span>
                            <div className="flex items-center gap-0.5 flex-shrink-0">
                              <Button variant="ghost" size="sm" className="w-7 h-7 p-0">
                                <Play className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="w-7 h-7 p-0">
                                <Heart className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Regiões Musicais</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Explore tradições musicais por região geográfica
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { region: "América Latina", count: 42, color: "bg-red-100 text-red-700" },
                        { region: "África", count: 38, color: "bg-orange-100 text-orange-700" },
                        { region: "Ásia", count: 51, color: "bg-green-100 text-green-700" },
                        { region: "Europa", count: 29, color: "bg-blue-100 text-blue-700" }
                      ].map((item) => (
                        <div key={item.region} className="text-center p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                          <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${item.color}`}>
                            <Globe className="w-6 h-6" />
                          </div>
                          <div className="font-medium text-sm">{item.region}</div>
                          <div className="text-xs text-muted-foreground">{item.count} músicas</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Instrumentos Tradicionais</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { name: "Berimbau", origin: "Brasil", type: "Percussão" },
                        { name: "Sitar", origin: "Índia", type: "Cordas" },
                        { name: "Didgeridoo", origin: "Austrália", type: "Sopro" },
                        { name: "Hang Drum", origin: "Suíça", type: "Percussão" }
                      ].map((instrument, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 rounded border">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Music className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-grow">
                            <div className="font-medium text-sm">{instrument.name}</div>
                            <div className="text-xs text-muted-foreground">{instrument.origin} • {instrument.type}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sua Jornada Cultural</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Países Descobertos</span>
                        <span className="font-medium">0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Gêneros Culturais</span>
                        <span className="font-medium">0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Favoritos Culturais</span>
                        <span className="font-medium">0</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Aba Spotify */}
          <TabsContent value="spotify" className="space-y-4 mt-4">
            <SpotifyIntegration />
          </TabsContent>

          {/* Aba API Demo - PRINCIPAL PARA APRESENTAÇÃO */}
          <TabsContent value="api" className="space-y-4 mt-4">
            {/* Banner Compacto */}
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <CardTitle className="text-base flex items-center gap-2 mb-1">
                      <GitBranch className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="line-clamp-1">Sistema de Recomendação por Grafos</span>
                    </CardTitle>
                    <CardDescription className="text-xs line-clamp-2">
                      Demonstração interativa usando algoritmo de Jaccard. 
                      Clique em "Inicializar Demo" para carregar 14 músicas.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Componente de demonstração */}
            <GrafoDemo />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}