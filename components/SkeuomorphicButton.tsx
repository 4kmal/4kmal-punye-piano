"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface SkeuomorphicButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  variant?: "primary" | "danger"
}

export const SkeuomorphicButton = ({
  children,
  onClick,
  className,
  disabled,
  variant,
}: SkeuomorphicButtonProps) => {
  return (
    <button
      className={cn("skeuomorphic-button", variant, className)}
      onClick={onClick}
      disabled={disabled}
    >
      <span>{children}</span>
    </button>
  )
}
