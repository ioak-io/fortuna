"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui-library/ui/card";
import {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui-library/ui/table";
import { cn } from "@/components/ui-library/utils";
import { Table } from "./table";

export type DataListProps<T> = {
    data: T[];
    columns: {
        key: keyof T;
        label: string;
        render?: (item: T) => React.ReactNode;
        className?: string;
        align?: "left" | "center" | "right";
    }[];
    idKey: keyof T; // unique identifier
    onRowClick?: (item: T) => void; // optional row click handler
};

export function DataList<T extends Record<string, any>>({
    data,
    columns,
    idKey,
    onRowClick,
}: DataListProps<T>) {
    return (
        <div className="w-full">
            {/* Mobile View -> Cards */}
            <div className="space-y-4 sm:hidden" role="list">
                {data.length === 0 ? (
                    <Card role="listitem" className="rounded-2xl shadow-sm">
                        <CardContent className="p-6 text-center text-muted-foreground">
                            No records found.
                        </CardContent>
                    </Card>
                ) : (
                    data.map((item, index) => (
                        <Card
                            role="listitem"
                            key={String(item[idKey]) || index}
                            className={cn(
                                "rounded-2xl shadow-sm",
                                onRowClick && "cursor-pointer hover:bg-muted/50"
                            )}
                            onClick={() => onRowClick?.(item)}
                        >
                            <CardContent className="p-4 space-y-2">
                                {columns.map((col) => (
                                    <div
                                        key={String(col.key)}
                                        className="flex justify-between text-sm"
                                    >
                                        <span className="font-medium text-muted-foreground">
                                            {col.label}
                                        </span>
                                        <span
                                            className="whitespace-normal break-words text-right"
                                        >
                                            {col.render ? col.render(item) : String(item[col.key])}
                                        </span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Desktop View -> Table */}
            <div className="hidden sm:block">
                <Table containerClassName="overflow-x-auto w-0 min-w-[100%]">
                    <TableHeader>
                        <TableRow>
                            {columns.map((col, index) => (
                                <TableHead
                                    key={String(col.key) || index}
                                    className={cn(
                                        col.align === "center" && "text-center",
                                        col.align === "right" && "text-right",
                                    )}
                                >
                                    {col.label}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="text-center text-muted-foreground"
                                >
                                    No records found
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item) => (
                                <TableRow
                                    key={String(item[idKey])}
                                    onClick={() => onRowClick?.(item)}
                                    className={cn(
                                        onRowClick && "cursor-pointer hover:bg-muted/50"
                                    )}
                                >
                                    {columns.map((col) => (
                                        <TableCell
                                            key={String(col.key)}
                                            className={cn(
                                                "whitespace-normal break-words",
                                                col.className,
                                                col.align === "center" && "text-center",
                                                col.align === "right" && "text-right",
                                            )}
                                        >
                                            {col.render ? col.render(item) : String(item[col.key])}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
