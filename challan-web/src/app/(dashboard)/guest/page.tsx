"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, FileText, Eye } from "lucide-react";
import GuestInvoiceForm from "@/components/guest-invoice-form";
import { useGuestStore } from "@/store/guest-store";
import InvoicePreview from "@/components/invoice/invoice-preview";
import { cn } from "@/lib/utils";
import PreviewTabSwitcher from "@/components/preview-tab-switcher";

export default function GuestDashboard() {
  const [mounted, setMounted] = useState(false);
  const [mobilePreviewTab, setMobilePreviewTab] = useState<"form" | "preview">(
    "form",
  );
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

      <PreviewTabSwitcher
        mobilePreviewTab={mobilePreviewTab}
        setMobilePreviewTab={setMobilePreviewTab}
      />

      <main className="max-w-330 mx-auto py-6 px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div
            className={cn(
              "space-y-4",
              mobilePreviewTab === "preview" ? "hidden lg:block" : "block",
            )}
          >
            <h2 className="text-xl font-semibold text-neutral-700 ml-1">
              Invoice Details
            </h2>
            <GuestInvoiceForm key={resetKey} />
          </div>

          <div
            className={cn(
              "space-y-4 lg:sticky lg:top-8",
              mobilePreviewTab === "form" ? "hidden lg:block" : "block",
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
