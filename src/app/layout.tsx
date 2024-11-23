import "./globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import Providers from "./providers";
import SiteHeader from "@/components/site-header";

export const metadata: Metadata = {
  title: "Padder",
  description: "A powerful note-taking tool.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background">
        <TRPCReactProvider>
          <Providers>
            <SiteHeader />
            <main className="mx-auto max-w-5xl p-2">{children}</main>
          </Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
