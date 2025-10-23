"use client";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui-library/ui/pagination";
import { cn } from "../ui-library/utils";

type PaginationControlsProps = {
    page: number;
    totalPages: number;
    isFetching?: boolean;
    className?: string;
    onPageChange: (page: number) => void;
};

export function PaginationControls({
    page,
    totalPages,
    isFetching = false,
    className,
    onPageChange,
}: PaginationControlsProps) {
    const isPrevDisabled = page === 1 || isFetching;
    const isNextDisabled = page === totalPages || isFetching;

    const getVisiblePages = () => {
        const pages: (number | "ellipsis")[] = [];
        const delta = 2; // how many neighbors around current

        const range = (start: number, end: number) =>
            Array.from({ length: end - start + 1 }, (_, i) => start + i);

        if (totalPages <= 7) {
            return range(1, totalPages);
        }

        const left = Math.max(2, page - delta);
        const right = Math.min(totalPages - 1, page + delta);

        pages.push(1);

        if (left > 2) {
            pages.push("ellipsis");
        }

        pages.push(...range(left, right));

        if (right < totalPages - 1) {
            pages.push("ellipsis");
        }

        pages.push(totalPages);

        return pages;
    };

    const visiblePages = getVisiblePages();

    return (
        <Pagination className={cn(className)}>
            <PaginationContent>
                <PaginationItem>
                    {isPrevDisabled ? (
                        <span className="opacity-50 cursor-default">
                            <PaginationPrevious />
                        </span>
                    ) : (
                        <span className="cursor-default">
                            <PaginationPrevious onClick={() => onPageChange(page - 1)} />
                        </span>
                    )}
                </PaginationItem>

                {visiblePages.map((pn, idx) =>
                    pn === "ellipsis" ? (
                        <PaginationItem key={`ellipsis-${idx}`}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={pn}>
                            <span className="cursor-default">
                                <PaginationLink
                                    onClick={() => onPageChange(pn)}
                                    isActive={pn === page}
                                >
                                    {pn}
                                </PaginationLink>
                            </span>
                        </PaginationItem>
                    )
                )}

                <PaginationItem>
                    {isNextDisabled ? (
                        <span className="opacity-50 cursor-default">
                            <PaginationNext />
                        </span>
                    ) : (
                        <span className="cursor-default">
                            <PaginationNext onClick={() => onPageChange(page + 1)} />
                        </span>
                    )}
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
