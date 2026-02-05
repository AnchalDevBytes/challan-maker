import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
    googleId: string | null;
}

interface AuthState {
    tempEmail: string | null;
    setTempEmail: (email: string | null) => void;

    user: User | null;
    setUser: (user: User) => void;
    
    logout: () => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            tempEmail: null,
            user: null,

            setTempEmail: (email) => set({ tempEmail: email }),
            setUser: (user) => set({ user }),

            logout: () => set({ user: null, tempEmail: null }),
        }),
        { 
            name: "auth-storage",
        }
    )
);
