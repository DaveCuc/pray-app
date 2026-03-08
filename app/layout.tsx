import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./_components/navbar";
import BottomNav from "./_components/BottomNav";
import { ThemeProvider } from "@/components/ui/theme-provider";
import LeftNav from "./_components/LeftNav";
import Upcoming from "./_components/Upcoming";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning es vital para next-themes
    <html lang="es" suppressHydrationWarning> 
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased pb-24`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NavBar />
          <div className="md:flex md:min-h-[calc(100vh-4rem)]">
            <div className="hidden md:block md:w-72 border-r border-border bg-muted/20">
              <LeftNav />
              
            </div>
            
            <main className="flex-1 min-w-0">
              {children}
            </main>
          </div>
          <BottomNav />
          
        </ThemeProvider>
      </body>
    </html>
  );
}