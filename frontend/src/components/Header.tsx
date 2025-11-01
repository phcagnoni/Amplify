import { Button } from "./ui/button";
import { Music, Sparkles } from "lucide-react";

interface HeaderProps {
  onLogin?: () => void;
}

export function Header({ onLogin }: HeaderProps) {
  return (
    <header className="fixed top-0 w-full bg-background/80 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Music className="w-7 h-7 text-primary" />
              <Sparkles className="w-3 h-3 text-primary/70 absolute -top-0.5 -right-0.5" />
            </div>
            <span className="text-xl font-semibold">AmpliFy</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#como-funciona" className="text-muted-foreground hover:text-primary transition-colors">
              Como Funciona
            </a>
            <a href="#tecnologia" className="text-muted-foreground hover:text-primary transition-colors">
              Tecnologia
            </a>
            <a href="#demo" className="text-muted-foreground hover:text-primary transition-colors">
              Demo
            </a>
          </nav>
          <Button onClick={onLogin}>Experimentar Agora</Button>
        </div>
      </div>
    </header>
  );
}