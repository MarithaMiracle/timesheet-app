// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextAuthSessionProvider from '@/components/providers/NextAuthSessionProvider';
import { Toaster } from "react-hot-toast"; // ✅ Import Toaster

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
      <body className={`${inter.variable} font-sans`}>
        <NextAuthSessionProvider>
          {children}
          <Toaster position="top-right" /> {/* ✅ Add Toaster here */}
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
