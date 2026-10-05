import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Delcom Posts - Aplikasi Postingan",
  description: "Platform sosial dan berbagi informasi Delcom Posts untuk mahasiswa dan komunitas Delcom.",
  metadataBase: new URL("https://ifs24040-pabwe2026-nextjs.vercel.app"),
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Delcom Posts - Aplikasi Postingan",
    description: "Platform sosial dan berbagi informasi Delcom Posts.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} font-sans h-full`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
