"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { Maximize, Minimize } from "lucide-react"
import "./Piano.css"

interface PianoProps {
  onNotePlay: (frequency: number, note: string) => void
  onNoteStop: (note: string) => void
}

const Piano: React.FC<PianoProps> = ({ onNotePlay, onNoteStop }) => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())
  const [isKeyPressed, setIsKeyPressed] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [draggedKey, setDraggedKey] = useState<string | null>(null)
  const lastNotePlayed = useRef<string | null>(null)
  const pianoContainerRef = useRef<HTMLDivElement>(null)
  const [isFullScreen, setIsFullScreen] = useState(false)

  // Note frequencies for one octave starting from C4 with keyboard mappings
  const notes = [
    { note: "C4", frequency: 261.63, type: "white", position: 0, key: "a" },
    { note: "C#4", frequency: 277.18, type: "black", position: 0, key: "w" }, // Between C and D
    { note: "D4", frequency: 293.66, type: "white", position: 1, key: "s" },
    { note: "D#4", frequency: 311.13, type: "black", position: 1, key: "e" }, // Between D and E
    { note: "E4", frequency: 329.63, type: "white", position: 2, key: "d" },
    { note: "F4", frequency: 349.23, type: "white", position: 3, key: "f" },
    { note: "F#4", frequency: 369.99, type: "black", position: 3, key: "t" }, // Between F and G
    { note: "G4", frequency: 392.0, type: "white", position: 4, key: "g" },
    { note: "G#4", frequency: 415.3, type: "black", position: 4, key: "y" }, // Between G and A
    { note: "A4", frequency: 440.0, type: "white", position: 5, key: "h" },
    { note: "A#4", frequency: 466.16, type: "black", position: 5, key: "u" }, // Between A and B
    { note: "B4", frequency: 493.88, type: "white", position: 6, key: "j" },
  ]

  // Duplicate for second octave with different keyboard mappings
  const allNotes = [
    ...notes,
    ...notes.map((note) => ({
      ...note,
      note: note.note.replace("4", "5"),
      frequency: note.frequency * 2,
      position: note.position + 7,
      key:
        note.key === "a"
          ? "k"
          : note.key === "w"
            ? "o"
            : note.key === "s"
              ? "l"
              : note.key === "e"
                ? "p"
                : note.key === "d"
                  ? ";"
                  : note.key === "f"
                    ? "'"
                    : note.key === "t"
                      ? "]"
                      : note.key === "g"
                        ? "Enter"
                        : note.key === "y"
                          ? "\\"
                          : note.key === "h"
                            ? "z"
                            : note.key === "u"
                              ? "x"
                              : note.key === "j"
                                ? "c"
                                : note.key,
    })),
  ]

  const whiteKeys = allNotes.filter((note) => note.type === "white")
  const blackKeys = allNotes.filter((note) => note.type === "black")

  // Create a map for quick keyboard lookup
  const keyboardMap = new Map(allNotes.map((note) => [note.key.toLowerCase(), note]))

  const handleNotePlay = (note: string, frequency: number) => {
    onNotePlay(frequency, note)
    lastNotePlayed.current = note
    setIsKeyPressed(note)
  }

  const handleNoteStop = (note: string) => {
    onNoteStop(note)
    setIsKeyPressed(null)
  }

  const handleMouseDown = (note: string, frequency: number, keyboardKey: string) => {
    setIsDragging(true)
    setDraggedKey(keyboardKey)
    handleNotePlay(note, frequency)
  }

  const handleMouseEnter = (note: string, frequency: number, keyboardKey: string) => {
    if (isDragging) {
      if (lastNotePlayed.current && lastNotePlayed.current !== note) {
        handleNoteStop(lastNotePlayed.current)
      }
      handleNotePlay(note, frequency)
      setDraggedKey(keyboardKey)
    }
  }

  const toggleFullScreen = async () => {
    const elem = pianoContainerRef.current

    if (!elem) return

    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }

    if (!document.fullscreenElement) {
      try {
        await elem.requestFullscreen()
        if (screen.orientation && typeof screen.orientation.lock === "function") {
          await screen.orientation.lock("landscape")
        }
      } catch (err) {
        console.error("Error attempting to enable full-screen mode:", err)
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen()
      }
    }

    document.addEventListener("fullscreenchange", handleFullScreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange)
    }
  }

  // Function to calculate black key position more accurately
  const getBlackKeyPosition = (blackKey: any) => {
    const whiteKeyWidth = 48
    const blackKeyWidth = 30
    const whiteKeySpacing = 50

    // Position black keys between white keys with proper spacing
    const basePosition = blackKey.position * whiteKeySpacing
    // Offset by about 2/3 of white key width to position between white keys
    const offset = whiteKeyWidth * 0.65
    const leftPosition = basePosition + offset - blackKeyWidth / 2

    return leftPosition
  }

  // Keyboard and global mouse event handlers
  useEffect(() => {
    const handleInteractionEnd = () => {
      if (isDragging) {
        setIsDragging(false)
        if (lastNotePlayed.current) {
          handleNoteStop(lastNotePlayed.current)
          lastNotePlayed.current = null
        }
        setDraggedKey(null)
      }
    }

    const handleKeyboardDown = (event: KeyboardEvent) => {
      // Prevent default behavior for certain keys
      if (["Space", "Enter", "Tab"].includes(event.code)) {
        event.preventDefault()
      }

      const key = event.key.toLowerCase()
      const keyCode = event.code.toLowerCase()

      // Handle special keys
      let mappedKey = key
      if (keyCode === "enter") mappedKey = "Enter"
      if (keyCode === "semicolon") mappedKey = ";"
      if (keyCode === "quote") mappedKey = "'"
      if (keyCode === "bracketright") mappedKey = "]"
      if (keyCode === "backslash") mappedKey = "\\"

      const noteData = keyboardMap.get(mappedKey)
      if (noteData && !pressedKeys.has(mappedKey)) {
        setPressedKeys((prev) => new Set(prev).add(mappedKey))
        handleNotePlay(noteData.note, noteData.frequency)
      }
    }

    const handleKeyboardUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      const keyCode = event.code.toLowerCase()

      // Handle special keys
      let mappedKey = key
      if (keyCode === "enter") mappedKey = "Enter"
      if (keyCode === "semicolon") mappedKey = ";"
      if (keyCode === "quote") mappedKey = "'"
      if (keyCode === "bracketright") mappedKey = "]"
      if (keyCode === "backslash") mappedKey = "\\"

      const noteData = keyboardMap.get(mappedKey)
      if (noteData) {
        setPressedKeys((prev) => {
          const newSet = new Set(prev)
          newSet.delete(mappedKey)
          return newSet
        })
        handleNoteStop(noteData.note)
      }
    }

    window.addEventListener("keydown", handleKeyboardDown)
    window.addEventListener("keyup", handleKeyboardUp)
    window.addEventListener("mouseup", handleInteractionEnd)
    window.addEventListener("touchend", handleInteractionEnd)

    return () => {
      window.removeEventListener("keydown", handleKeyboardDown)
      window.removeEventListener("keyup", handleKeyboardUp)
      window.removeEventListener("mouseup", handleInteractionEnd)
      window.removeEventListener("touchend", handleInteractionEnd)
    }
  }, [pressedKeys, isDragging])

  // Check if a key is currently pressed (for visual feedback)
  const isKeyCurrentlyPressed = (keyboardKey: string) => {
    return pressedKeys.has(keyboardKey.toLowerCase()) || draggedKey === keyboardKey
  }

  return (
    <div
      ref={pianoContainerRef}
      className={cn(
        "relative mx-auto overflow-x-auto bg-slate-800 piano-container",
        isFullScreen && "fullscreen-piano"
      )}
      style={{ maxWidth: "100vw", height: "220px" }}
    >
      <button
        onClick={toggleFullScreen}
        className="absolute top-2 right-2 z-10 p-2 rounded-full bg-slate-700/50 text-white hover:bg-slate-600/80 transition-colors"
        aria-label="Toggle Fullscreen"
      >
        {typeof document !== "undefined" && document.fullscreenElement ? (
          <Minimize className="w-5 h-5" />
        ) : (
          <Maximize className="w-5 h-5" />
        )}
      </button>
      <div className="relative piano-keys" style={{ width: "700px", height: "200px" }}>
        {/* White keys */}
        {whiteKeys.map((key) => (
          <button
            key={key.note}
            className={`absolute border-2 transition-all duration-100 rounded-b-lg shadow-lg ${
              isKeyCurrentlyPressed(key.key)
                ? "bg-slate-300 border-slate-400 shadow-inner transform translate-y-1"
                : "bg-white border-slate-300 active:bg-slate-200"
            }`}
            style={{
              left: `${key.position * 50}px`,
              width: "48px",
              height: "200px",
              zIndex: 1,
            }}
            onMouseDown={() => handleMouseDown(key.note, key.frequency, key.key)}
            onMouseEnter={() => handleMouseEnter(key.note, key.frequency, key.key)}
            onTouchStart={() => handleMouseDown(key.note, key.frequency, key.key)}
            onTouchEnd={() => {
              /* Touch up is handled by the global mouseup/touchend */
            }}
          >
            <span className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-slate-600">
              {key.note.replace(/[0-9]/g, "")}
            </span>
            <span className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-xs text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded border">
              {key.key === "Enter" ? "↵" : key.key.toUpperCase()}
            </span>
          </button>
        ))}

        {/* Black keys */}
        {blackKeys.map((key) => (
          <button
            key={key.note}
            className={`absolute transition-all duration-100 rounded-b-lg shadow-xl ${
              isKeyCurrentlyPressed(key.key)
                ? "bg-slate-600 border-2 border-slate-500 shadow-inner transform translate-y-1"
                : "bg-slate-900 active:bg-slate-700 border-2 border-slate-700"
            }`}
            style={{
              left: `${getBlackKeyPosition(key)}px`,
              width: "30px",
              height: "120px",
              zIndex: 2,
            }}
            onMouseDown={() => handleMouseDown(key.note, key.frequency, key.key)}
            onMouseEnter={() => handleMouseEnter(key.note, key.frequency, key.key)}
            onTouchStart={() => handleMouseDown(key.note, key.frequency, key.key)}
            onTouchEnd={() => {
              /* Touch up is handled by the global mouseup/touchend */
            }}
          >
            <span className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-xs text-white font-mono bg-slate-800 px-1 py-0.5 rounded border border-slate-600">
              {key.key.toUpperCase()}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Piano
