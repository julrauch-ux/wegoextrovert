import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "wge — wegoextrovert.ai | LinkedIn Growth on Autopilot",
  description:
    "AI-powered LinkedIn engagement that builds your presence, grows your network, and drives leads — while you focus on what matters.",
  keywords: ["LinkedIn", "AI", "engagement", "growth", "SaaS", "automation"],
  openGraph: {
    title: "wge — wegoextrovert.ai",
    description: "AI-powered LinkedIn engagement on autopilot.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-wge-black text-wge-cream antialiased font-inter">
        {children}
      </body>
    </html>
  );
}
