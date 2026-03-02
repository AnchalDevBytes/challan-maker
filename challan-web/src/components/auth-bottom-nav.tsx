"use client";
import {
  Home,
  User,
  Save,
  RefreshCw,
  Loader2,
  History,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Link from "next/link";
import LogoutButton from "@/components/logout-button";

interface AuthBottomNavProps {
  onSave: () => void;
  onReset: () => void;
  isSaving: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  userEmail?: string;
}

export function AuthBottomNav({
  onSave,
  onReset,
  isSaving,
  activeTab,
  onTabChange,
  userEmail,
}: AuthBottomNavProps) {
  const handleReset = () => {
    if (confirm("Clear current invoice form?")) {
      onReset();
    }
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl">
      <div className="bg-white/90 backdrop-blur-lg border border-neutral-200 shadow-2xl rounded-2xl p-1.5 sm:p-2 flex items-center justify-between gap-1 sm:gap-2">
        <Link href="/" title="Home">
          <Button
            variant="ghost"
            className="rounded-xl hover:bg-neutral-100 text-neutral-500 gap-1 sm:gap-2 h-9 sm:h-10 px-2 sm:px-3 cursor-pointer"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span className="font-semibold text-sm hidden sm:inline-block">
              Challan Maker
            </span>
          </Button>
        </Link>

        <div className="h-7 sm:h-8 w-px bg-neutral-200 shrink-0" />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl hover:bg-neutral-100 shrink-0 w-8 h-8 sm:w-10 sm:h-10 cursor-pointer"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-600" />
            </Button>
          </PopoverTrigger>

          <PopoverContent
            side="top"
            align="start"
            className="w-64 p-4 mb-2 shadow-xl border-neutral-100"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-20 bg-blue-50 text-blue rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <p className="font-semibold text-sm text-neutral-800">
                  {userEmail}
                </p>
              </div>

              <div className="grid gap-2">
                <Link href="/pricing" className="w-full">
                  <Button
                    size="sm"
                    className="w-full justify-center bg-linear-to-r from-dark-blue via-blue to-dark-blue border-0 h-9 cursor-pointer"
                  >
                    Buy Premium
                  </Button>
                </Link>
                <LogoutButton />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="h-7 sm:h-8 w-px bg-neutral-200 shrink-0" />

        <div className="flex-1 flex justify-center min-w-0">
          <div className="bg-neutral-100 p-0.5 sm:p-1 rounded-xl flex items-center gap-0.5 sm:gap-1">
            <button
              onClick={() => onTabChange("create")}
              className={cn(
                "flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
                activeTab === "create"
                  ? "bg-white text-dark-blue shadow-sm"
                  : "text-neutral-500 hover:text-neutral-900",
              )}
            >
              <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span>New</span>
            </button>
            <button
              onClick={() => onTabChange("history")}
              className={cn(
                "flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
                activeTab === "history"
                  ? "bg-white text-dark-blue shadow-sm"
                  : "text-neutral-500 hover:text-neutral-900",
              )}
            >
              <History className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span>History</span>
            </button>
          </div>
        </div>

        <div className="h-7 sm:h-8 w-px bg-neutral-200 shrink-0" />

        <div className="flex items-center gap-1 sm:gap-2">
          {activeTab === "create" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              className="text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl w-8 h-8 sm:w-10 sm:h-10 cursor-pointer"
              title="Clear Form"
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          )}

          <Button
            onClick={onSave}
            disabled={isSaving || activeTab === "history"}
            className={cn(
              "rounded-xl px-2 sm:px-4 shadow-lg transition-all h-8 sm:h-10",
              activeTab === "history"
                ? "bg-blue text-neutral-100 cursor-not-allowed shadow-none"
                : "bg-dark-blue text-white hover:bg-blue shadow-blue-600/20 cursor-pointer",
            )}
          >
            {isSaving ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <Save className="w-4 h-4 sm:mr-2" />
            )}
            {!isSaving && <span className="hidden sm:inline">Save & Gen</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}
