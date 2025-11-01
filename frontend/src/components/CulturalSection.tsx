import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Globe, MapPin, Music } from "lucide-react";

interface CulturalSectionProps {
  onGetStarted?: () => void;
}

export function CulturalSection({ onGetStarted }: CulturalSectionProps) {
  const culturalSamples = [
    {
      title: "Bossa Nova",
      country: "Brasil",
      description: "Suave e melódica, representa a sofisticação musical brasileira"
    },
    {
      title: "Folk Balcânico",
      country: "Sérvia", 
      description: "Ritmos intensos e melodias emotivas dos Bálcãs"
    },
    {
      title: "Cumbia Moderna",
      country: "México",
      description: "Fusão da cumbia tradicional com elementos contemporâneos"
    }
  ];

  return (
    <section className="py-16 px-6 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="secondary" className="gap-2">
            <Globe className="w-4 h-4" />
            Descoberta Cultural
          </Badge>
          <h2 className="text-3xl lg:text-4xl">
            Explore a
            <span className="text-primary block">Riqueza Musical Mundial</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            O AmpliFy conecta você com tradições musicais de todo o mundo que 
            complementam suas preferências, expandindo seus horizontes culturais.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {culturalSamples.map((sample, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="gap-1">
                    <MapPin className="w-3 h-3" />
                    {sample.country}
                  </Badge>
                </div>
                <h3 className="text-xl font-semibold mb-2">{sample.title}</h3>
                <p className="text-muted-foreground text-sm">{sample.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-primary/5 rounded-2xl p-8 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Globe className="w-6 h-6 text-primary" />
              <Music className="w-6 h-6 text-primary" />
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold">
              Mais de 100 Tradições Musicais
            </h3>
            <p className="text-muted-foreground">
              Desde a música clássica indiana até o jazz afro-americano, conectamos 
              você com a diversidade musical mundial respeitando suas preferências.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[
                { region: "América Latina", count: "42+" },
                { region: "África", count: "38+" },
                { region: "Ásia", count: "51+" },
                { region: "Europa", count: "29+" }
              ].map((stat) => (
                <div key={stat.region} className="space-y-1">
                  <div className="text-2xl font-bold text-primary">{stat.count}</div>
                  <div className="text-sm text-muted-foreground">{stat.region}</div>
                </div>
              ))}
            </div>
            <Button 
              size="lg" 
              className="gap-2 mt-6" 
              onClick={onGetStarted}
            >
              <Globe className="w-5 h-5" />
              Iniciar Jornada Cultural
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}