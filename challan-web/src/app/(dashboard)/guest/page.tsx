"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, FileText, Eye } from "lucide-react";
import GuestInvoiceForm from "@/components/guest-invoice-form";
import { useGuestStore } from "@/store/guest-store";
import InvoicePreview from "@/components/invoice/invoice-preview";
import { cn } from "@/lib/utils";

export default function GuestDashboard() {
  const [mounted, setMounted] = useState(false);
  const [mobileTab, setMobileTab] = useState<"form" | "preview">("form");
  const { resetKey } = useGuestStore();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-neutral-50">
        <Loader2 className="animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-neutral-50 pb-32">
      <div className="bg-dark-blue text-neutral-50 text-xs py-2 px-4 text-center font-medium shadow-sm">
        <span>Guest Mode: Downloads include a watermark. </span>
        <Link
          href="/signup"
          className="text-white underline hover:underline-offset-2 hover:underline-blue ml-1 transition-colors"
        >
          Sign up to remove it
        </Link>
      </div>

      {/* Mobile tab switcher — only visible below lg */}
      <div className="lg:hidden sticky top-0 z-40 bg-neutral-50/90 backdrop-blur-sm border-b border-neutral-100 px-4 py-2">
        <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl max-w-xs mx-auto">
          <button
            onClick={() => setMobileTab("form")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
              mobileTab === "form"
                ? "bg-white text-dark-blue shadow-sm"
                : "text-neutral-500 hover:text-neutral-700",
            )}
          >
            <FileText className="w-3.5 h-3.5" /> Form
          </button>
          <button
            onClick={() => setMobileTab("preview")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
              mobileTab === "preview"
                ? "bg-white text-dark-blue shadow-sm"
                : "text-neutral-500 hover:text-neutral-700",
            )}
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
        </div>
      </div>

      <main className="max-w-330 mx-auto py-6 px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Form column */}
          <div
            className={cn(
              "space-y-4",
              // Hide on mobile when preview tab is active
              mobileTab === "preview" ? "hidden lg:block" : "block",
            )}
          >
            <h2 className="text-xl font-semibold text-neutral-700 ml-1">
              Invoice Details
            </h2>
            <GuestInvoiceForm key={resetKey} />
          </div>

          {/* Preview column */}
          <div
            className={cn(
              "space-y-4 lg:sticky lg:top-8",
              mobileTab === "form" ? "hidden lg:block" : "block",
            )}
          >
            <h2 className="text-xl font-semibold text-neutral-700 ml-1">
              Preview
            </h2>
            <InvoicePreview />
          </div>
        </div>
      </main>
    </div>
  );
}
