import { Card, CardContent } from "./ui/card";
import { TrendingUp, Users, Music, Zap } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function StatsSection() {
  const goals = [
    {
      icon: Music,
      value: "Descoberta",
      label: "Musical Inteligente",
      description: "Algoritmos de grafos"
    },
    {
      icon: Users, 
      value: "Beta",
      label: "Lançamento Q1 2025",
      description: "Acesso antecipado"
    },
    {
      icon: TrendingUp,
      value: "Objetivo",
      label: "Superar Limitações",
      description: "Dos sistemas atuais"
    },
    {
      icon: Zap,
      value: "Missão",
      label: "Expandir Horizontes",
      description: "Musicais personalizados"
    }
  ];

  return (
    <section className="py-16 px-6 bg-muted/30">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl">
                Mais
                <span className="text-primary block">Informações</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Conheça os objetivos e metas do AmpliFy: revolucionar a descoberta musical 
                através de tecnologia avançada e experiência personalizada.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {goals.map((goal, index) => (
                <Card key={index}>
                  <CardContent className="p-6 text-center">
                    <div className="mb-3 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/15">
                      <goal.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-primary">{goal.value}</div>
                      <div className="font-semibold">{goal.label}</div>
                      <div className="text-sm text-muted-foreground">{goal.description}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1720962158937-7ea890052166?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHZhbmNlZCUyMHRlY2hub2xvZ3klMjBmdXR1cmlzdGljfGVufDF8fHx8MTc1ODI0MzQ2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Tecnologia avançada futurística"
                width={600}
                height={400}
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8 text-white">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Sistema de Grafos</h3>
                  <p className="text-white/90">
                    Visualização das conexões musicais através de algoritmos avançados
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute bottom-6 left-6 bg-background/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <div className="text-sm text-muted-foreground">Status do Projeto</div>
              <div className="text-2xl font-bold text-primary">Em Desenvolvimento</div>
              <div className="text-sm text-primary">🚀 Lançamento em breve</div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">Nossa Visão</h3>
              <p className="text-muted-foreground">
                Criar um ecossistema musical onde cada recomendação é uma porta para 
                novos horizontes, respeitando o gosto individual de cada usuário.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">Diferencial</h3>
              <p className="text-muted-foreground">
                Combinamos teoria dos grafos com machine learning para criar conexões 
                musicais que vão além do que algoritmos tradicionais conseguem oferecer.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">Impacto</h3>
              <p className="text-muted-foreground">
                Democratizar a descoberta musical, conectando pessoas a artistas e 
                gêneros que talvez nunca encontrassem pelos métodos convencionais.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}