"use client"

import { Skeleton } from "@/components/ui-library/ui/skeleton"
import { cn } from "@/components/ui-library/utils"

export function SkeletonBlock({ className }: { className?: string }) {
  return (
    <Skeleton
      className={cn(
        "rounded-md bg-muted",
        className
      )}
    />
  )
}
