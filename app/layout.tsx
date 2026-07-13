import type { Metadata, Viewport } from "next";
import { Anybody, Bodoni_Moda, Lexend_Peta } from "next/font/google";
import "./globals.css";

const lexendPeta = Lexend_Peta({
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
  variable: "--font-lexend-peta",
});

const anybody = Anybody({
  subsets: ["latin"],
  weight: "variable",
  axes: ["wdth"],
  display: "swap",
  variable: "--font-anybody",
});

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  weight: "500",
  style: "italic",
  display: "swap",
  variable: "--font-bodoni-moda",
});

export const metadata: Metadata = {
  title: "Sense & Scene Studio — CGI, Motion & Visual Technology",
  description: "Sense & Scene is a visual technology studio in Saigon creating CGI, motion, spatial visuals and new-media experiences.",
  metadataBase: new URL("https://senseandscene.studio"),
  icons: {
    icon: "/sense-scene-logo-dark.png",
    apple: "/sense-scene-logo-dark.png",
  },
  openGraph: {
    title: "Sense & Scene Studio",
    description: "Visual worlds built through CGI, motion and creative technology.",
    images: ["/hero-light-visual.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
  themeColor: "#000000",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${lexendPeta.variable} ${anybody.variable} ${bodoniModa.variable}`}>{children}</body>
    </html>
  );
}
