import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { AnalyticsBootstrap } from "@/components/AnalyticsBootstrap";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { Footer } from "@/components/Footer";
import { GoogleAnalyticsScripts } from "@/components/GoogleAnalyticsScripts";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Atlas — Toma mejores decisiones financieras",
  description:
    "Simulaciones interactivas y explicaciones claras para decisiones financieras importantes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <GoogleAnalyticsScripts />
        <AnalyticsBootstrap />
        {children}
        <Footer />
        <CookieConsentBanner />
      </body>
    </html>
  );
}
