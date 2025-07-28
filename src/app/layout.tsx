import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import InstallPWA from '@/components/InstallPWA'
import { AuthProvider } from '@/components/auth/auth-provider'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EasyScale PWA',
  description: 'Progressive Web App criado com EasyScale',
  manifest: '/manifest.json',
  themeColor: '#2563EB',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'EasyScale PWA',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'EasyScale PWA',
    title: 'EasyScale PWA',
    description: 'Progressive Web App criado com EasyScale',
  },
  twitter: {
    card: 'summary',
    title: 'EasyScale PWA',
    description: 'Progressive Web App criado com EasyScale',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#2563EB" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="EasyScale PWA" />
        <meta name="msapplication-TileColor" content="#2563EB" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#2563EB" />
        
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <InstallPWA />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}