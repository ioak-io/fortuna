"use client";

import { Skeleton } from "@/components/ui-library/ui/skeleton";

type TeamMembersSkeletonProps = {
  count?: number;
};

export function TeamMembersSkeleton({ count = 3 }: TeamMembersSkeletonProps) {
  return (
    <div className="space-y-3" data-testid="team-members-skeleton">
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index} 
          className="flex items-center justify-between p-4 border rounded-lg bg-card animate-pulse"
        >
          {/* Left side - Avatar and text */}
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full bg-muted" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 bg-muted rounded" />
              <Skeleton className="h-3 w-48 bg-muted rounded" />
            </div>
          </div>
          
          {/* Right side - Actions */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-32 bg-muted rounded" />
            <Skeleton className="size-9 bg-muted rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
