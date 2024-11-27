"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider defaultTheme="system" enableSystem attribute="class">
      <SessionProvider>
        {children}
      </SessionProvider>
    </NextThemesProvider>
  );
}
