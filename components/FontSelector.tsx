"use client"

import { useFont } from "@/contexts/FontContext"
import { useState, useRef, useLayoutEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const fonts = [
  { id: "varsity", title: "Varsity" },
  { id: "press-start", title: "Press Start" },
]

export const FontSelector = () => {
  const { font: selected, setFont } = useFont()
  const [dimensions, setDimensions] = useState({ width: 0, left: 0 })

  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const updateDimensions = () => {
      const selectedButton = buttonRefs.current.get(selected)
      const container = containerRef.current

      if (selectedButton && container) {
        const rect = selectedButton.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()

        setDimensions({
          width: rect.width,
          left: rect.left - containerRect.left,
        })
      }
    }

    requestAnimationFrame(updateDimensions)

    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [selected])

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-200">Font:</span>
      <div
        ref={containerRef}
        role="tablist"
        className="relative flex items-center p-1 bg-slate-700/50 rounded-full border border-slate-600"
      >
        <motion.div
          className="skeuomorphic-button primary absolute"
          initial={false}
          animate={{
            width: dimensions.width,
            x: dimensions.left,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
          style={{ height: "calc(100% - 8px)", top: "4px", padding: 0 }}
        />

        <div className="flex relative z-[1] gap-1">
          {fonts.map((item) => {
            const isSelected = selected === item.id
            return (
              <button
                key={item.id}
                ref={(el) => {
                  if (el) buttonRefs.current.set(item.id, el)
                  else buttonRefs.current.delete(item.id)
                }}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setFont(item.id as "varsity" | "press-start")}
                className={cn(
                  "relative flex items-center justify-center rounded-full px-4 py-1.5",
                  "text-sm font-medium transition-colors duration-300",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
                  isSelected
                    ? "text-white"
                    : "text-slate-300 hover:text-white"
                )}
                style={{
                  textShadow: "none",
                }}
              >
                <span className="truncate">{item.title}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
