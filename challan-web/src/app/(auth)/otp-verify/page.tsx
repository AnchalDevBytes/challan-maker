"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";

const OtpVerify = ({ length = 6} : { length?: number }) => {
    const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        if(!/^\d*$/.test(value)) return;

        const val = value.slice(-1);

        const newOtp = [...otp];
        newOtp[index] = val;
        setOtp(newOtp);

        if(val && index < length-1) {
            inputRefs.current[index+1]?.focus();
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index-1]?.focus();
        }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();

        const pasteData = e.clipboardData.getData("text").slice(0, length).split("");
        if(pasteData.every((char) => /^\d$/.test(char))) {
            setOtp(pasteData);
            inputRefs.current[length-1]?.focus();
        }
    }

  return (
    <div className="min-h-screen w-full bg-neutral-50 flex items-center justify-center p-4">
        <div className="w-full max-w-100 bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden">
            
            <div className="p-10 pb-8 flex flex-col items-center">
            
            <h2 className="text-xl font-bold text-neutral-900 text-center">Check your email</h2>
            <p className="text-neutral-500 text-sm text-center mt-1">to complete your registration</p>
            
            <div className="flex items-center gap-2 mt-2 mb-8">
                <span className="text-neutral-700 font-medium">johndoe@gmail.com</span>
                <button className="text-blue hover:opacity-80 transition">
                    <Pencil size={18}/>
                </button>
            </div>

            <div className="flex gap-2 mb-4">
                {otp.map((_, index) => {
                    return (
                        <input
                            key={index}
                            ref={(el) => { inputRefs.current[index] = el }}
                            type="text"
                            value={otp[index]}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            className={cn(
                                "flex w-12 h-12 border border-neutral-200 dark:text-neutral-50 dark:border-neutral-700 rounded-md bg-transparent px-3 py-2 text-center text-sm font-semibold shadow-sm transition-all outline-none",
                                "focus:border-blue dark:focus:border-blue focus:ring-1 focus:ring-blue dark:focus:ring-blue",
                                "disabled:cursor-not-allowed disabled:opacity-50"
                            )}
                        />
                    )
                })}
            </div>

            <button className="text-blue text-sm font-medium hover:underline mb-8">
                Didn't receive a code? Resend (27)
            </button>

            <button type="submit" className="w-full py-3 bg-blue hover:bg-dark-blue text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 mb-6">
                Signup
            </button>

            </div>

        </div>
    </div>
  )
}

export default OtpVerify;
