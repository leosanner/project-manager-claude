import { LandingNavbar } from "./components/landing/landing-navbar";
import { HeroSection } from "./components/landing/hero-section";
import { FeaturesSection } from "./components/landing/features-section";
import { HowItWorksSection } from "./components/landing/how-it-works-section";
import { EditorShowcaseSection } from "./components/landing/editor-showcase-section";
import { VoiceShowcaseSection } from "./components/landing/voice-showcase-section";
import { CtaSection } from "./components/landing/cta-section";
import { LandingFooter } from "./components/landing/landing-footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen scroll-smooth bg-canvas text-fg-primary">
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <EditorShowcaseSection />
        <VoiceShowcaseSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
