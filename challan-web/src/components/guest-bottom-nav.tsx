"use client";
import { 
  User, 
  Download, 
  RefreshCw, 
  Loader2,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGuestStore } from "@/store/guest-store";
import { toast } from "sonner";
import Link from "next/link";

interface GuestBottomNavProps {
  onDownload: () => void;
  isDownloading: boolean;
}

export function GuestBottomNav({ onDownload, isDownloading }: GuestBottomNavProps) {
  const { resetDraft } = useGuestStore();

  const handleReset = () => {
    if(confirm("Reset entire invoice?")) {
      resetDraft();
      toast.success("Invoice reset to default");
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-xl">
      <div className="bg-white/90 backdrop-blur-lg border border-neutral-200 shadow-2xl rounded-2xl p-2 flex items-center justify-between gap-2">
        <Link href="/" title="Home">
          <Button variant="ghost" className="rounded-xl hover:bg-neutral-100 text-neutral-500 gap-2 h-10">
                <Home className="w-5 h-5" />
                <span className="font-semibold text-sm hidden sm:inline-block">Challan Maker</span>
            </Button>
        </Link>

        <div className="h-8 w-px bg-neutral-200" />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-neutral-100 shrink-0">
              <User className="w-5 h-5 text-neutral-600" />
            </Button>
          </PopoverTrigger>
          
          <PopoverContent side="top" align="start" className="w-64 p-4 mb-2 shadow-xl border-neutral-100">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-50 text-blue rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-neutral-900">Guest User</p>
                  <p className="text-xs text-red-400">Free Plan (Watermarked)</p>
                </div>
              </div>
              <div className="grid gap-2">
                <Link href="/login" className="w-full">
                  <Button size="sm" variant={"outline"} className="w-full justify-center h-9">
                    Login
                  </Button>
                </Link>
                <Link href="/pricing" className="w-full">
                  <Button size="sm" className="w-full justify-center bg-linear-to-r from-dark-blue via-blue to-dark-blue border-0 h-9">
                    Buy Premium
                  </Button>
                </Link>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* <div className="flex-1" /> */}

        <div className="h-8 w-px bg-neutral-200" />

        <div className="flex items-center gap-2 md:gap-10 shrink-0">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleReset}
            className="text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
            title="Reset Form"
          >
            <RefreshCw className="w-5 h-5" />
          </Button>

          <div className="h-8 w-px bg-neutral-200" />
          
          <Button 
            onClick={onDownload}
            className="rounded-xl bg-dark-blue text-white hover:bg-blue px-4 shadow-lg shadow-neutral-900/20"
          >
            {!isDownloading && <Download className="w-4 h-4 sm:mr-2" />}
            {isDownloading ? <Loader2 className="animate-spin"/> : <span className="hidden sm:inline">Download</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}
