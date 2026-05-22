import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Compensation Intelligence",
  description: "Structured compensation intelligence for normalized company, role, level, and location comparisons.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 text-slate-950">
        <header className="border-b border-slate-200 bg-white">
          <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4">
            <Link href="/" className="text-base font-semibold text-slate-950">
              Compensation Intelligence
            </Link>
            <div className="flex gap-2 text-sm">
              <Link href="/" className="rounded px-3 py-2 text-slate-700 hover:bg-slate-100">
                Home
              </Link>
              <Link href="/browse" className="rounded px-3 py-2 text-slate-700 hover:bg-slate-100">
                Browse
              </Link>
              <Link href="/compare" className="rounded px-3 py-2 text-slate-700 hover:bg-slate-100">
                Compare
              </Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
