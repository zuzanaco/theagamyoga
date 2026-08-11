import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "theagamyoga | A practice of turning inward",
  description: "A slow, breath-led yoga practice in Cologne.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
