import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Play, Heart, Share2, MoreHorizontal } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function DemoSection() {
  const mockSongs = [
    {
      title: "Bohemian Rhapsody",
      artist: "Queen",
      similarity: "94%",
      genre: "Rock Progressivo",
      image: "https://upload.wikimedia.org/wikipedia/pt/a/a3/Queen_-_2018_-_Bohemian_Rhapsody.jpg"
    },
    {
      title: "Paranoid Android", 
      artist: "Radiohead",
      similarity: "91%",
      genre: "Rock Alternativo",
      image: "https://upload.wikimedia.org/wikipedia/pt/2/21/Radiohead_-_Paranoid_Android_CD1.jpg"
    },
    {
      title: "Close to the Edge",
      artist: "Yes", 
      similarity: "89%",
      genre: "Rock Progressivo",
      image: "https://acdn-us.mitiendanube.com/stores/001/382/501/products/yes-close1-5236a63f69341b933d16135024632036-1024-1024.jpg"
    }
  ];

  return (
    <section id="demo" className="py-16 px-6">
      <div className="container mx-auto">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="secondary" className="gap-2">
            <Play className="w-4 h-4" />
            Demonstração
          </Badge>
          <h2 className="text-3xl lg:text-4xl">
            Veja em Ação
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simulação baseada na música "Stairway to Heaven - Led Zeppelin". 
            Veja como nosso algoritmo funcionará quando estiver pronto.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 relative">
                <ImageWithFallback
                  src="https://santaportal.com.br/wp/wp-content/uploads/2021/11/Capa-Led-Zeppein-IV-foto-divulgacao.jpg"
                  alt="Led Zeppelin IV - Stairway to Heaven"
                  width={120}
                  height={120}
                  className="w-30 h-30 rounded-lg object-cover mx-auto"
                />
                <Button 
                  size="sm" 
                  className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full p-0"
                >
                  <Play className="w-5 h-5" />
                </Button>
              </div>
              <CardTitle className="text-2xl">Música Base</CardTitle>
              <div className="space-y-2">
                <div className="font-semibold">Stairway to Heaven</div>
                <div className="text-muted-foreground">Led Zeppelin • Rock Progressivo</div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid gap-6">
            <h3 className="text-xl text-center">Simulação de Recomendações</h3>
            {mockSongs.map((song, index) => (
              <Card key={index} className="transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="relative flex-shrink-0">
                      <ImageWithFallback
                        src={song.image}
                        alt={`Album ${song.title}`}
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <Button size="sm" className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0">
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex-grow space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{song.title}</h4>
                          <p className="text-muted-foreground">{song.artist}</p>
                        </div>
                        <Badge variant="secondary" className="bg-primary/15 text-primary border-primary/30">
                          {song.similarity} estimado
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{song.genre}</Badge>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button size="lg" className="gap-2">
              <Play className="w-5 h-5" />
              Aguarde o Lançamento
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}