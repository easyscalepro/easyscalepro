import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import SonnerToaster from "@/components/ui/sonner-toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EasyScale - Comandos IA",
  description: "Plataforma de comandos para IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AppProviders>
          {children}
          <SonnerToaster />
        </AppProviders>
      </body>
    </html>
  );
}