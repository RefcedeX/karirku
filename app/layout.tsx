import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { PushBackProvider } from "@/components/layout/PushBackProvider";
import { Sidebar } from "@/components/layout/Sidebar";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KarirKu | Rekomendasi Karier & Peminatan SMAN 1 BAROS",
  description: "Aplikasi penelusuran minat bakat dan rekomendasi karier untuk siswa SMAN 1 BAROS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-black text-white">
        <Sidebar />
        <PushBackProvider>
          {children}
        </PushBackProvider>
      </body>
    </html>
  );
}
