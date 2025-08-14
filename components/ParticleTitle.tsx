"use client"

import { useRef, useEffect, useState } from "react"

interface ParticleTitleProps {
  text: string
}

export default function ParticleTitle({ text }: ParticleTitleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const isTouchingRef = useRef(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let particles: {
      x: number
      y: number
      baseX: number
      baseY: number
      size: number
      color: string
      life: number
    }[] = []

    let textImageData: ImageData | null = null

    const createTextImage = () => {
      if (!ctx || !canvas) return

      const dpr = window.devicePixelRatio || 1
      const fontSize = isMobile ? 48 : 72 // Increased mobile font size
      ctx.font = `bold ${fontSize * dpr}px "Geist Sans", sans-serif`

      const textMetrics = ctx.measureText(text)
      const textWidth = textMetrics.width
      const textHeight = fontSize * 1.5 // Approximate height

      canvas.width = textWidth * dpr
      canvas.height = textHeight * dpr
      canvas.style.width = `${textWidth}px`
      canvas.style.height = `${textHeight}px`

      ctx.font = `bold ${fontSize * dpr}px "Geist Sans", sans-serif`
      ctx.textBaseline = "middle"
      ctx.textAlign = "center" // Center align the text

      const greenPart = "10x"
      const textParts = text.split(greenPart)

      const firstPartWidth = ctx.measureText(textParts[0]).width
      const greenPartWidth = ctx.measureText(greenPart).width

      const totalWidth = ctx.measureText(text).width
      let currentX = (canvas.width - totalWidth) / 2

      // Draw first part (white)
      ctx.fillStyle = "white"
      ctx.fillText(textParts[0], currentX + firstPartWidth / 2, canvas.height / 2)
      currentX += firstPartWidth

      // Draw green part
      ctx.fillStyle = "#00E6AE" // A nice green color
      ctx.fillText(greenPart, currentX + greenPartWidth / 2, canvas.height / 2)
      currentX += greenPartWidth

      // Draw second part (white)
      if (textParts[1]) {
        const secondPartWidth = ctx.measureText(textParts[1]).width
        ctx.fillStyle = "white"
        ctx.fillText(textParts[1], currentX + secondPartWidth / 2, canvas.height / 2)
      }

      textImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    const createParticle = () => {
      if (!ctx || !canvas || !textImageData) return null

      const data = textImageData.data
      const dpr = window.devicePixelRatio || 1

      for (let attempt = 0; attempt < 100; attempt++) {
        const x = Math.floor(Math.random() * canvas.width)
        const y = Math.floor(Math.random() * canvas.height)

        const index = (y * canvas.width + x) * 4

        if (data[index + 3] > 128) {
          // Check if the pixel is green
          const isGreen = data[index] < 50 && data[index + 1] > 200 && data[index + 2] > 150
          return {
            x: x / dpr,
            y: y / dpr,
            baseX: x / dpr,
            baseY: y / dpr,
            size: isMobile ? Math.random() * 2 + 1.2 : Math.random() * 1.5 + 1, // Larger particles on mobile
            color: isGreen ? "#00E6AE" : "white",
            life: Math.random() * 100 + 50,
          }
        }
      }

      return null
    }

    const createInitialParticles = () => {
      const density = isMobile ? 0.8 : 1 // Increased mobile density
      const baseParticleCount = 4000 * density
      const particleCount = Math.floor(
        baseParticleCount * ((canvas.width * canvas.height) / (1920 * 120))
      )
      particles = []
      for (let i = 0; i < particleCount; i++) {
        const particle = createParticle()
        if (particle) particles.push(particle)
      }
    }

    let animationFrameId: number

    const animate = () => {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const { x: mouseX, y: mouseY } = mousePositionRef.current
      const maxDistance = isMobile ? 60 : 100
      const dpr = window.devicePixelRatio || 1

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const dx = mouseX - p.x
        const dy = mouseY - p.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < maxDistance && (isTouchingRef.current || !("ontouchstart" in window))) {
          const force = (maxDistance - distance) / maxDistance
          const angle = Math.atan2(dy, dx)
          const moveX = Math.cos(angle) * force * 20
          const moveY = Math.sin(angle) * force * 20
          p.x = p.baseX - moveX
          p.y = p.baseY - moveY
        } else {
          p.x += (p.baseX - p.x) * 0.1
          p.y += (p.baseY - p.y) * 0.1
        }

        ctx.fillStyle = p.color
        ctx.fillRect(p.x * dpr, p.y * dpr, p.size * dpr, p.size * dpr)

        p.life--
        if (p.life <= 0) {
          const newParticle = createParticle()
          if (newParticle) {
            particles[i] = newParticle
          } else {
            particles.splice(i, 1)
            i--
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    const init = () => {
      setIsMobile(window.innerWidth < 768)
      createTextImage()
      createInitialParticles()
      animate()
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      createTextImage()
      createInitialParticles()
    }

    const handleMove = (x: number, y: number) => {
      const rect = canvas.getBoundingClientRect()
      mousePositionRef.current = { x: x - rect.left, y: y - rect.top }
    }

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault()
        handleMove(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    const handleTouchStart = () => {
      isTouchingRef.current = true
    }

    const handleTouchEnd = () => {
      isTouchingRef.current = false
      mousePositionRef.current = { x: -9999, y: -9999 }
    }

    const handleMouseLeave = () => {
      if (!("ontouchstart" in window)) {
        mousePositionRef.current = { x: -9999, y: -9999 }
      }
    }

    init()

    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("touchmove", handleTouchMove, { passive: false })
    window.addEventListener("mouseleave", handleMouseLeave)
    canvas.addEventListener("touchstart", handleTouchStart)
    canvas.addEventListener("touchend", handleTouchEnd)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      canvas.removeEventListener("touchstart", handleTouchStart)
      canvas.removeEventListener("touchend", handleTouchEnd)
      cancelAnimationFrame(animationFrameId)
    }
  }, [text, isMobile])

  return (
    <div className="relative w-full flex items-center justify-center -mb-8 pointer-events-none">
      <canvas
        ref={canvasRef}
        className="touch-none"
        aria-label={`Interactive particle effect for text: ${text}`}
      />
    </div>
  )
}
