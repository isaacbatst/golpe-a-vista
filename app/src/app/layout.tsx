import type { Metadata } from "next";
import { Lora, Special_Elite } from "next/font/google";
import { Toaster } from "../components/ui/sonner";
import "./globals.css";

const geistSans = Lora({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Special_Elite({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Golpe à Vista",
  description: "Jogo de cartas político",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.className} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
