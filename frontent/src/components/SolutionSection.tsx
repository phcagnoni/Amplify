import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Network, Brain, Zap, Users } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function SolutionSection() {
  const features = [
    {
      icon: Network,
      title: "Teoria dos Grafos",
      description: "Mapeamos conexões complexas entre músicas, criando uma rede inteligente de similaridades."
    },
    {
      icon: Brain,
      title: "Ciência de Dados",
      description: "Algoritmos avançados analisam características musicais profundas para recomendações precisas."
    },
    {
      icon: Zap,
      title: "Personalização Real",
      description: "Sistema que aprende e evolui com suas preferências para sugestões cada vez melhores."
    },
    {
      icon: Users,
      title: "Descoberta Cultural",
      description: "Explore novos horizontes musicais respeitando seu gosto pessoal e expandindo repertório."
    }
  ];

  return (
    <section id="tecnologia" className="py-16 px-6">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="gap-2">
                <Network className="w-4 h-4" />
                Tecnologia Avançada
              </Badge>
              <h2 className="text-3xl lg:text-4xl">
                Nossa Solução Inovadora
              </h2>
              <p className="text-lg text-muted-foreground">
                Aplicamos conceitos avançados de ciência de dados e teoria dos grafos 
                para criar um sistema de recomendação musical verdadeiramente inteligente 
                e personalizado.
              </p>
            </div>
            
            <div className="grid gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1738082956220-a1f20a8632ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXR3b3JrJTIwZ3JhcGglMjB2aXN1YWxpemF0aW9ufGVufDF8fHx8MTc1ODE0MzM5OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Visualização de rede de grafos"
              width={600}
              height={400}
              className="w-full h-[400px] object-cover rounded-2xl shadow-2xl"
            />
            <div className="absolute top-6 right-6 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <div className="text-sm text-muted-foreground">Algoritmo Simulado</div>
              <div className="text-2xl font-semibold text-primary">Em Testes</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}