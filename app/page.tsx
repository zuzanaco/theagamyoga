import { About } from "@/components/About";
import { Classes } from "@/components/Classes";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { FloatingStripe } from "@/components/FloatingStripe";
import { Hero } from "@/components/Hero";
import { Navigation } from "@/components/Navigation";
import { PaletteSwitcher } from "@/components/PaletteSwitcher";
import { Philosophy } from "@/components/Philosophy";
import { Reviews } from "@/components/Reviews";
import { YogaOfferings } from "@/components/YogaOfferings";

export default function Home() {
  return (
    <main>
      <PaletteSwitcher />
      <Navigation />
      <Hero />
      <FloatingStripe />
      <About />
      <Philosophy />
      <YogaOfferings />
      <Classes />
      <Reviews />
      <Contact />
      <Footer />
    </main>
  );
}
