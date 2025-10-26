"use client";

import { useEffect, useMemo, useState } from "react";
import { useHttp } from "@/lib/shared/http";
import type { Category, CreateCategoryPayload, UpdateCategoryPayload } from "@/types/category";
import { useTeamStore } from "@/stores/useTeamStore";
import { useCategories, useCreateCategory, useDeleteCategory, useUpdateCategory } from "@/hooks/useCategories";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-library/ui/card";
import { Button } from "@/components/ui-library/ui/button";
import { Input } from "@/components/ui-library/ui/input";
import { Label } from "@/components/ui-library/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui-library/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui-library/ui/dialog";
import { Spinner } from "@/components/ui-library/ui/spinner";
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react";

export function CategoriesPage() {
    const { currentTeam } = useTeamStore();
    const { data: categories = [], isLoading, error, isFetching, refetch } = useCategories(currentTeam?.id || undefined);
    const createMutation = useCreateCategory(currentTeam?.id || undefined);
    const updateMutation = useUpdateCategory(currentTeam?.id || undefined);
    const deleteMutation = useDeleteCategory(currentTeam?.id || undefined);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createForm, setCreateForm] = useState<CreateCategoryPayload>({ name: "", description: "", icon: "tag", color: "#64748b", team_id: currentTeam?.id || "" });
    const [isSaving, setIsSaving] = useState(false);

    const [editTarget, setEditTarget] = useState<Category | null>(null);
    const [editForm, setEditForm] = useState<UpdateCategoryPayload>({});

    useEffect(() => {
        // ensure query runs when team changes; useCategories already handles enabled
    }, [currentTeam?.id || undefined]);

    const onCreate = async () => {
        try {
            setIsSaving(true);
            await createMutation.mutateAsync({
                name: createForm.name.trim(),
                description: (createForm.description ?? "").trim() || null,
                icon: createForm.icon.trim() || "tag",
                color: createForm.color.trim() || "#64748b",
                team_id: currentTeam?.id || "",
            });
            setIsCreateOpen(false);
            setCreateForm({ name: "", description: "", icon: "tag", color: "#64748b", team_id: currentTeam?.id || "" });
        } catch (e: unknown) {
            alert(e instanceof Error ? e.message : "Failed to create");
        } finally {
            setIsSaving(false);
        }
    };

    const onOpenEdit = (c: Category) => {
        setEditTarget(c);
        setEditForm({ name: c.name, description: c.description ?? "", icon: c.icon, color: c.color });
    };

    const onSaveEdit = async () => {
        if (!editTarget) return;
        try {
            setIsSaving(true);
            await updateMutation.mutateAsync({
                id: editTarget.id, payload: {
                    name: editForm.name?.trim() || editTarget.name,
                    description: (editForm.description ?? "").trim(),
                    icon: editForm.icon?.trim() || editTarget.icon,
                    color: editForm.color?.trim() || editTarget.color,
                }
            });
            setEditTarget(null);
            setEditForm({});
        } catch (e: unknown) {
            alert(e instanceof Error ? e.message : "Failed to update");
        } finally {
            setIsSaving(false);
        }
    };

    const onDelete = async (c: Category) => {
        if (!confirm(`Delete category "${c.name}"?`)) return;
        try {
            await deleteMutation.mutateAsync(c.id);
        } catch (e: unknown) {
            alert(e instanceof Error ? e.message : "Failed to delete");
        }
    };

    return (
        <Card className="shadow-none border-0">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Categories</CardTitle>
                    <div className="flex items-center gap-2">
                        <Button variant="secondary" onClick={() => void refetch()} disabled={isLoading || isFetching}>
                            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                        </Button>
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" /> New Category
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create Category</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" value={createForm.name} onChange={(e) => setCreateForm((p) => ({ ...p, name: e.target.value }))} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Input id="description" value={createForm.description ?? ""} onChange={(e) => setCreateForm((p) => ({ ...p, description: e.target.value }))} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="icon">Icon</Label>
                                            <Input id="icon" value={createForm.icon} onChange={(e) => setCreateForm((p) => ({ ...p, icon: e.target.value }))} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="color">Color</Label>
                                            <Input id="color" type="text" value={createForm.color} onChange={(e) => setCreateForm((p) => ({ ...p, color: e.target.value }))} />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                                    <Button onClick={onCreate} disabled={isSaving || !createForm.name.trim()}>
                                        {isSaving ? <Spinner className="h-4 w-4" /> : null}
                                        <span className="ml-2">Create</span>
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {!currentTeam?.id ? (
                    <div className="p-4 rounded-md bg-muted/40 border text-sm text-muted-foreground">Loading team data...</div>
                ) : null}
                {error ? (
                    <div className="p-4 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm">{error.message}</div>
                ) : null}
                {isLoading || isFetching ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Spinner className="h-4 w-4" /> Loading...</div>
                ) : null}

                {!isLoading && categories.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Icon</TableHead>
                                <TableHead>Color</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((c) => (
                                <TableRow key={c.id}>
                                    <TableCell className="font-medium">{c.name}</TableCell>
                                    <TableCell className="max-w-[420px] truncate">{c.description}</TableCell>
                                    <TableCell>{c.icon}</TableCell>
                                    <TableCell>
                                        <div className="inline-flex items-center gap-2">
                                            <span className="inline-block h-4 w-4 rounded" style={{ background: c.color }} />
                                            <span>{c.color}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="inline-flex items-center gap-2">
                                            <Dialog open={editTarget?.id === c.id} onOpenChange={(open) => {
                                                if (!open) {
                                                    setEditTarget(null);
                                                    setEditForm({});
                                                } else {
                                                    onOpenEdit(c);
                                                }
                                            }}>
                                                <DialogTrigger asChild>
                                                    <Button size="icon" variant="ghost" aria-label="Edit">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Edit Category</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-2">
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="edit-name">Name</Label>
                                                            <Input id="edit-name" value={editForm.name ?? ""} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="edit-description">Description</Label>
                                                            <Input id="edit-description" value={editForm.description ?? ""} onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))} />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="grid gap-2">
                                                                <Label htmlFor="edit-icon">Icon</Label>
                                                                <Input id="edit-icon" value={editForm.icon ?? ""} onChange={(e) => setEditForm((p) => ({ ...p, icon: e.target.value }))} />
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <Label htmlFor="edit-color">Color</Label>
                                                                <Input id="edit-color" type="text" value={editForm.color ?? ""} onChange={(e) => setEditForm((p) => ({ ...p, color: e.target.value }))} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button variant="ghost" onClick={() => setEditTarget(null)}>Cancel</Button>
                                                        <Button onClick={onSaveEdit} disabled={isSaving || !(editForm.name ?? "").trim()}>
                                                            {isSaving ? <Spinner className="h-4 w-4" /> : null}
                                                            <span className="ml-2">Save</span>
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                            <Button size="icon" variant="ghost" onClick={() => void onDelete(c)} aria-label="Delete">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : !isLoading ? (
                    <div className="text-sm text-muted-foreground">No categories found.</div>
                ) : null}
            </CardContent>
        </Card>
    );
}


