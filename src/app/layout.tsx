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
      { 
        url: 'https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png', 
        sizes: '32x32', 
        type: 'image/png' 
      },
      { 
        url: 'https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png', 
        sizes: '16x16', 
        type: 'image/png' 
      },
      { 
        url: 'https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png', 
        sizes: '192x192', 
        type: 'image/png' 
      },
      { 
        url: 'https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png', 
        sizes: '512x512', 
        type: 'image/png' 
      },
    ],
    apple: [
      { 
        url: 'https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png', 
        sizes: '180x180', 
        type: 'image/png' 
      },
      { 
        url: 'https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png', 
        sizes: '152x152', 
        type: 'image/png' 
      },
      { 
        url: 'https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png', 
        sizes: '144x144', 
        type: 'image/png' 
      },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: 'https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png',
        color: '#2563EB',
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'EasyScale',
    startupImage: [
      {
        url: 'https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png',
        media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: 'https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png',
        media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: 'https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png',
        media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)',
      },
    ],
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'EasyScale',
    'application-name': 'EasyScale',
    'msapplication-TileColor': '#2563EB',
    'msapplication-TileImage': 'https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png',
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
        
        {/* Favicon personalizado com logo da empresa */}
        <link 
          rel="icon" 
          type="image/png" 
          sizes="32x32" 
          href="https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png" 
        />
        <link 
          rel="icon" 
          type="image/png" 
          sizes="16x16" 
          href="https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png" 
        />
        <link 
          rel="shortcut icon" 
          href="https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png" 
        />
        
        {/* Apple Touch Icons */}
        <link 
          rel="apple-touch-icon" 
          sizes="180x180" 
          href="https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png" 
        />
        <link 
          rel="apple-touch-icon" 
          sizes="152x152" 
          href="https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png" 
        />
        <link 
          rel="apple-touch-icon" 
          sizes="144x144" 
          href="https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png" 
        />
        <link 
          rel="apple-touch-icon" 
          sizes="120x120" 
          href="https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png" 
        />
        <link 
          rel="apple-touch-icon" 
          sizes="114x114" 
          href="https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png" 
        />
        <link 
          rel="apple-touch-icon" 
          sizes="76x76" 
          href="https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png" 
        />
        <link 
          rel="apple-touch-icon" 
          sizes="72x72" 
          href="https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png" 
        />
        <link 
          rel="apple-touch-icon" 
          sizes="60x60" 
          href="https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png" 
        />
        <link 
          rel="apple-touch-icon" 
          sizes="57x57" 
          href="https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png" 
        />
        
        {/* Android Chrome Icons */}
        <link 
          rel="icon" 
          type="image/png" 
          sizes="192x192" 
          href="https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png" 
        />
        <link 
          rel="icon" 
          type="image/png" 
          sizes="512x512" 
          href="https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png" 
        />
        
        {/* Windows Tiles */}
        <meta 
          name="msapplication-TileImage" 
          content="https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png" 
        />
        <meta name="msapplication-TileColor" content="#2563EB" />
        
        {/* PWA Meta Tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="EasyScale" />
        <meta name="application-name" content="EasyScale" />
        <meta name="theme-color" content="#2563EB" />
        
        {/* Apple Startup Images */}
        <link 
          rel="apple-touch-startup-image" 
          href="https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png"
          media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link 
          rel="apple-touch-startup-image" 
          href="https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link 
          rel="apple-touch-startup-image" 
          href="https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link 
          rel="apple-touch-startup-image" 
          href="https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        
        {/* Preload critical resources */}
        <link 
          rel="preload" 
          href="https://wlynpcuqlqynsutkpvmq.supabase.co/storage/v1/object/public/media/app-7/images/1751664569198-jws9j1rdj.png" 
          as="image" 
        />
        
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