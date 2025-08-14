"use client"

import React, { useRef, useEffect } from "react"

interface AudioVisualizerProps {
  analyser: AnalyserNode | null
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ analyser }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!analyser) return

    const canvas = canvasRef.current
    const canvasCtx = canvas?.getContext("2d")
    let animationFrameId: number

    const draw = () => {
      if (!canvas || !canvasCtx) return

      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      analyser.getByteTimeDomainData(dataArray)

      canvasCtx.fillStyle = "rgb(30, 41, 59)" // slate-800
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height)

      canvasCtx.lineWidth = 2
      canvasCtx.strokeStyle = "rgb(128, 128, 128)"

      canvasCtx.beginPath()

      const sliceWidth = (canvas.width * 1.0) / bufferLength
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0
        const y = (v * canvas.height) / 2

        if (i === 0) {
          canvasCtx.moveTo(x, y)
        } else {
          canvasCtx.lineTo(x, y)
        }

        x += sliceWidth
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2)
      canvasCtx.stroke()
      animationFrameId = requestAnimationFrame(draw)
    }

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = canvasRef.current.offsetWidth
      }
      draw()
    }

    window.addEventListener("resize", handleResize)
    handleResize() // Initial draw

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
    }
  }, [analyser])

  return <canvas ref={canvasRef} height="80" className="w-full rounded-lg bg-black/30 backdrop-blur-sm" />
}

export default AudioVisualizer
