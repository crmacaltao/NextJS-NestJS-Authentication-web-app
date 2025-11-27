"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        // If user is already logged in, redirect to dashboard
        const token = getToken();
        if (token) {
            router.push("/dashboard");
        }
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
            <div className="text-center max-w-md">
                <h1 className="text-4xl font-bold mb-4">Welcome to My App</h1>
                <p className="text-lg mb-6">
                    Manage your account and access your dashboard.
                </p>
                <div className="space-x-4">
                    <Button onClick={() => router.push("/login")}>
                        Login
                    </Button>
                    <Button variant="outline" onClick={() => router.push("/register")}>
                        Register
                    </Button>
                </div>
            </div>
        </div>
    );
}
   