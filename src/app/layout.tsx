import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import { CommandsProvider } from "@/contexts/commands-context";
import { UsersProvider } from "@/contexts/users-context";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AppLoadingProvider } from "@/components/providers/app-providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EasyScale - Comandos ChatGPT para PMEs",
  description: "Acesse mais de 1.000 comandos especializados de ChatGPT para impulsionar seu negócio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <AppLoadingProvider>
            <AuthProvider>
              <CommandsProvider>
                <UsersProvider>
                  {children}
                  <Toaster />
                </UsersProvider>
              </CommandsProvider>
            </AuthProvider>
          </AppLoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}