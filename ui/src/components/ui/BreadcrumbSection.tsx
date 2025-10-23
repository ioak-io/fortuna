"use client"

import React from "react";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui-library/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui-library/ui/dropdown-menu";
import { useBreadcrumbStore } from "@/stores/useBreadcrumbStore";
import Link from "next/link";

export function BreadcrumbSection() {
  const { trail, goToBreadcrumb } = useBreadcrumbStore();
  const router = useRouter();

  // Dedupe consecutive items with the same path+extra to avoid duplicates like "Units, Units"
  const deduped = trail.filter((item, idx, arr) => {
    if (idx === 0) return true;
    const prev = arr[idx - 1];
    return !(
      prev.path === item.path &&
      JSON.stringify(prev.extra) === JSON.stringify(item.extra)
    );
  });

  // Collapse the middle items if breadcrumb is long: keep first and last two
  const shouldCollapse = deduped.length > 4;
  const first = deduped[0];
  const last = deduped[deduped.length - 1];
  const secondLast = deduped[deduped.length - 2];
  const middle = shouldCollapse ? deduped.slice(1, -2) : deduped.slice(1, -1);

  const renderItem = (item: { path: string; label: string }, isLast: boolean, index?: number) => {
    const handleClick = (e: React.MouseEvent) => {
      if (isLast || index === undefined) return; // no-op for current page
      // Calculate how many steps to go back
      const currentIndex = deduped.length - 1;
      const steps = currentIndex - index;
      if (steps > 0 && typeof window !== "undefined" && window.history.length > 0) {
        e.preventDefault();
        // Update breadcrumb trail to the target
        goToBreadcrumb(item.path);
        // Navigate back in history by N steps
        window.history.go(-steps);
      } else {
        // Fallback to replace to avoid pushing a new history entry
        e.preventDefault();
        goToBreadcrumb(item.path);
        router.replace(item.path);
      }
    };

    return (
      <BreadcrumbItem key={item.path}>
        {isLast ? (
          <BreadcrumbPage>{item.label}</BreadcrumbPage>
        ) : (
          <BreadcrumbLink asChild onClick={handleClick}>
            <Link href={item.path}>{item.label}</Link>
          </BreadcrumbLink>
        )}
      </BreadcrumbItem>
    );
  };

  return (
    <Breadcrumb className="hidden md:block">
      <BreadcrumbList>
        {/* Single item: render as current page only */}
        {deduped.length === 1 && last && renderItem(last, true, 0)}

        {/* Multiple items */}
        {deduped.length > 1 && (
          <React.Fragment>
            {/* First */}
            {first && renderItem(first, false, 0)}
            <BreadcrumbSeparator />

            {/* Middle */}
            {!shouldCollapse &&
              middle.map((item, idx) => (
                <React.Fragment key={`mid-${item.path}-${idx}`}>
                  {renderItem(item, false, idx + 1)}
                  <BreadcrumbSeparator />
                </React.Fragment>
              ))}

            {shouldCollapse && (
              <BreadcrumbItem>
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none">
                    <BreadcrumbEllipsis />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {middle.map((item, idx) => {
                      const index = idx + 1; // hidden middle indices start at 1
                      const onClick = (e: React.MouseEvent) => {
                        // Same navigation behavior as visible crumbs
                        const currentIndex = deduped.length - 1;
                        const steps = currentIndex - index;
                        if (steps > 0 && typeof window !== "undefined" && window.history.length > 0) {
                          e.preventDefault();
                          goToBreadcrumb(item.path);
                          window.history.go(-steps);
                        } else {
                          e.preventDefault();
                          goToBreadcrumb(item.path);
                          router.replace(item.path);
                        }
                      };
                      return (
                        <DropdownMenuItem key={item.path} asChild onClick={onClick}>
                          <Link href={item.path}>{item.label}</Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
            )}

            {shouldCollapse && <BreadcrumbSeparator />}

            {/* Second last if collapsed */}
            {shouldCollapse && secondLast && (
              <React.Fragment key={`second-last-${secondLast.path}`}>
                {renderItem(secondLast, false, deduped.length - 2)}
                <BreadcrumbSeparator />
              </React.Fragment>
            )}

            {/* Last */}
            {last && renderItem(last, true, deduped.length - 1)}
          </React.Fragment>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
