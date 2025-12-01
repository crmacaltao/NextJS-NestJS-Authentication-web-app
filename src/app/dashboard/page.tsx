"use client";

import { getToken } from "@/lib/auth";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface jwtPayload {
    sub: number; username: string; role: string; iat: number; exp: number;
}

export default function DashboardHome() {
    const token = getToken();
    const [showToken, setShowToken] = useState(false);

    let username = "Guest";
    let role = "User";

    if (token) {
        try {
            const decoded = jwtDecode<jwtPayload>(token);
            username = decoded.username || "Guest";
            role = decoded.role || "User";
        } catch (e) {
            console.error("Token decoding failed:", e);
        }
    }

    return (
        <div className="space-y-6 p-2">

            {/* Welcome Card */}
            <Card className="bg-[#111] border-red-700 shadow-xl shadow-red-900/40">
                <CardHeader>
                    <CardTitle className="text-2xl text-red-400 font-bold">
                        Welcome back, {username}!
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <p className="text-gray-400">
                        You are logged in as <span className="text-red-300 font-semibold">{role}</span>.
                    </p>
                </CardContent>
            </Card>

            {/* Token Display */}
            {token && (
                <Card className="bg-[#111] border-red-700 shadow-xl shadow-red-900/40">
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center text-red-400">
                            <span>Your Token</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowToken(!showToken)}
                                className="text-red-400 hover:text-white hover:bg-red-700/40"
                            >
                                {showToken ? "Hide" : "Show"}
                            </Button>
                        </CardTitle>
                    </CardHeader>

                    {showToken && (
                        <CardContent>
                            <p className="text-gray-400 text-sm mb-2">Bearer Token:</p>
                            <pre className="p-3 bg-black/40 border border-red-900 text-red-300 text-xs rounded overflow-auto max-h-40">
                                {token}
                            </pre>
                        </CardContent>
                    )}
                </Card>
            )}
        </div>
    );
}
