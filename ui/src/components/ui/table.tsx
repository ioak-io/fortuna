"use client"

import * as React from "react"

import { cn } from "@/components/ui-library/utils"


type TableProps = React.ComponentProps<"table"> & {
  containerClassName?: string;
};

function Table({ containerClassName, className, ...props }: TableProps) {
  return (
    <div
      data-slot="table-container"
      className={cn("relative w-full overflow-x-auto", containerClassName)}
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

export {
  Table
}
