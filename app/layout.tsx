import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReadingProvider } from '@/app/_context/ReadingContext';
import { ThemeProvider } from "@/components/ui/theme-provider";

import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oratio", // Actualicé el título a tu marca
  description: "A simple prayer app",
};

import { PrayerProvider } from "./_context/PrayerContext";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <PrayerProvider>
              <ReadingProvider>
                {children}
              </ReadingProvider>
            </PrayerProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}