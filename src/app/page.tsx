"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <div className="max-w-md w-full p-10 rounded-2xl bg-[rgba(255,255,255,0.05)] backdrop-blur-md border border-red-900/30 shadow-[0_0_15px_rgba(255,0,0,0.3)] text-center">
        <h1 className="text-4xl font-bold mb-4 text-red-400 drop-shadow-[0_0_8px_rgba(255,0,0,0.6)]">
          Welcome to My App
        </h1>

        <p className="text-lg text-white/70 mb-8">
          Manage your account and access your dashboard.
        </p>

        <div className="flex justify-center gap-4">
          <Button
            onClick={() => router.push("/login")}
            className="bg-red-700 hover:bg-red-600 text-white shadow-[0_0_8px_rgba(255,0,0,0.7)] transition-all"
          >
            Login
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/register")}
            className="border-red-600 text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all shadow-[0_0_8px_rgba(255,0,0,0.4)]"
          >
            Register
          </Button>
        </div>
      </div>
    </div>
  );
}
