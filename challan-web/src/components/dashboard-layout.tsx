"use client";
import { ReactNode, useEffect } from "react";
import Link from "next/link";
import LogoutButton from "@/components/logout-button";

export function DashboardLayout({ children }: { children: ReactNode }) {

    useEffect(() => {
        localStorage.removeItem("guest-invoice-storage");
    }, []);

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col">
            <div className="bg-dark-blue text-white text-xs font-medium py-2 px-4 text-center sticky top-0 z-50 shadow-sm">
                Free Tier: Storing last 5 invoices. 
                <Link href="/pricing" className="underline ml-2 hover:text-indigo-100">
                    Upgrade for unlimited history
                </Link>
            </div>

            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
                {children}
            </main>
        </div>
    );
}
