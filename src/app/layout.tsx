import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Devanagari, Noto_Sans_Oriya } from "next/font/google";
import { themeStyle } from "@/config/theme";
import { Providers } from "./providers";
import "./globals.css";

const sans = Noto_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-sans" });
const deva = Noto_Sans_Devanagari({ subsets: ["devanagari"], weight: ["400", "600", "700"], variable: "--font-deva" });
const oriya = Noto_Sans_Oriya({ subsets: ["oriya"], weight: ["400", "600", "700"], variable: "--font-oriya" });

export const metadata: Metadata = { title: "Raksha Setu", description: "Emergency Shelter Coordination" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style>{themeStyle}</style>
      </head>
      <body className={`${sans.variable} ${deva.variable} ${oriya.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
