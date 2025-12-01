"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken, logoutUser } from "@/lib/auth";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";

interface jwtPayload {
  sub: number;
  username: string;
  role: string;
  iat: number;
  exp: number;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [username, setUsername] = useState("Guest");

  useEffect(() => {
    const t = getToken();
    setToken(t);
    if (t) {
      try {
        const decoded = jwtDecode<jwtPayload>(t);
        setUsername(decoded.username || "Guest");
      } catch (e) {
        console.error("Token decoding failed", e);
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded && !token) {
      router.push("/login");
    }
  }, [loaded, token, router]);

  function handleLogout() {
    logoutUser();
    router.push("/login");
  }

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <p className="text-white/70">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* Navbar */}
      <nav className="w-full px-6 py-4 flex items-center justify-between
                      bg-[rgba(255,255,255,0.05)] backdrop-blur-md border-b border-red-900/30">

        {/* App icon + welcome */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-700/30 flex items-center justify-center text-red-400 font-bold">
            M
          </div>
          <div>
            <h3 className="font-semibold text-white">My App</h3>
            <p className="text-xs text-white/60">Welcome, {username}</p>
          </div>
        </div>

        {/* RIGHT SIDE: Home, Positions, Logout */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm hover:text-red-400 transition">
            Home
          </Link>

          <Link href="/dashboard/positions" className="text-sm hover:text-red-400 transition">
            Positions
          </Link>

          <Button
            variant="ghost"
            className="text-sm text-red-400 border border-red-900/30"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </nav>

      {/* Main */}
      <div className="flex-1 p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
