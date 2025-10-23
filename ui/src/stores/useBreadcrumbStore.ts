import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createSessionStorage } from "../lib/utils/ZustandSessionStorage";

export type BreadcrumbItem = {
  path: string;
  label: string;
  extra?: unknown;
};

type BreadcrumbState = {
  trail: BreadcrumbItem[];
  trackBreadcrumb: (item: BreadcrumbItem) => void;
  goToBreadcrumb: (path: string) => void;
  resetBreadcrumbs: () => void;
};

export const useBreadcrumbStore = create<BreadcrumbState>()(
  persist(
    (set) => ({
      trail: [],
      trackBreadcrumb: (item) =>
        set((state) => {
          // Avoid adding if identical to the last breadcrumb (consecutive duplicate)
          const last = state.trail[state.trail.length - 1];
          if (
            last &&
            last.path === item.path &&
            JSON.stringify(last.extra) === JSON.stringify(item.extra)
          ) {
            return state;
          }

          const existingIndex = state.trail.findIndex(
            (b) => b.path === item.path && JSON.stringify(b.extra) === JSON.stringify(item.extra)
          );

          // If this breadcrumb already exists, treat it as navigating back/restore:
          // truncate the trail up to and including that item instead of appending.
          if (existingIndex !== -1) {
            return { trail: state.trail.slice(0, existingIndex + 1) };
          }

          // Otherwise, append as a new breadcrumb
          const newTrail = [...state.trail, item];
          return { trail: newTrail };
        }),
      goToBreadcrumb: (path) =>
        set((state) => {
          const index = state.trail.findIndex((b) => b.path === path);
          if (index === -1) return state;
          return { trail: state.trail.slice(0, index + 1) };
        }),
      resetBreadcrumbs: () => set({ trail: [] }),
    }),
    {
      name: "breadcrumb-storage",
      storage: createSessionStorage(),
    }
  )
);
