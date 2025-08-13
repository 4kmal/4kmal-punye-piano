import type React from "react"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { GeistSans } from "geist/font/sans"
import { CustomCursor } from "@/components/CustomCursor"

import "./globals.css"
import "@/styles/retro-button.css" // Import retro button styles

const inter = Inter({ subsets: ["latin"] })

// If the font is available from Google Fonts, you can import it like this:
import { Press_Start_2P } from "next/font/google"

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-press-start-2p",
})

export const metadata: Metadata = {
  title: "MIDI Controller - Web Synthesizer",
  description: "A web-based MIDI controller with realistic piano sounds and synthesizer capabilities",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          GeistSans.className,
          pressStart2P.variable
        )}
      >
        <div className="relative z-0">
          <CustomCursor />
          {children}
        </div>
      </body>
    </html>
  )
}
