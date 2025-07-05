import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import { CommandsProvider } from "@/contexts/commands-context";
import { UsersProvider } from "@/contexts/users-context";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { InstallPrompt } from "@/components/pwa/install-prompt";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EasyScale - Comandos ChatGPT para PMEs",
  description: "Acesse mais de 1.000 comandos especializados de ChatGPT para impulsionar seu negócio",
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563EB',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#2563EB" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon-32x32.png" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <CommandsProvider>
              <UsersProvider>
                {children}
                <InstallPrompt />
                <Toaster />
              </UsersProvider>
            </CommandsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}