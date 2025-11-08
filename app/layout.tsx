import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import UserSync from "@/components/UserSync";
import { QueryProvider } from "@/lib/providers/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BixiRoad - Africa's Trade Highway",
  description: "Africa's first verified marketplace for raw materials and precious minerals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
          <Header />
          <main className="min-h-[calc(100vh-20rem)]">
            <QueryProvider>
              <UserSync />
              {children}
            </QueryProvider>
          </main>
          <Footer />
        </div>
      </body>
    </html>
    </ClerkProvider>
  );
}
