import type React from "react"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { CustomCursor } from "@/components/CustomCursor"
import { Analytics } from "@vercel/analytics/react"
import localFont from "next/font/local"
import { FontProvider } from "@/contexts/FontContext"
import { FontWrapper } from "@/components/FontWrapper"

import "./globals.css"
import "@/styles/retro-button.css" // Import retro button styles
import "@/styles/skeuomorphic-button.css"
import "@/styles/skeuomorphic-card.css"

const varsityFont = localFont({
  src: "../public/fonts/varsity.ttf",
  display: "swap",
  variable: "--font-varsity",
})

const pressStartFont = localFont({
  src: "../public/fonts/press-start.ttf",
  display: "swap",
  variable: "--font-press-start",
})

export const metadata: Metadata = {
  title: "MIDI Controller - Web Synth",
  description: "A web-based synthesizer with realistic piano sounds, built with Next.js and the Web Audio API.",
  icons: [{ rel: "icon", url: "/favicon.png" }],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          varsityFont.variable,
          pressStartFont.variable
        )}
      >
        <FontProvider>
          <FontWrapper>
            <div className="relative z-0">
              <CustomCursor />
              {children}
            </div>
            <Analytics />
          </FontWrapper>
        </FontProvider>
      </body>
    </html>
  )
}
