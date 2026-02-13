"use client";
import { 
  User, 
  Download, 
  RefreshCw, 
  Percent, 
  Coins, 
  Truck, 
  Landmark, 
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGuestStore } from "@/store/guest-store";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { SimpleMinimalTemplate } from "./invoice/templates/simple-minimal";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

export function BottomNav() {
  const { uiSettings, toggleUiSetting, resetDraft, currentDraft } = useGuestStore();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleReset = () => {
    if(confirm("Are you sure you want to reset the entire invoice?")) {
      resetDraft();
      toast.success("Invoice reset to default");
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    toast.info("Generating PDF...");

    try {
      const Template = SimpleMinimalTemplate;

      const blob = await pdf(<Template data={currentDraft}/>).toBlob();
      saveAs(blob, `${currentDraft.invoiceNumber || "invoice"}.pdf`);
      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-xl">
      <div className="bg-white/90 backdrop-blur-lg border border-neutral-200 shadow-2xl rounded-2xl p-2 flex items-center justify-between gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-neutral-100 shrink-0">
              <User className="w-5 h-5 text-neutral-600" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" align="start" className="w-64 p-4 mb-2 shadow-xl border-neutral-100">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-neutral-900">Guest User</p>
                  <p className="text-xs text-neutral-500">Free Plan (Watermarked)</p>
                </div>
              </div>
              <div className="grid gap-2">
                <Link href="/login" className="w-full">
                  <Button variant="outline" size="sm" className="w-full justify-start h-9">
                    Login
                  </Button>
                </Link>
                <Link href="/pricing" className="w-full">
                  <Button size="sm" className="w-full justify-start bg-linear-to-r from-blue-600 to-indigo-600 border-0 h-9">
                    Buy Premium
                  </Button>
                </Link>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="h-8 w-px bg-neutral-200" />

        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
           <ToggleBtn 
             isActive={uiSettings.showTax} 
             onClick={() => toggleUiSetting('showTax')} 
             icon={Percent} 
             label="Tax" 
           />
           <ToggleBtn 
             isActive={uiSettings.showDiscount} 
             onClick={() => toggleUiSetting('showDiscount')} 
             icon={Coins} 
             label="Discount" 
           />
           <ToggleBtn 
             isActive={uiSettings.showShipping} 
             onClick={() => toggleUiSetting('showShipping')} 
             icon={Truck} 
             label="Ship" 
           />
           <ToggleBtn 
             isActive={uiSettings.showBankDetails} 
             onClick={() => toggleUiSetting('showBankDetails')} 
             icon={Landmark} 
             label="Bank" 
           />
        </div>

        <div className="h-8 w-px bg-neutral-200" />

        <div className="flex items-center gap-2 shrink-0">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleReset}
            className="text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
            title="Reset Form"
          >
            <RefreshCw className="w-5 h-5" />
          </Button>
          
          <Button 
            onClick={handleDownload}
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

function ToggleBtn({ isActive, onClick, icon: Icon, label }: any) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        "flex flex-col h-auto py-1.5 px-2 gap-0.5 rounded-lg transition-all min-w-12.5",
        isActive 
          ? "bg-blue-50 text-dark-blue ring-1 ring-blue" 
          : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
      )}
    >
      <Icon className="w-4 h-4" />
      <span className="text-[10px] font-medium leading-none">{label}</span>
    </Button>
  );
}
