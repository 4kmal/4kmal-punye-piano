"use client"

import React, { useState, useRef, useEffect } from "react"

interface ControlKnobProps {
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
  unit?: string
}

const ControlKnob: React.FC<ControlKnobProps> = ({ label, value, min, max, onChange, unit = "" }) => {
  const [isDragging, setIsDragging] = useState(false)
  const knobRef = useRef<HTMLDivElement>(null)
  const startYRef = useRef(0)
  const startValueRef = useRef(0)
  const currentValueRef = useRef(value)

  useEffect(() => {
    currentValueRef.current = value
  }, [value])

  const normalizedValue = (value - min) / (max - min)
  const rotation = normalizedValue * 270 - 135 // -135 to +135 degrees

  const handleInteractionStart = (y: number) => {
    setIsDragging(true)
    startYRef.current = y
    startValueRef.current = value
  }

  const handleInteractionMove = (y: number) => {
    if (!isDragging) return
    const deltaY = startYRef.current - y // Inverted for natural feel
    const sensitivity = (max - min) / 100 // 100px = full range
    const newValue = Math.min(max, Math.max(min, startValueRef.current + deltaY * sensitivity))
    onChange(newValue)
  }

  const handleInteractionEnd = () => {
    setIsDragging(false)
  }

  const handleMouseDown = (e: React.MouseEvent) => handleInteractionStart(e.clientY)
  const handleMouseMove = (e: MouseEvent) => handleInteractionMove(e.clientY)
  const handleMouseUp = () => handleInteractionEnd()

  const handleTouchStart = (e: React.TouchEvent) => handleInteractionStart(e.touches[0].clientY)
  const handleTouchMove = (e: TouchEvent) => handleInteractionMove(e.touches[0].clientY)
  const handleTouchEnd = () => handleInteractionEnd()

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -1 : 1
    const sensitivity = (max - min) / 100 // Adjust sensitivity as needed
    const newValue = Math.min(
      max,
      Math.max(min, currentValueRef.current + delta * sensitivity)
    )
    onChange(newValue)
  }

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchmove", handleTouchMove)
      document.addEventListener("touchend", handleTouchEnd)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        document.removeEventListener("touchmove", handleTouchMove)
        document.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [isDragging])

  return (
    <div className="flex flex-col items-center space-y-3">
      <label className="text-sm font-medium text-slate-200">{label}</label>
      <div className="relative">
        <div
          ref={knobRef}
          className={`w-16 h-16 rounded-full border-4 border-slate-400 bg-gradient-to-br from-slate-300 to-slate-500 cursor-pointer select-none transition-all duration-150 ${
            isDragging ? "shadow-xl scale-105 border-blue-400" : "shadow-lg hover:shadow-xl hover:scale-102"
          }`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onWheel={handleWheel}
          style={{
            transform: `rotate(${rotation}deg) ${isDragging ? "scale(1.05)" : ""}`,
          }}
        >
          {/* Knob indicator */}
          <div className="absolute w-1.5 h-7 bg-white rounded-full left-1/2 top-1 transform -translate-x-1/2 shadow-md" />

          {/* Center dot */}
          <div className="absolute w-2 h-2 bg-slate-600 rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
      <div className="text-xs text-slate-300 font-mono bg-slate-700 px-2 py-1 rounded min-w-[60px] text-center">
        {value.toFixed(1)}
        {unit}
      </div>
    </div>
  )
}

export default ControlKnob
