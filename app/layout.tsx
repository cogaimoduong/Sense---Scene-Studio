import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sense & Scene Studio — CGI, Motion & Visual Technology",
  description: "Sense & Scene is a visual technology studio in Saigon creating CGI, motion, spatial visuals and new-media experiences.",
  metadataBase: new URL("https://senseandscene.studio"),
  icons: {
    icon: "/sense-scene-logo.jpg",
    apple: "/sense-scene-logo.jpg",
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
  themeColor: "#f4f3f0",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
