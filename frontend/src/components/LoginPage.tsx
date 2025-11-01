import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowLeft, Music, Sparkles, Mail, Lock } from "lucide-react";

interface LoginPageProps {
  onLogin: () => void;
  onBack: () => void;
}

export function LoginPage({ onLogin, onBack }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular login/cadastro
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="gap-2 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="relative">
                <Music className="w-8 h-8 text-primary" />
                <Sparkles className="w-3.5 h-3.5 text-primary/70 absolute -top-0.5 -right-0.5" />
              </div>
              <span className="text-2xl font-semibold">AmpliFy</span>
            </div>
            <h1 className="text-2xl">
              {isSignUp ? "Criar Conta" : "Entrar"}
            </h1>
            <p className="text-muted-foreground">
              {isSignUp 
                ? "Junte-se ao futuro da descoberta musical" 
                : "Acesse sua conta para continuar"
              }
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {isSignUp ? "Cadastro Beta" : "Login"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                {isSignUp ? "Criar Conta" : "Entrar"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isSignUp ? "Já tem uma conta?" : "Não tem uma conta?"}
              </p>
              <Button
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
                className="mt-1"
              >
                {isSignUp ? "Fazer Login" : "Criar Conta"}
              </Button>
            </div>

            {isSignUp && (
              <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/30">
                <div className="text-sm text-center space-y-2">
                  <p className="font-medium text-primary">🎵 Acesso Beta Limitado</p>
                  <p className="text-muted-foreground">
                    Você será um dos primeiros a testar nossa tecnologia revolucionária de recomendações musicais!
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}