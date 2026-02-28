import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import ToastProvider from '@/components/ui/ToastProvider'
import './globals.css'
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Recipear',
    template: '%s | Recipear',
  },
  description: 'Tu recetario personal. Guardá, organizá y cocinás tus recetas desde cualquier dispositivo.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://recipear.vercel.app'),
  openGraph: {
    title:       'Recipear',
    description: 'Tu recetario personal. Guardá, organizá y cocinás tus recetas desde cualquier dispositivo.',
    url:         '/',
    siteName:    'Recipear',
    locale:      'es_AR',
    type:        'website',
    images: [{
      url:    '/og.png',
      width:  1200,
      height: 630,
      alt:    'Recipear',
    }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Recipear',
    description: 'Tu recetario personal.',
    images:      ['/og.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ToastProvider>
          {children}
        </ToastProvider>
        <Analytics />
      </body>
    </html>
  )
}