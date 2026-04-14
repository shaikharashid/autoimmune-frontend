"use client"

import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  rightAction?: ReactNode
}

export function PageHeader({ title, rightAction }: PageHeaderProps) {
  const router = useRouter()

  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => router.back()}
          className="flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
          aria-label="Go back"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold text-foreground">{title}</h1>
        <div className="flex h-11 w-11 items-center justify-center">
          {rightAction}
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
    </header>
  )
}
