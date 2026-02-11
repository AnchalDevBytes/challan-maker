"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import GuestInvoiceForm from "@/components/guest-invoice-form";
import { GuestBottomNav } from "@/components/guest-bottom-nav";
import GuestInvoicePreview from "@/components/guest-invoice-preview";
import { useGuestStore } from "@/store/guest-store";

export default function GuestDashboard() {
  const [mounted, setMounted] = useState(false);
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

      <main className="max-w-330 mx-auto py-8 px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl ml-5 font-bold text-neutral-700">
                    Invoice Details
                  </h2>
              </div>
              <GuestInvoiceForm key={resetKey} />
          </div>

          <div className="block sticky top-8 space-y-4">
              <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl ml-8 font-bold text-neutral-700">Invoice   Preview</h2>
              </div>
              <div className="origin-top scale-[0.95]"> 
                  <GuestInvoicePreview />
              </div>
          </div>
        </div>
      </main>
      
      <GuestBottomNav/>
    </div>
  );
}
