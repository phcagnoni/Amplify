import { useState } from "react";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { ProblemSection } from "./components/ProblemSection";
import { SolutionSection } from "./components/SolutionSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { DemoSection } from "./components/DemoSection";
import { CulturalSection } from "./components/CulturalSection";
import { StatsSection } from "./components/StatsSection";
import { CtaSection } from "./components/CtaSection";
import { Footer } from "./components/Footer";
import { LoginPage } from "./components/LoginPage";
import { AppDashboard } from "./components/AppDashboard";

export type AppState = 'landing' | 'login' | 'dashboard';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppState>('landing');

  const navigateTo = (screen: AppState) => {
    setCurrentScreen(screen);
  };

  if (currentScreen === 'login') {
    return <LoginPage onLogin={() => navigateTo('dashboard')} onBack={() => navigateTo('landing')} />;
  }

  if (currentScreen === 'dashboard') {
    return <AppDashboard onLogout={() => navigateTo('landing')} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onLogin={() => navigateTo('login')} />
      <main>
        <HeroSection onGetStarted={() => navigateTo('login')} />
        <ProblemSection />
        <SolutionSection />
        <HowItWorksSection />
        <DemoSection />
        <CulturalSection onGetStarted={() => navigateTo('login')} />
        <StatsSection />
        <CtaSection onGetStarted={() => navigateTo('login')} />
      </main>
      <Footer />
    </div>
  );
}