import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Play, ArrowRight, Music } from "lucide-react";

interface CtaSectionProps {
  onGetStarted?: () => void;
}

export function CtaSection({ onGetStarted }: CtaSectionProps) {
  return (
    <section className="py-16 px-6">
      <div className="container mx-auto">
        <Card className="bg-gradient-to-br from-primary/8 to-primary/15 border-primary/30">
          <CardContent className="p-12 text-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                  <Music className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl lg:text-4xl">
                  Pronto para Descobrir Sua
                  <span className="text-primary block">Próxima Música Favorita?</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Seja um dos primeiros a experimentar a revolução na descoberta musical. 
                  Cadastre-se para receber acesso antecipado ao AmpliFy e descubra o poder das 
                  recomendações baseadas em grafos.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2" onClick={onGetStarted}>
                  <Play className="w-5 h-5" />
                  Acesso Antecipado
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                  Saber Mais
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-primary/30">
                <div className="text-center">
                  <div className="font-semibold">Acesso Exclusivo</div>
                  <div className="text-sm text-muted-foreground">Beta limitado</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">Feedback Direto</div>
                  <div className="text-sm text-muted-foreground">Molde o produto</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">Comunidade</div>
                  <div className="text-sm text-muted-foreground">Primeiros usuários</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}