import type { Language } from "@/lib/i18n/translations";
import { About } from "@/components/About";
import { Classes } from "@/components/Classes";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { FloatingStripe } from "@/components/FloatingStripe";
import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { Navigation } from "@/components/Navigation";
import { PaletteSwitcher } from "@/components/PaletteSwitcher";
import { Philosophy } from "@/components/Philosophy";
import { Reviews } from "@/components/Reviews";
import { YogaOfferings } from "@/components/YogaOfferings";
import { WaterWaveMotion } from "@/components/WaterWaveMotion";

// Calendar data has its own five-minute cache; do not layer page ISR over it.


export function HomePage({ language }: { language: Language }) {
  return (
    <main>
      {process.env.NODE_ENV === "development" && <PaletteSwitcher />}
      <WaterWaveMotion />
      <Navigation />
      <Hero />
      <FloatingStripe />
      <About />
      <Gallery />
      <Philosophy />
      <YogaOfferings />
      <Classes language={language} />
      <Reviews />
      <Contact />
      <Footer />
    </main>
  );
}
