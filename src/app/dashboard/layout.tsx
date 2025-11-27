"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken, logoutUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";

interface jwtPayload {
    sub: number; username: string; role: string; iat: number; exp: number;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [username, setUsername] = useState('Guest');

    useEffect(() => {
        const t = getToken();
        setToken(t);
        if (t) {
            try {
                const decoded = jwtDecode<jwtPayload>(t);
                setUsername(decoded.username || 'Guest');
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

    if (!loaded) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg">Loading...</p>
            </div>
        );
    }

    function handleLogout() {
        logoutUser();
        router.push("/login");
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">Welcome, {username}</span>
                    <Button variant="destructive" size="sm" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-auto">
                {children}
            </main>
        </div>
    );
}
