import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Search, Share, Sparkles, TrendingUp } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Análise Musical",
      description: "Analisamos características profundas das músicas: ritmo, harmonia, instrumentação, energia e muito mais."
    },
    {
      number: "02", 
      icon: Share,
      title: "Criação do Grafo",
      description: "Construímos uma rede complexa conectando músicas com similaridades, criando um mapa musical inteligente."
    },
    {
      number: "03",
      icon: Sparkles,
      title: "Personalização",
      description: "O sistema aprende suas preferências e navega pelo grafo para encontrar as melhores recomendações."
    },
    {
      number: "04",
      icon: TrendingUp,
      title: "Evolução Contínua",
      description: "Cada interação melhora o algoritmo, tornando as próximas recomendações ainda mais precisas."
    }
  ];

  return (
    <section id="como-funciona" className="py-16 px-6 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="secondary" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Processo Inteligente
          </Badge>
          <h2 className="text-3xl lg:text-4xl">
            Como Funciona
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Entenda o processo por trás das recomendações mais inteligentes 
            e personalizadas do mercado musical.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="relative text-center">
              <CardContent className="pt-8 pb-6">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                    {step.number}
                  </div>
                </div>
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full">
            <TrendingUp className="w-4 h-4" />
            <span>Resultado: Descobertas musicais mais relevantes e satisfatórias</span>
          </div>
        </div>
      </div>
    </section>
  );
}