import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextAuthSessionProvider from '@/components/providers/NextAuthSessionProvider';
import { Toaster } from "react-hot-toast";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Ticktock - Login",
  description: "Timesheet Management Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} font-sans`} style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', backgroundColor: '#f8f9fa' }}>
        <NextAuthSessionProvider>
          {children}
          <Toaster position="top-right" />
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}