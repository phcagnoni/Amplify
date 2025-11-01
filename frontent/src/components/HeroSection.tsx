import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Play, Sparkles } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";


interface HeroSectionProps {
  onGetStarted?: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="pt-24 pb-16 px-6">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="gap-2">
                <Sparkles className="w-4 h-4" />
                Recomendações Inteligentes
              </Badge>
              <h1 className="text-4xl lg:text-6xl leading-tight">
                Descubra músicas que
                <span className="text-primary block">realmente combinam</span>
                com você
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Nosso sistema revolucionário usa teoria dos grafos e ciência de dados para 
                criar recomendações musicais verdadeiramente personalizadas, incluindo descoberta 
                cultural que conecta você com tradições musicais de todo o mundo.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-2" onClick={onGetStarted}>
                <Play className="w-5 h-5" />
                Começar agora
              </Button>
              <Button variant="outline" size="lg">
                Ver Como Funciona
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-8 pt-8 border-t">
              <div>
                <div className="text-2xl font-semibold">APIs</div>
                <div className="text-sm text-muted-foreground">Avançadas</div>
              </div>
              <div>
                <div className="text-2xl font-semibold">6 Meses</div>
                <div className="text-sm text-muted-foreground">De Desenvolvimento</div>
              </div>
              <div>
                <div className="text-2xl font-semibold">Beta</div>
                <div className="text-sm text-muted-foreground">Em Breve</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1668942697842-37332c5932fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBoZWFkcGhvbmVzJTIwdGVjaG5vbG9neSUyMG11c2ljfGVufDF8fHx8MTc1ODI0MzI2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Fones de ouvido modernos"
                width={600}
                height={400}
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <div className="text-xl font-medium">AmpliFy Engine</div>
                <div className="text-sm opacity-90">Experiência Sonora Inteligente</div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-background rounded-xl p-4 shadow-lg border">
              <div className="text-sm text-muted-foreground">Algoritmo em ação</div>
              <div className="font-semibold">Analisando padrões</div>
              <div className="text-sm text-muted-foreground">Precisão simulada</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}