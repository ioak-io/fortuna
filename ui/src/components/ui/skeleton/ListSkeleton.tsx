"use client";

import { Skeleton } from "@/components/ui-library/ui/skeleton";
import { cn } from "@/components/ui-library/utils";

type ListSkeletonProps = {
    count?: number;
    itemClassName?: string;
    gapClassName?: string;
    randomWidths?: boolean;
};

const WIDTH_CHOICES = ["w-3/4", "w-2/3", "w-4/5", "w-1/2", "w-full"];

function pseudoRandom(index: number): number {
    // Simple deterministic pseudo-random: gives same result on server & client
    const x = Math.sin(index + 1) * 10000;
    return x - Math.floor(x);
}

export function ListSkeleton({
    count = 5,
    itemClassName = "h-10",
    gapClassName = "gap-2",
    randomWidths = false,
}: ListSkeletonProps) {
    return (
        <div className={cn("flex flex-col", gapClassName)} data-testid="list-skeleton">
            {Array.from({ length: count }).map((_, idx) => {
                const widthClass = randomWidths
                    ? WIDTH_CHOICES[Math.floor(pseudoRandom(idx) * WIDTH_CHOICES.length)]
                    : "w-full";

                return (
                    <Skeleton
                        key={idx}
                        className={cn("rounded-md animate-pulse bg-muted", itemClassName, widthClass)}
                    />
                );
            })}
        </div>
    );
}