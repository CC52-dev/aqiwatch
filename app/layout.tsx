import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "AQIWatch - Real-time Air Quality Monitoring",
  description: "Monitor air quality with real-time data, AI-powered predictions, and comprehensive health insights for your location",
  generator: "v0.app",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AQIWatch",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "AQIWatch",
    title: "AQIWatch - Real-time Air Quality Monitoring",
    description: "Monitor air quality with real-time data, AI-powered predictions, and comprehensive health insights",
  },
  twitter: {
    card: "summary",
    title: "AQIWatch - Real-time Air Quality Monitoring",
    description: "Monitor air quality with real-time data, AI-powered predictions, and comprehensive health insights",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="theme-color" content="#7df9ff" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
