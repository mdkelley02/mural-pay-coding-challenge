import { Providers } from "@/components/Providers";
import RootHeader from "@/components/RootHeader";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
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
  title: "Merchant Inc.",
  description: "A demo for the Mural Pay Coding Challenge",
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
        <Providers>
          <RootHeader />
          <Separator />
          <div className="p-4 max-w-7xl mx-auto">{children}</div>
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
