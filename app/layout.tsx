import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://theagamyoga.com"),
  title: "theagamyoga | Hatha Yoga in Cologne",
  description: "AGAM Yoga with Anitha Ramalingam in Cologne: Hatha Yoga, Hatha–Vinyasa and Yoga Nidra rooted in a practice of turning inward.",
  alternates: { canonical: "/" },
  openGraph: { title: "theagamyoga | Hatha Yoga in Cologne", description: "A Hatha Yoga practice rooted in turning inward with Anitha Ramalingam in Cologne.", url: "https://theagamyoga.com", siteName: "theagamyoga", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
