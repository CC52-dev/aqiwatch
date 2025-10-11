import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "AQIWatch – Real-time Air Quality Data & AI Health Insights",
  description: "Monitor air quality worldwide with AQIWatch – real-time data, AI-driven air quality predictions, and up-to-date health insights for safer living.",
  keywords: ["Air Quality", "Real-time Monitoring", "AI", "Health Insights", "AQI", "Data", "Predictions", "AQIWatch", "Air Pollution", "Environmental Health"],
  generator: "v0.app",
  metadataBase: new URL('https://aqi.watch'),
  alternates: {
    canonical: '/',
  },
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
    title: "AQIWatch – Real-time Air Quality Data & AI Health Insights",
    description: "Monitor air quality with real-time data, AI predictions and health info. Stay safe with AQIWatch.",
    url: "https://aqi.watch/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AQIWatch – Real-time Air Quality Data & AI Health Insights",
    description: "Monitor air quality with real-time data, AI predictions and health info. Stay safe with AQIWatch.",
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
        <link rel="manifest" href="/manifest.json" />
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
