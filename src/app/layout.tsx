import type { Metadata, Viewport } from "next";
import { Inter, Fredoka } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";
import { OrganizationSchema, WebSiteSchema } from "@/components/Seo";
import { site } from "@/lib/site";
import { homeSeo } from "@/lib/content";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: homeSeo.title,
    template: `%s · ${site.shortName}`,
  },
  description: homeSeo.description,
  keywords: [
    "Telogica",
    "telecom test equipment",
    "test and measuring equipment",
    "OTDR",
    "fusion splicer",
    "cable fault locator",
    "cable route locator",
    "spectrum analyzer",
    "RF power amplifier",
    "railway OFC test equipment",
    "defence RF",
    "electronics manufacturing services",
    "Hyderabad",
  ],
  // Home is the canonical root; inner pages override this via pageMetadata().
  alternates: { canonical: site.url },
  openGraph: {
    type: "website",
    title: homeSeo.title,
    description: homeSeo.description,
    url: site.url,
    siteName: site.name,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: homeSeo.title,
    description: homeSeo.description,
  },
  // Explicit crawl policy. `max-image-preview:large` is what lets Google show
  // the full-size product/OG image in results rather than a thumbnail.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  applicationName: site.shortName,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "technology",
  formatDetection: { telephone: true, address: true, email: true },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/logo-color.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#05070a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // en-IN: the audience, product spellings and currency are all Indian.
    <html lang="en-IN" className={`${inter.variable} ${fredoka.variable}`}>
      <body className="bg-black font-sans text-white antialiased">
        <OrganizationSchema />
        <WebSiteSchema />
        <Providers>
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
