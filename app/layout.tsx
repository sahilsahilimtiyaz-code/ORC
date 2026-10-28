import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";

/**
 * Owner's new design language: classical serif display + clean sans body.
 * Fonts are self-hosted at build time by next/font (no runtime requests).
 */
const display = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-display",
  display: "swap",
});
const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Official Chad Rankings — OCR",
  description:
    "The definitive standings of the verse: global rankings, movements, hall of fame and the community behind them. Placeholder rebuild sample copy.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      {/* photo CDN preconnect + dns-prefetch: portraits stream onto name cards
          from their recorded origins (official board assets + official channel
          avatars); warming the connections removes TLS latency from first paint */}
      <link rel="preconnect" href="https://media.base44.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://qtrypzzcjebvfcihiynt.supabase.co" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://yt3.googleusercontent.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://media.base44.com" />
      <link rel="dns-prefetch" href="https://yt3.googleusercontent.com" />
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
