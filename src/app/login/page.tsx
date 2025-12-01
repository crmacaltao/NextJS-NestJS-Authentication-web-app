"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { saveToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { API_BASE } from "@/lib/config";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    async function handleLogin(e: FormEvent) {
        e.preventDefault();
        setError("");

        const res = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.message || "Login failed");
            return;
        }

        saveToken(data.accessToken);
        router.push("/dashboard");
    }

    return (
        <div className="flex items-center justify-center h-screen 
            bg-black bg-gradient-to-b from-black via-black to-red-950/30">

            <Card className="w-full max-w-sm p-6 
                bg-white/5 border border-red-900/40 backdrop-blur-md shadow-xl rounded-xl">

                <CardContent>
                    <h1 className="text-3xl font-bold text-white text-center mb-6">
                        Login
                    </h1>

                    <form onSubmit={handleLogin} className="space-y-4">

                        <Input
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-black/40 border-red-700/40 text-white"
                        />

                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-black/40 border-red-700/40 text-white pr-10"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <img
                                    src={showPassword ? "/images/hidden.png" : "/images/show.png"}
                                    className="w-5 h-5 opacity-80"
                                />
                            </button>
                        </div>

                        {error && <p className="text-red-400 text-sm">{error}</p>}

                        <Button 
                            className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold"
                            type="submit"
                        >
                            Login
                        </Button>
                    </form>

                    <Button
                        variant="link"
                        className="mt-4 w-full text-red-400 hover:text-red-300"
                        onClick={() => router.push("/register")}
                    >
                        Create an Account
                    </Button>

                </CardContent>
            </Card>
        </div>
    );
}
