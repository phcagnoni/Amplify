import { Card, CardContent } from "./ui/card";
import { AlertTriangle, RefreshCw, Target } from "lucide-react";

export function ProblemSection() {
  const problems = [
    {
      icon: RefreshCw,
      title: "Recomendações Repetitivas",
      description: "Os algoritmos tradicionais ficam presos em loops, sempre sugerindo as mesmas músicas e artistas."
    },
    {
      icon: Target,
      title: "Baixa Precisão",
      description: "Sugestões baseadas apenas em popularidade ou gênero, ignorando nuances musicais importantes."
    },
    {
      icon: AlertTriangle,
      title: "Superficialidade",
      description: "Análises limitadas que não capturam a complexidade real das preferências musicais individuais."
    }
  ];

  return (
    <section className="py-16 px-6 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-4xl">
            O Problema dos Sistemas Atuais
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Os aplicativos de música mais populares falham em oferecer recomendações 
            verdadeiramente personalizadas e relevantes para cada usuário.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-8 pb-6">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10">
                  <problem.icon className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="text-xl mb-3">{problem.title}</h3>
                <p className="text-muted-foreground">{problem.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-full">
            <AlertTriangle className="w-4 h-4" />
            <span>Resultado: Experiência musical limitada e frustrante</span>
          </div>
        </div>
      </div>
    </section>
  );
}