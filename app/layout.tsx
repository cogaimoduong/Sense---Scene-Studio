import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sense & Scene Studio — Visual Technology",
  description: "Visual technology studio shaping stories through CGI, motion and spatial experiences.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
