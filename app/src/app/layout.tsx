import type { Metadata } from "next";
import { Anton, Bebas_Neue, Lora, Special_Elite } from "next/font/google";
import { Toaster } from "../components/ui/sonner";
import "./globals.css";


const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const specialElite = Special_Elite({
  variable: "--font-special-elite",
  subsets: ["latin"],
  weight: '400'
});

const anton = Anton({
  variable: '--font-anton',
  weight: '400',
  subsets: ['latin']
})

const bebas = Bebas_Neue({
  variable: '--font-bebas',
  weight: '400',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: "Congresso Simulator",
  description: "Jogo de blefe e dedução social onde jogadores são divididos em três papéis: Moderados, Radical e Conservadores.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lora.variable} ${specialElite.variable} ${lora.className} ${anton.variable} ${bebas.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
