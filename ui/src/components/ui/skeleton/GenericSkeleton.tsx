import { SkeletonBlock } from "./SkeletonBlock";

export function GenericSkeleton() {
    return (
        <div className="space-y-4">
            {/* Page header */}
            <SkeletonBlock className="h-8 w-1/3" />

            {/* Toolbar row */}
            <div className="flex space-x-2">
                <SkeletonBlock className="h-10 w-24" />
                <SkeletonBlock className="h-10 w-24" />
            </div>

            {/* Content cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SkeletonBlock className="h-40 w-full" />
                <SkeletonBlock className="h-40 w-full" />
                <SkeletonBlock className="h-40 w-full" />
            </div>
        </div>
    )
}
