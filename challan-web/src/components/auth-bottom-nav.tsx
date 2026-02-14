"use client";
import { 
  Home, User, Save, RefreshCw, Loader2, History, Plus 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuthInvoiceStore } from "@/store/auth-invoice-store";
import { toast } from "sonner";
import LogoutButton from "@/components/logout-button";

interface AuthBottomNavProps {
  onSave: () => void;
  isSaving: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  userEmail?: string;
}

export function AuthBottomNav({ onSave, isSaving, activeTab, onTabChange,  userEmail }: AuthBottomNavProps) {
  const { resetActiveInvoice } = useAuthInvoiceStore();

  const handleReset = () => {
    if(confirm("Clear current invoice form?")) {
        resetActiveInvoice();
        toast.success("Form cleared");
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl">
      <div className="bg-white/90 backdrop-blur-lg border border-neutral-200 shadow-2xl rounded-2xl p-2 flex items-center justify-between gap-2">
        <Link href="/" title="Home">
            <Button variant="ghost" className="rounded-xl hover:bg-neutral-100 text-neutral-500 gap-2 h-10 cursor-pointer">
                <Home className="w-5 h-5" />
                <span className="font-semibold text-sm hidden sm:inline-block">Challan Maker</span>
            </Button>
        </Link>

        <div className="h-8 w-px bg-neutral-200" />

        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-neutral-100 shrink-0 cursor-pointer">
                    <User className="w-5 h-5 text-neutral-600" />
                </Button>
            </PopoverTrigger>

            <PopoverContent side="top" align="start" className="w-64 p-4 mb-2 shadow-xl border-neutral-100">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-20 bg-blue-50 text-blue rounded-full flex items-center justify-center">
                            <User className="w-5 h-5" />
                        </div>
                        <p className="font-semibold text-sm text-neutral-800">{userEmail}</p>
                    </div>

                    <div className="grid gap-2">
                        <Link href="/pricing" className="w-full">
                            <Button size="sm" className="w-full justify-center bg-linear-to-r from-dark-blue via-blue to-dark-blue border-0 h-9 cursor-pointer">
                                Buy Premium
                            </Button>
                        </Link>
                        <Link href="/login" className="w-full">
                            <Button size="sm" variant={"outline"} className="w-full justify-center h-9 cursor-pointer">
                                Login
                            </Button>
                        </Link>
                    </div>
                </div>
            </PopoverContent>
        </Popover>

        <div className="h-8 w-px bg-neutral-200" />

        <div className="flex-1 flex justify-center">
            <div className="bg-neutral-100 p-1 rounded-xl flex items-center gap-1">
                <button
                    onClick={() => onTabChange("create")}
                    className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
                        activeTab === "create" ? "bg-white text-dark-blue shadow-sm" : "text-neutral-500 hover:text-neutral-900"
                    )}
                >
                    <Plus className="w-3.5 h-3.5" /> New
                </button>
                <button
                    onClick={() => onTabChange("history")}
                    className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
                        activeTab === "history" ? "bg-white text-dark-blue shadow-sm" : "text-neutral-500 hover:text-neutral-900"
                    )}
                >
                    <History className="w-3.5 h-3.5" /> History
                </button>
            </div>
        </div>

        <div className="h-8 w-px bg-neutral-200" />

        <div className="flex items-center gap-2">
            {activeTab === "create" && (
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleReset}
                    className="text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl cursor-pointer"
                    title="Clear Form"
                >
                    <RefreshCw className="w-5 h-5" />
                </Button>
            )}

            <Button 
                onClick={onSave}
                disabled={isSaving || activeTab === "history"}
                className={cn(
                    "rounded-xl px-4 shadow-lg transition-all",
                    activeTab === "history" 
                        ? "bg-blue text-neutral-100 cursor-not-allowed shadow-none"
                        : "bg-dark-blue text-white hover:bg-blue shadow-blue-600/20 cursor-pointer"
                )}
            >
                {isSaving ? <Loader2 className="animate-spin w-4 h-4"/> : <Save className="w-4 h-4 sm:mr-2" />}
                {!isSaving && <span className="hidden sm:inline">Save & Gen</span>}
            </Button>
        </div>

      </div>
    </div>
  );
}
