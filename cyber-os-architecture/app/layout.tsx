import type { Metadata } from "next";

import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CyberOS Portfolio | Magauiya Amir",
    template: "%s | CyberOS Portfolio",
  },
  description:
    "Interactive cyberpunk portfolio built as a simulated operating system with draggable windows, apps, notes, terminal, and mini-games.",
  keywords: [
    "CyberOS",
    "Magauiya Amir",
    "interactive portfolio",
    "Next.js portfolio",
    "cyberpunk UI",
    "simulated operating system",
  ],
  authors: [{ name: "Magauiya Amir" }],
  creator: "Magauiya Amir",
  generator: "v0.app",
  openGraph: {
    title: "CyberOS Portfolio | Magauiya Amir",
    description:
      "Explore an interactive portfolio presented as a cyberpunk operating system with windows, apps, terminal, notes, and games.",
    type: "website",
    locale: "en_US",
    siteName: "CyberOS Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "CyberOS Portfolio | Magauiya Amir",
    description:
      "A cyberpunk operating-system-style portfolio with draggable windows, apps, terminal, notes, and mini-games.",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-background">
      <body className="font-sans antialiased overflow-hidden">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
