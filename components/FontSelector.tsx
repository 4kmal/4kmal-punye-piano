"use client"

import { useFont } from "@/contexts/FontContext"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"

export const FontSelector = () => {
  const { font, setFont } = useFont()

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="font-select" className="text-sm font-medium text-slate-200">
        Font:
      </label>
      <Select value={font} onValueChange={(value) => setFont(value as "varsity" | "press-start")}>
        <SelectTrigger className="w-[180px] bg-slate-700 border-slate-600">
          <SelectValue placeholder="Select a font" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="varsity">Varsity</SelectItem>
          <SelectItem value="press-start">Press Start</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
