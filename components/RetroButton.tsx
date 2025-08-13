"use client"

import { cn } from "@/lib/utils"
import React, { useRef, useEffect } from "react"

interface RetroButtonProps {
  label: string
  onClick?: () => void
  variant?: "primary" | "secondary" | "danger" | "warning" | "success" | "info"
  size?: "sm" | "lg"
  className?: string
}

export const RetroButton = ({ label, onClick, variant, size, className }: RetroButtonProps) => {
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const btn = btnRef.current
    if (!btn) return

    const handleMouseDown = () => btn.classList.add("btn-active")
    const handleMouseUp = () => btn.classList.remove("btn-active")
    const handleMouseLeave = () => btn.classList.remove("btn-center", "btn-right", "btn-left", "btn-active")

    const handleMouseMove = (e: MouseEvent) => {
      const leftOffset = btn.getBoundingClientRect().left
      const btnWidth = btn.offsetWidth
      const myPosX = e.pageX
      let newClass = ""

      if (myPosX < leftOffset + 0.3 * btnWidth) {
        newClass = "btn-left"
      } else if (myPosX > leftOffset + 0.65 * btnWidth) {
        newClass = "btn-right"
      } else {
        newClass = "btn-center"
      }

      const clearedClassList = (btn.className.replace(/btn-center|btn-right|btn-left/gi, "").trim())
      btn.className = `${clearedClassList} ${newClass}`
    }

    btn.addEventListener("mousedown", handleMouseDown)
    btn.addEventListener("mouseup", handleMouseUp)
    btn.addEventListener("mouseleave", handleMouseLeave)
    btn.addEventListener("mousemove", handleMouseMove)

    return () => {
      btn.removeEventListener("mousedown", handleMouseDown)
      btn.removeEventListener("mouseup", handleMouseUp)
      btn.removeEventListener("mouseleave", handleMouseLeave)
      btn.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div
      role="button"
      className={cn("retro-btn", variant, size, className)}
      onClick={onClick}
    >
      <button className="btn" ref={btnRef}>
        <span className="btn-inner">
          <span className="content-wrapper">
            <span className="btn-content">
              <span className="btn-content-inner" data-label={label} />
            </span>
          </span>
        </span>
      </button>
    </div>
  )
}
