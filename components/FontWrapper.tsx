"use client"

import { useFont } from "@/contexts/FontContext"
import { cn } from "@/lib/utils"
import React from "react"

export function FontWrapper({ children }: { children: React.ReactNode }) {
  const { font } = useFont()
  return <div className={cn(font === "press-start" ? "font-press-start" : "font-sans")}>{children}</div>
}
