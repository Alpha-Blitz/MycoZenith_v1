import type { Metadata } from 'next'
import { Geist, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

export const metadata: Metadata = {
  title: 'MycoZenith — Cordyceps Performance Supplements',
  description: 'Premium cordyceps-powered supplements designed to enhance energy, endurance, and mental clarity.',
  openGraph: {
    type:        'website',
    siteName:    'MycoZenith',
    title:       'MycoZenith — Cordyceps Performance Supplements',
    description: 'Premium mushroom supplements backed by science. Lion\'s Mane, Cordyceps, Reishi.',
    url:         'https://mycozenith.com',
    images: [{ url: 'https://mycozenith.com/hero1.jpeg', width: 1200, height: 630, alt: 'MycoZenith' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'MycoZenith — Cordyceps Performance Supplements',
    description: 'Premium mushroom supplements backed by science.',
    images:      ['https://mycozenith.com/hero1.jpeg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
        {children}
        <Analytics />
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { page_path: window.location.pathname });
            `}</Script>
          </>
        )}
      </body>
    </html>
  )
}
