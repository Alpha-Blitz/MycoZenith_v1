import type { Metadata } from 'next'
import { Geist, Playfair_Display } from 'next/font/google'
import './globals.css'

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
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
        {children}
      </body>
    </html>
  )
}
