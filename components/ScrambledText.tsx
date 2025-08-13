"use client"

import { useScramble } from "use-scramble"

interface ScrambledTextProps {
  text: string
  playOnMount?: boolean
  className?: string
}

export const ScrambledText = ({ text, playOnMount = true, className }: ScrambledTextProps) => {
  const { ref, replay } = useScramble({
    text,
    speed: 0.5,
    tick: 1,
    step: 1,
    scramble: 5,
    seed: 42,
    chance: 0.8,
    overdrive: false,
    playOnMount,
  })

  return <span className={className} ref={ref} onMouseOver={replay} />
}
