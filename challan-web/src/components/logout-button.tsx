"use client";

import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const LogoutButton = ({ className } : { className?: string}) => {
    const router = useRouter();
    const { logout: clearAuthState } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await api.post("/auth/logout");
            clearAuthState();

            toast.success("Logged out successful");

            router.push("/login");
            router.refresh();
        } catch (error: any) {
            console.error("Logout Error", error);

            clearAuthState();
            router.push("/login");

            toast(error.response?.data?.message || "Logout locally (Network issue)");
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <button
        onClick={handleLogout}
        disabled={isLoading}
        className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
            "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-red-600 hover:border-red-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className
        )}
    >
        {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin"/>
        ) : (
            <LogOut className="w-4 h-4"/>
        )}
        <span>Logout</span>
    </button>
  );
};

export default LogoutButton;
