"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useBreadcrumbStore, BreadcrumbItem } from "@/stores/useBreadcrumbStore";

type UseBreadcrumbOptions = {
  label: string;
  extra?: unknown;
};

export function useTrackBreadcrumb({ label, extra }: UseBreadcrumbOptions) {
  const pathname = usePathname();
  const { trackBreadcrumb } = useBreadcrumbStore();

  useEffect(() => {
    if (!pathname) return;
    trackBreadcrumb({ path: pathname, label, extra });
  }, [pathname, label, extra, trackBreadcrumb]);
}
