import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./_components/Navbar";
import NavbarMobile from "./_components/navbar-mobile";
import BottomNav from "./_components/BottomNav";
import { ThemeProvider } from "@/components/ui/theme-provider"; // <-- Importación añadida

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
          <main>
            {children}
          </main>
          <BottomNav />
          <NavbarMobile />
        </ThemeProvider>
      </body>
    </html>
  );
}