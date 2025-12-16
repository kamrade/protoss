import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";

import { ApiKeyProvider } from "@/context/api-key";
import "./globals.css";
import { Notifications } from "@/components/Notifications/Notifications";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Protoss Control Center",
  description:
    "Internal workspace to manage entities, clients, and real-time profiles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ApiKeyProvider>
          <header className="border-b border-gray-200 bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
              <Link
                href="/"
                className="text-lg font-semibold text-gray-900 hover:text-black"
              >
                Protoss
              </Link>
              <nav className="flex gap-4 text-sm font-medium text-gray-600">
                <Link href="/" className="hover:text-gray-900">
                  Home
                </Link>
                <Link href="/users-management" className="hover:text-gray-900">
                  Users
                </Link>
                <Link href="/showcase" className="hover:text-gray-900">
                  Showcase
                </Link>
              </nav>

              <div className="flex items-center gap-2">
                {/* Notifications sheet */}
                <div className="hidden sm:block">
                  <Notifications />
                </div>
              </div>
            </div>
          </header>
          {children}
        </ApiKeyProvider>
      </body>
    </html>
  );
}
