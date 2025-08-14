import React from "react"
import { cn } from "@/lib/utils"

interface SkeuomorphicCardProps {
  children: React.ReactNode
  className?: string
}

export const SkeuomorphicCard = ({ children, className }: SkeuomorphicCardProps) => {
  return <div className={cn("skeuomorphic-card", className)}>{children}</div>
}
