import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SynapticAI',
  description: 'Your AI-powered mental health companion',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 