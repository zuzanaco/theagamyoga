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

export const revalidate = 600;

export default function Home() {
  return (
    <main>
      <PaletteSwitcher />
      <WaterWaveMotion />
      <Navigation />
      <Hero />
      <FloatingStripe />
      <About />
      <Gallery />
      <Philosophy />
      <YogaOfferings />
      <Classes />
      <Reviews />
      <Contact />
      <Footer />
    </main>
  );
}
