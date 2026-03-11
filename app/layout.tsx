import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SkipToMain } from "@/components/shared/SkipToMain";
import { RouteAnnouncer } from "@/components/shared/RouteAnnouncer";
import { CookieBanner } from "@/components/shared/CookieBanner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s — Michael de la Morena`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-zinc-950 font-sans antialiased">
        <SkipToMain />
        <RouteAnnouncer />
        <Header />
        <main id="main-content" className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          {children}
        </main>
        <Footer />
        <CookieBanner />
        {gaMeasurementId && (
          <GoogleAnalytics gaId={gaMeasurementId} />
        )}
      </body>
    </html>
  );
}
