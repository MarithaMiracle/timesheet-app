// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextAuthSessionProvider from '@/components/providers/NextAuthSessionProvider';
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

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
        {/* Add Material Icons */}
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} font-sans`} style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#f8f9fa' }}>
        <NextAuthSessionProvider>
          {children}
          <Toaster position="top-right" />
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}