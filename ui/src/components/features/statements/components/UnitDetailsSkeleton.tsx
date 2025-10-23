"use client";

import { Skeleton } from "@/components/ui-library/ui/skeleton";
import { Card, CardContent } from "@/components/ui-library/ui/card";

export function UnitDetailsSkeleton() {
  return (
    <div className="space-y-6" data-testid="unit-details-skeleton">
      {/* Main content area with grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Main content (2/3 width) */}
        <div className="lg:col-span-2">
          <Card className="shadow-none border-0">
            <CardContent>
              {/* Breadcrumb skeleton */}
              <div className="mb-4">
                <Skeleton className="h-4 w-32 sm:w-48 bg-muted rounded" />
              </div>

              {/* Title and progress badge */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <Skeleton className="h-8 w-48 sm:w-80 bg-muted rounded" />
                <Skeleton className="h-7 w-20 sm:w-24 bg-muted rounded" />
              </div>

              {/* Description */}
              <div className="mb-4">
                <Skeleton className="h-4 w-full bg-muted rounded mb-2" />
                <Skeleton className="h-4 w-3/4 bg-muted rounded" />
              </div>

              {/* Mobile progress badge */}
              <div className="mb-6">
                <Skeleton className="h-7 w-32 bg-muted rounded-full md:hidden" />
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <Skeleton className="h-10 w-32 sm:w-40 bg-muted rounded" />
                <Skeleton className="h-10 w-10 bg-muted rounded" />
              </div>

              {/* Artifacts section */}
              <div className="space-y-6">
                {/* Study Guide artifact */}
                <div className="group rounded-2xl border border-muted dark:border-muted p-5">
                  <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <Skeleton className="h-10 w-10 bg-muted rounded-xl" />
                      <div className="min-w-0">
                        <Skeleton className="h-6 w-24 sm:w-32 bg-muted rounded mb-2" />
                        <Skeleton className="h-4 w-48 sm:w-80 bg-muted rounded mb-1" />
                        <Skeleton className="h-4 w-40 sm:w-64 bg-muted rounded" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-20 sm:w-24 bg-muted rounded" />
                  </div>

                  {/* Progress section */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <Skeleton className="h-4 w-16 bg-muted rounded" />
                      <Skeleton className="h-4 w-12 bg-muted rounded" />
                    </div>
                    <Skeleton className="h-2.5 w-full bg-muted rounded mb-2" />
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <Skeleton className="h-3 w-20 bg-muted rounded" />
                      <Skeleton className="h-3 w-24 bg-muted rounded" />
                    </div>
                  </div>
                </div>

                {/* Flashcards artifact */}
                <div className="group rounded-2xl border border-muted dark:border-muted p-5">
                  <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <Skeleton className="h-10 w-10 bg-muted rounded-xl" />
                      <div className="min-w-0">
                        <Skeleton className="h-6 w-20 sm:w-24 bg-muted rounded mb-2" />
                        <Skeleton className="h-4 w-44 sm:w-72 bg-muted rounded mb-1" />
                        <Skeleton className="h-4 w-36 sm:w-56 bg-muted rounded" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-24 sm:w-28 bg-muted rounded" />
                  </div>

                  {/* Progress section */}
                  <div className="mt-4">
                    <div className="mb-3">
                      <Skeleton className="h-6 w-24 sm:w-32 bg-muted rounded-full" />
                    </div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <Skeleton className="h-4 w-16 bg-muted rounded" />
                      <Skeleton className="h-4 w-12 bg-muted rounded" />
                    </div>
                    <Skeleton className="h-2.5 w-full bg-muted rounded mb-2" />
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <Skeleton className="h-3 w-20 bg-muted rounded" />
                      <Skeleton className="h-3 w-24 bg-muted rounded" />
                      <Skeleton className="h-3 w-22 bg-muted rounded" />
                    </div>
                  </div>
                </div>

                {/* Quiz artifact */}
                <div className="group rounded-2xl border border-muted dark:border-muted p-5">
                  <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <Skeleton className="h-10 w-10 bg-muted rounded-xl" />
                      <div className="min-w-0">
                        <Skeleton className="h-6 w-12 sm:w-16 bg-muted rounded mb-2" />
                        <Skeleton className="h-4 w-56 sm:w-88 bg-muted rounded mb-1" />
                        <Skeleton className="h-4 w-32 sm:w-52 bg-muted rounded" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-16 sm:w-20 bg-muted rounded" />
                  </div>

                  {/* Progress section */}
                  <div className="mt-4">
                    <div className="mb-3">
                      <Skeleton className="h-6 w-20 sm:w-28 bg-muted rounded-full" />
                    </div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <Skeleton className="h-4 w-16 bg-muted rounded" />
                      <Skeleton className="h-4 w-12 bg-muted rounded" />
                    </div>
                    <Skeleton className="h-2.5 w-full bg-muted rounded mb-2" />
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <Skeleton className="h-3 w-20 bg-muted rounded" />
                      <Skeleton className="h-3 w-24 bg-muted rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Sidebar (1/3 width) */}
        <div className="lg:col-span-1">
          <Card className="rounded-2xl border-0 shadow-none">
            <CardContent>
              <Skeleton className="h-6 w-32 sm:w-40 bg-muted rounded mb-4" />

              {/* File upload section */}
              <div className="space-y-4">
                <Skeleton className="bg-muted rounded-xl h-16" />
                <Skeleton className="bg-muted rounded-xl h-16" />
                <Skeleton className="bg-muted rounded-xl h-16" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
