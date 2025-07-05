import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import { CommandsProvider } from "@/contexts/commands-context";
import { UsersProvider } from "@/contexts/users-context";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { InstallPrompt } from "@/components/pwa/install-prompt";

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
  keywords: ["ChatGPT", "PME", "comandos", "IA", "negócios", "produtividade"],
  authors: [{ name: "EasyScale Team" }],
  creator: "EasyScale",
  publisher: "EasyScale",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://easyscale.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "EasyScale - Comandos ChatGPT para PMEs",
    description: "Acesse mais de 1.000 comandos especializados de ChatGPT para impulsionar seu negócio",
    url: 'https://easyscale.app',
    siteName: 'EasyScale',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EasyScale - Comandos ChatGPT para PMEs',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "EasyScale - Comandos ChatGPT para PMEs",
    description: "Acesse mais de 1.000 comandos especializados de ChatGPT para impulsionar seu negócio",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/icons/safari-pinned-tab.svg',
        color: '#2563EB',
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'EasyScale',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'EasyScale',
    'application-name': 'EasyScale',
    'msapplication-TileColor': '#2563EB',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#2563EB',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2563EB' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' },
  ],
  colorScheme: 'light dark',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="EasyScale" />
        <meta name="application-name" content="EasyScale" />
        <meta name="msapplication-TileColor" content="#2563EB" />
        <meta name="theme-color" content="#2563EB" />
        
        {/* PWA iOS specific */}
        <link rel="apple-touch-icon" href="/icons/icon-180x180.png" />
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/icons/icon-192x192.png" as="image" />
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          <AuthProvider>
            <CommandsProvider>
              <UsersProvider>
                <div className="min-h-screen flex flex-col">
                  {children}
                </div>
                <InstallPrompt />
                <Toaster 
                  position="top-center"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: 'var(--background)',
                      color: 'var(--foreground)',
                      border: '1px solid var(--border)',
                    },
                  }}
                />
              </UsersProvider>
            </CommandsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}