import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toast'
import { getBaseUrl } from '@/lib/utils'

// Font Inter cho body text
const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: 'OpenLay - Tài khoản số chính hãng, bảo hành uy tín',
    template: '%s | OpenLay',
  },
  description:
    'Mua tài khoản Gemini, ChatGPT, Netflix, Spotify, Canva, CapCut và nhiều dịch vụ số cao cấp với giá tốt nhất. Bảo hành uy tín, hỗ trợ 24/7 qua Zalo.',
  keywords: [
    'tài khoản số',
    'mua tài khoản',
    'Gemini Advanced',
    'ChatGPT Plus',
    'Netflix Premium',
    'Spotify Premium',
    'Canva Pro',
    'CapCut Pro',
    'subscription',
    'digital account',
  ],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'OpenLay',
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className="dark" suppressHydrationWarning>
      <head>
        {/* Preconnect Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Space Grotesk cho heading */}
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
