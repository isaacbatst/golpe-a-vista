import type { Metadata } from "next";
import { Lora } from "next/font/google";
import { Toaster } from "../components/ui/sonner";
import "./globals.css";

const lora = Lora({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
        className={`${lora.variable} ${lora.className} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
