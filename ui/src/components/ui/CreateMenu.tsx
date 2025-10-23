"use client"

import { Button } from "@/components/ui-library/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui-library/ui/dropdown-menu";
import { Plus, BookOpen, FileText, FolderOpen, Upload, Tag, Users, Frame, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTypedParams } from "@/components/ui-library/hooks/useTypedParams";
import { CommonParams } from "@/types/params/CommonParams";
import { useCreateDialogStore } from "@/stores/useCreateDialogStore";

export function CreateMenu() {
    const router = useRouter();
    const { team } = useTypedParams<CommonParams>();
    const { setOpenDialog } = useCreateDialogStore();

    const handleCreateUnit = () => {
        // Just open the global create dialog
        setOpenDialog("unit");
    };

    const handleCreateChapter = () => {
        router.push(`/${team}/chapter`);
        setOpenDialog("chapter");
    };

    const handleCreateCourse = () => {
        router.push(`/${team}/course`);
        setOpenDialog("course");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" className="rounded-full h-10 w-10" variant="ghost">
                    <Plus />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Learning Structure</DropdownMenuLabel>
                <DropdownMenuItem onClick={handleCreateUnit}>
                    <Frame className="mr-2 h-4 w-4" />
                    <span>New Unit</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCreateChapter}>
                    <FileText className="mr-2 h-4 w-4" />
                    <span>New Chapter</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCreateCourse}>
                    <GraduationCap className="mr-2 h-4 w-4" />
                    <span>New Course</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <FolderOpen className="mr-2 h-4 w-4" />
                    <span>New Collection</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Content</DropdownMenuLabel>
                <DropdownMenuItem>
                    <Upload className="mr-2 h-4 w-4" />
                    <span>Upload File</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Tag className="mr-2 h-4 w-4" />
                    <span>New Tag</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Collaboration</DropdownMenuLabel>
                <DropdownMenuItem>
                    <Users className="mr-2 h-4 w-4" />
                    <span>New Team</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
