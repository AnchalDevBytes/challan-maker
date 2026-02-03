import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
    tempEmail: string | null;
    setTempEmail: (email: string | null) => void;
    clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            tempEmail: null,
            setTempEmail: (email) => set({ tempEmail: email }),
            clearAuth: () => set({ tempEmail: null }),
        }),
        { name: "auth-storage" }
    )
);
