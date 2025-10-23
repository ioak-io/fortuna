"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTeamStore } from "@/stores/useTeamStore";
import { useBreadcrumbStore } from "@/stores/useBreadcrumbStore";
import { Card } from "@/components/ui-library/ui/card";
import { StatementFileManager } from "./components";

export function StatementsPage() {
  const router = useRouter();
  const { currentTeam } = useTeamStore();
  const pathname = usePathname();
  const { resetBreadcrumbs, trackBreadcrumb } = useBreadcrumbStore();


  // Reset and set breadcrumb for Statements list page
  useEffect(() => {
    if (!pathname) return;
    resetBreadcrumbs();
    trackBreadcrumb({ path: pathname, label: "Statements" });
  }, [pathname, resetBreadcrumbs, trackBreadcrumb]);

  return (
    <Card>
      <div className="p-4">
        <StatementFileManager />
      </div>
    </Card>
  );
}
