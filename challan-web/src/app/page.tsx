"use client";
import LogoutButton from "@/components/logout-button";
import { useAuthStore } from "@/store/auth-store";
import Link from "next/link";

const LandingPage = () => {
  const { user } = useAuthStore();

  return (
    <div className="h-screen flex flex-col gap-10 items-center justify-center">
      <h2 className="text-3xl font-bold ">Challan Maker</h2>

      <div className="flex gap-10 items-center justify-between">
        <Link href={"/guest"}>
          <button 
            className="shrink-0 text-center border px-10 py-2"
          >
            Try For Free
          </button>
        </Link>
        <Link href={"/signup"}>
          <button 
            className="shrink-0 text-center border border-dashed px-10 py-2"
          >
            Signup
          </button>
        </Link>
      </div>

      <div>
        {user?.name}, { user?.email}
      </div>

      <LogoutButton/>
    </div>
  )
}

export default LandingPage;
