"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useMousePosition } from "@/hooks/use-mouse-position"

export const CustomCursor = () => {
  const position = useMousePosition()
  const [isClicked, setIsClicked] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    // Check for touch support
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0)

    const handleMouseDown = () => setIsClicked(true)
    const handleMouseUp = () => setIsClicked(false)

    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  if (isTouchDevice || position.x < 0 || position.y < 0) {
    return null
  }

  const scale = isClicked ? 0.9 : 1

  return (
    <div
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        zIndex: 9999,
        pointerEvents: "none",
        transition: "transform 0.1s ease-out",
        transform: `translate(-50%, -50%) scale(${scale})`,
      }}
    >
      <Image
        src="/cursor/cursor-pointy.svg"
        alt="Custom Cursor"
        width={20}
        height={30}
        style={{
          transition: "opacity 0.2s ease-in-out",
          opacity: position.x > 1 ? 1 : 0,
        }}
      />
    </div>
  )
}
