"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { env } from "@/lib/shared/env";
import { useHttp } from "@/lib/shared/http";
import { useTeamStore } from "@/stores/useTeamStore";
import { Button } from "@/components/ui-library/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-library/ui/card";
import { Input } from "@/components/ui-library/ui/input";
import { Loader2, Search } from "lucide-react";
import { TransactionList } from "./TransactionList";
import { Transaction } from "@/types/transaction";


type ClusterMember = {
    transaction: Transaction;
};

type ClusterResponse = {
    members: ClusterMember[];
};

export function ClustersPage() {
    const { fetch } = useHttp();
    const { currentTeam } = useTeamStore();

    const [selected, setSelected] = useState<Record<number, boolean>>({});

    const toggleSelect = (id: number) => {
        setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [cluster, setCluster] = useState<ClusterResponse | null>(null);
    const [bulkCategoryId, setBulkCategoryId] = useState<string>("");
    const [categoryByTxId, setCategoryByTxId] = useState<Record<string, string>>({});

    const members = useMemo(() => cluster?.members ?? [], [cluster]);

    const loadNextCluster = useCallback(async () => {
        if (!currentTeam?.id) return;
        try {
            setIsLoading(true);
            setError(null);
            setCluster(null);
            setCategoryByTxId({});
            setBulkCategoryId("");

            const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/fortuna/content/cluster/next`, {
                method: "GET",
                headers: {
                    "x-team": currentTeam.id,
                },
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to fetch cluster");
            }

            const data = (await res.json()) as ClusterResponse;
            setCluster(data);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "Unknown error";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, [currentTeam?.id, fetch]);

    useEffect(() => {
        if (currentTeam?.id) {
            void loadNextCluster();
        }
    }, [currentTeam?.id, loadNextCluster]);

    const applyBulkToAll = () => {
        if (!bulkCategoryId) return;
        const updated: Record<string, string> = {};
        for (const m of members) {
            updated[String(m.transaction.id)] = bulkCategoryId;
        }
        setCategoryByTxId(updated);
    };

    const onChangeCategory = (txId: number, value: string) => {
        setCategoryByTxId((prev) => ({ ...prev, [String(txId)]: value }));
    };

    const onApplyChanges = async () => {
        if (!members.length) return;

        const assignments = members
            .map((m) => ({
                transaction_id: m.transaction.id,
                category_id: categoryByTxId[String(m.transaction.id)]?.trim() || "",
            }))
            .filter((a) => a.category_id !== "");

        if (!assignments.length) {
            alert("Please set at least one category before applying.");
            return;
        }

        const payload = { assignments };
        console.log("Apply category payload:", payload);

        await loadNextCluster();
    };

    const formatAmount = (amt: string | number, currency?: string | null) => {
        const num = typeof amt === "string" ? Number(amt) : amt;
        const c = currency || "INR";
        try {
            return new Intl.NumberFormat(undefined, { style: "currency", currency: c }).format(num);
        } catch {
            return `${c} ${num.toFixed ? num.toFixed(2) : String(num)}`;
        }
    };

    return (
        <Card className="shadow-none border-0">
            <CardContent>
                {/* Page Heading */}
                <div className="flex items-center justify-between mb-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Uncategorized transactions</h1>
                        <p className="text-muted-foreground">
                            Review and assign categories to related transactions
                        </p>
                    </div>
                </div>

                {/* Bulk Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
                    <div className="relative flex-1 sm:flex-none sm:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                        <Input
                            value={bulkCategoryId}
                            onChange={(e) => setBulkCategoryId(e.target.value)}
                            placeholder="Set category ID for all"
                            className="pl-10 bg-muted/20"
                        />
                    </div>
                    <Button
                        variant="secondary"
                        onClick={applyBulkToAll}
                        disabled={!bulkCategoryId || !members.length}
                    >
                        Apply to all
                    </Button>
                    <Button onClick={onApplyChanges} disabled={!members.length || isLoading}>
                        {isLoading ? (
                            <span className="inline-flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" /> Applying...
                            </span>
                        ) : (
                            "Apply Changes"
                        )}
                    </Button>
                </div>

                {/* States */}
                {!currentTeam?.id && (
                    <div className="p-4 rounded-md bg-muted/40 border text-sm text-muted-foreground">
                        Loading team data...
                    </div>
                )}
                {error && (
                    <div className="p-4 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                        {error}
                    </div>
                )}
                {isLoading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading cluster...
                    </div>
                )}
                {!isLoading && currentTeam?.id && members.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <p className="text-lg font-medium">No more clusters</p>
                        <p className="text-sm">No related transactions available at the moment</p>
                    </div>
                )}

                {/* Transactions */}
                {!isLoading && members.length > 0 && (
                    <div className="space-y-4">
                        <TransactionList
                            transactions={members.map((m) => m.transaction)}
                            selected={selected}
                            onToggle={toggleSelect}
                            categoryByTxId={categoryByTxId}
                            onChangeCategory={onChangeCategory}
                            formatAmount={formatAmount}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
