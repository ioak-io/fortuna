import { create } from "zustand";

type CreateDialogType = "unit" | "chapter" | "course" | null;

type CreateDialogState = {
    openDialog: CreateDialogType;
    setOpenDialog: (dialog: CreateDialogType) => void;
    closeDialog: () => void;
};

export const useCreateDialogStore = create<CreateDialogState>((set) => ({
    openDialog: null,
    setOpenDialog: (dialog) => set({ openDialog: dialog }),
    closeDialog: () => set({ openDialog: null }),
}));
