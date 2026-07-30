import type { Metadata } from "next";
import { Figtree, Source_Sans_3, IBM_Plex_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

// Display — geometric humanist, the closest freely-licensable face to
// sofia-pro (Adobe Fonts, which can't be self-hosted). Generous apertures and
// a tall x-height, so it holds up at 54px/700 with tight negative tracking.
// Deliberately not a grotesque: those read newsy and generic at display sizes.
const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

// Body — the readability engine. 17px/1.65 at a 720px measure.
const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

// Mono — carries every verification stamp and tabular figure. Mono is what
// makes "this number was checked" legible at a glance.
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://panamarealestateguide.com"),
  title: {
    default: "Panama Real Estate Guide — Know what you're buying",
    template: "%s | Panama Real Estate Guide",
  },
  description:
    "Independent guides to buying property in Panama. Verified figures, titled-land checks, and area-by-area research for foreign buyers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${sourceSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
