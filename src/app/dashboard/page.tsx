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
    let username = 'Guest';
    let role = 'User';

    if (token) {
        try {
            const decoded = jwtDecode<jwtPayload>(token);
            username = decoded.username || 'Guest';
            role = decoded.role || 'User';
        } catch (e) {
            console.error("Token decoding failed", e);
        }
    }

    return (
        <div className="space-y-6">
            {/* Welcome Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Welcome back, {username}!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600 mb-4">
                        You're logged in as a <strong>{role}</strong>.
                    </p>
                </CardContent>
            </Card>

            {/* Token Display (Collapsible) */}
            {token && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span>Token Details</span>
                            <Button variant="outline" size="sm" onClick={() => setShowToken(!showToken)}>
                                {showToken ? 'Hide' : 'Show'} Token
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    {showToken && (
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-2">Your Bearer Token (for debugging):</p>
                            <pre className="p-3 bg-gray-100 text-xs rounded break-all overflow-auto max-h-32">
                                {token}
                            </pre>
                        </CardContent>
                    )}
                </Card>
            )}
        </div>
    );
}