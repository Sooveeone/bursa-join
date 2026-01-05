import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Daftar Bisnis | Bursa UMKM",
  description: "Daftarkan bisnis UMKM Anda di Bursa dan tingkatkan visibilitas usaha Anda kepada ribuan pelanggan potensial.",
  keywords: ["UMKM", "bisnis", "daftar", "Indonesia", "usaha kecil"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={outfit.variable}>
      <body className="min-h-screen antialiased" style={{ fontFamily: "Outfit, system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
