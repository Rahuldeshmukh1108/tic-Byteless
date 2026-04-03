import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '@/contexts/auth-context'
import './globals.css'

export const metadata: Metadata = {
  title: "HydroSync",
  description: "Intelligent Water Management & IoT Automation Platform",
  openGraph: {
    title: 'HydroSync',
    description: 'Intelligent Water Management & IoT Automation Platform',
    type: 'website',
  },
  icons: {
    icon: "/favicon.ico"
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
