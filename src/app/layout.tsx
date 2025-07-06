import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import { CommandsProvider } from "@/contexts/commands-context";
import { UsersProvider } from "@/contexts/users-context";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EasyScale - Comandos ChatGPT para PMEs",
  description: "Acesse mais de 1.000 comandos especializados de ChatGPT para impulsionar seu negócio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased theme-transition portal-fix`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          <AuthProvider>
            <CommandsProvider>
              <UsersProvider>
                <div id="app-root" className="relative z-0">
                  {children}
                </div>
                <Toaster />
              </UsersProvider>
            </CommandsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}