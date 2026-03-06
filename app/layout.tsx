import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./_components/navbar";
import NavbarMobile from "./_components/navbar-mobile";
import BottomNav from "./_components/BottomNav";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oracion App",
  description: "A simple prayer app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body
        className=   {`${geistSans.variable} ${geistMono.variable} antialiased`}   
           >
        <NavBar />
        <main>
            {children}
        </main>
        <BottomNav />

        <NavbarMobile />

        
      </body>
      
    </html>
  );
}
