import { About } from "@/components/About";
import { Classes } from "@/components/Classes";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { FloatingStripe } from "@/components/FloatingStripe";
import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { Navigation } from "@/components/Navigation";
import { Philosophy } from "@/components/Philosophy";
import { Reviews } from "@/components/Reviews";
import { YogaOfferings } from "@/components/YogaOfferings";

export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />
      <FloatingStripe />
      <About />
      <Philosophy />
      <YogaOfferings />
      <Gallery />
      <Classes />
      <Reviews />
      <Contact />
      <Footer />
    </main>
  );
}
