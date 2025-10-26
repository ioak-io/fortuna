"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useHttp } from "@/lib/shared/http";
import { CategoryService } from "@/lib/services/category";
import type { Category, CreateCategoryPayload, UpdateCategoryPayload } from "@/types/category";
import { toast } from "sonner";

// Query keys for React Query
export const categoriesQueryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoriesQueryKeys.all, "list"] as const,
  list: (teamId: string) => [...categoriesQueryKeys.lists(), teamId] as const,
  details: () => [...categoriesQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...categoriesQueryKeys.details(), id] as const,
};

// Hook for fetching all categories for a team
export function useCategories(teamId?: string) {
  const { fetch } = useHttp();
  const service = CategoryService(fetch, teamId);

  return useQuery<Category[], Error>({
    queryKey: teamId ? categoriesQueryKeys.list(teamId) : categoriesQueryKeys.lists(),
    queryFn: () => service.list(),
    enabled: !!teamId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
}

// Hook for fetching single category
export function useCategory(id?: number, teamId?: string) {
  const { fetch } = useHttp();
  const service = CategoryService(fetch, teamId);

  return useQuery<Category, Error>({
    queryKey: id ? categoriesQueryKeys.detail(id) : categoriesQueryKeys.details(),
    queryFn: async () => {
      // PostgREST: filter by id
      const list = await service.list();
      const found = list.find((c) => c.id === id);
      if (!found) throw new Error("Category not found");
      return found;
    },
    enabled: !!id && !!teamId,
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });
}

// Hook for creating a category
export function useCreateCategory(teamId?: string) {
  const { fetch } = useHttp();
  const service = CategoryService(fetch, teamId);
  const queryClient = useQueryClient();

  return useMutation<Category, unknown, CreateCategoryPayload>({
    mutationFn: (payload) => service.create(payload),
    onSuccess: (newCategory) => {
      if (teamId) {
        queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.list(teamId) });
      } else {
        queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.lists() });
      }
      queryClient.setQueryData(categoriesQueryKeys.detail(newCategory.id), newCategory);
      toast.success("Category created successfully");
    },
    onError: (error) => {
      const msg = error instanceof Error ? error.message : "Failed to create category";
      toast.error(msg);
    },
  });
}

// Hook for updating a category
export function useUpdateCategory(teamId?: string) {
  const { fetch } = useHttp();
  const service = CategoryService(fetch, teamId);
  const queryClient = useQueryClient();

  return useMutation<Category, unknown, { id: number; payload: UpdateCategoryPayload }>({
    mutationFn: ({ id, payload }) => service.update(id, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(categoriesQueryKeys.detail(updated.id), updated);
      if (teamId) {
        queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.list(teamId) });
      } else {
        queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.lists() });
      }
      toast.success("Category updated successfully");
    },
    onError: (error) => {
      const msg = error instanceof Error ? error.message : "Failed to update category";
      toast.error(msg);
    },
  });
}

// Hook for deleting a category
export function useDeleteCategory(teamId?: string) {
  const { fetch } = useHttp();
  const service = CategoryService(fetch, teamId);
  const queryClient = useQueryClient();

  return useMutation<void, unknown, number>({
    mutationFn: (id) => service.remove(id),
    onSuccess: (_result, deletedId) => {
      queryClient.removeQueries({ queryKey: categoriesQueryKeys.detail(deletedId) });
      if (teamId) {
        queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.list(teamId) });
      } else {
        queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.lists() });
      }
      toast.success("Category deleted successfully");
    },
    onError: (error) => {
      const msg = error instanceof Error ? error.message : "Failed to delete category";
      toast.error(msg);
    },
  });
}


