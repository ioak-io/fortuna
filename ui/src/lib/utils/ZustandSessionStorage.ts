import { StateStorage, createJSONStorage } from "zustand/middleware";

export const customSessionStorage: StateStorage = {
  getItem: (name: string): string | null => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(name);
    }
    return null;
  },
  setItem: (name: string, value: string): void => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(name, value);
    }
  },
  removeItem: (name: string): void => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(name);
    }
  },
};

export const createSessionStorage = () => createJSONStorage(() => customSessionStorage);
