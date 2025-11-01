import { Music, Sparkles, Github, Twitter, Mail } from "lucide-react";
import { Button } from "./ui/button";

export function Footer() {
  const footerLinks = {
    produto: [
      { name: "Como Funciona", href: "#como-funciona" },
      { name: "Tecnologia", href: "#tecnologia" },
      { name: "Demo", href: "#demo" },
      { name: "AmpliFy", href: "#" }
    ],
    empresa: [
      { name: "Sobre Nós", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Carreiras", href: "#" },
      { name: "Contato", href: "#" }
    ],
    recursos: [
      { name: "Documentação", href: "#" },
      { name: "API", href: "#" },
      { name: "Suporte", href: "#" },
      { name: "Status", href: "#" }
    ]
  };

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Music className="w-8 h-8 text-primary" />
                <Sparkles className="w-3.5 h-3.5 text-primary/70 absolute -top-0.5 -right-0.5" />
              </div>
              <span className="text-xl font-semibold">AmpliFy</span>
            </div>
            <p className="text-muted-foreground max-w-md">
              Revolucionando a descoberta musical através de algoritmos inteligentes 
              baseados em teoria dos grafos e ciência de dados.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                <Github className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                <Mail className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Produto</h4>
            <ul className="space-y-2">
              {footerLinks.produto.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2">
              {footerLinks.empresa.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Recursos</h4>
            <ul className="space-y-2">
              {footerLinks.recursos.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 AmpliFy. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacidade
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Termos
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}