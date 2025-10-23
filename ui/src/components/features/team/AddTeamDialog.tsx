"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui-library/ui/button";
import { Input } from "@/components/ui-library/ui/input";
import { Textarea } from "@/components/ui-library/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui-library/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui-library/ui/form";
import { Team } from "@/types/team";

const addTeamSchema = z.object({
  name: z.string().min(1, "Team name is required").max(50, "Team name must be less than 50 characters"),
  slug: z.string()
    .min(1, "Team slug is required")
    .max(30, "Team slug must be less than 30 characters")
    .regex(/^[a-z0-9-]+$/, "Team slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().max(200, "Description must be less than 200 characters").optional(),
});

type AddTeamFormData = z.infer<typeof addTeamSchema>;

interface AddTeamDialogProps {
  onCreateTeam: (data: AddTeamFormData) => Promise<Team>;
  isLoading?: boolean;
}

export function AddTeamDialog({ 
  onCreateTeam, 
  isLoading = false 
}: AddTeamDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<AddTeamFormData>({
    resolver: zodResolver(addTeamSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });

  const onSubmit = async (data: AddTeamFormData) => {
    try {
      await onCreateTeam(data);
      form.reset();
      setOpen(false);
    } catch (error) {
      // Error handling is done in the parent component
      console.error("Failed to create team:", error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
    }
    setOpen(newOpen);
  };

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    
    form.setValue("slug", slug);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="gap-2 p-2 w-full justify-start">
          <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
            <Plus className="size-4" />
          </div>
          <div className="text-muted-foreground font-medium">Add team</div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create new team</DialogTitle>
          <DialogDescription>
            Create a new team to organize your work and collaborate with others.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter team name"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleNameChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team slug</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="team-slug"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    This will be used in the URL. Only lowercase letters, numbers, and hyphens are allowed.
                  </p>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the team"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Creating..." : "Create team"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
