"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { API_BASE } from "@/lib/config";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Registration failed");
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Card className="w-full max-w-sm p-6 bg-[rgba(255,255,255,0.02)] border border-red-900/30 rounded-2xl">
          <CardContent className="text-center">
            <h1 className="text-xl font-bold text-white mb-4">Registration Successful!</h1>
            <p className="mb-6 text-white/70">Your account has been created. You can now log in.</p>
            <Button className="w-full bg-red-700 text-white" onClick={() => router.push("/login")}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <Card className="w-full max-w-sm p-6 bg-[rgba(255,255,255,0.02)] border border-red-900/30 rounded-2xl">
        <CardContent>
          <h1 className="text-2xl font-bold text-white mb-4">Register</h1>

          <form onSubmit={handleRegister} className="space-y-4">
            <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="bg-black/40 text-white" />

            <div className="relative">
              <Input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-black/40 text-white pr-10" />
              <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                <img src={showPassword ? "/images/hidden.png" : "/images/show.png"} className="w-5 h-5 opacity-80" />
              </button>
            </div>

            {error && <p className="text-red-400">{error}</p>}

            <Button className="w-full bg-red-700 text-white" type="submit">Register</Button>
          </form>

          <Button variant="link" className="mt-2 w-full text-red-400" onClick={() => router.push("/login")}>Back to Login</Button>
        </CardContent>
      </Card>
    </div>
  );
}
