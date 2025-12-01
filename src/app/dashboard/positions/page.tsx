"use client";

import React, { useEffect, useState } from "react";
import { getToken, logoutUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { API_POSITIONS_BASE } from "@/lib/config";

interface Position {
  position_id: number;
  position_code: string;
  position_name: string;
}

const ICON_SIZE = 20;
const RED = "#dc2626";

function EyeIcon({ open = false }: { open?: boolean }) {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"
        stroke={RED}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {!open && <circle cx="12" cy="12" r="3" fill={RED} />}
    </svg>
  );
}

export default function PositionsPage() {
  const router = useRouter();
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // restored correct state variables
  const [position_code, setPositionCode] = useState("");
  const [position_name, setPositionName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    fetchPositions(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function authHeaders() {
    const token = getToken();
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  }

  async function fetchPositions(token: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_POSITIONS_BASE}/positions`, {
        method: "GET",
        headers: authHeaders(),
      });

      if (res.status === 401) {
        logoutUser();
        router.push("/login");
        return;
      }

      if (!res.ok) throw new Error(`Error fetching positions: ${res.status}`);

      const data = await res.json();
      setPositions(data);
    } catch (e: any) {
      setError(e.message || "Failed to fetch positions");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateOrUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const payload: any = {};
    if (position_code) payload.position_code = position_code;
    if (position_name) payload.position_name = position_name;

    try {
      let res: Response;
      const token = getToken()!;

      if (editingId) {
        res = await fetch(`${API_POSITIONS_BASE}/positions/${editingId}`, {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_POSITIONS_BASE}/positions`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify(payload),
        });
      }

      if (res.status === 401) {
        logoutUser();
        router.push("/login");
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `Request failed: ${res.status}`);
      }

      setPositionCode("");
      setPositionName("");
      setEditingId(null);

      fetchPositions(token);
    } catch (e: any) {
      setError(e.message || "Save failed");
    }
  }

  function startEdit(p: Position) {
    setEditingId(p.position_id);
    setPositionCode(p.position_code);
    setPositionName(p.position_name);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id?: number) {
    if (!id) return;
    if (!confirm("Delete this position?")) return;

    try {
      const res = await fetch(`${API_POSITIONS_BASE}/positions/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      if (res.status === 401) {
        logoutUser();
        router.push("/login");
        return;
      }

      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);

      fetchPositions(getToken()!);
    } catch (e: any) {
      setError(e.message || "Delete failed");
    }
  }

  function handleCancelEdit() {
    setEditingId(null);
    setPositionCode("");
    setPositionName("");
  }

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Positions</h1>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="border border-red-700/40 text-red-300 hover:shadow-[0_0_12px_rgba(255,0,0,0.6)]"
              onClick={() => fetchPositions(getToken()!)}
            >
              Refresh
            </Button>
          </div>
        </header>

        {/* Form Card */}
        <div className="mb-6 bg-black/30 p-6 rounded-2xl border border-red-700/40 shadow-[0_0_15px_rgba(255,0,0,0.3)]">
          <h2 className="text-lg font-semibold mb-3">{editingId ? "Edit Position" : "Create Position"}</h2>

          <form onSubmit={handleCreateOrUpdate} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <div className="md:col-span-1">
              <label className="text-sm text-white/70 mb-1 block">Code</label>
              <Input placeholder="Position Code" value={position_code} onChange={(e) => setPositionCode(e.target.value)} className="bg-black/40 text-white border border-red-800/40 focus:shadow-[0_0_12px_rgba(255,0,0,0.7)]" />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-white/70 mb-1 block">Name</label>
              <Input placeholder="Position Name" value={position_name} onChange={(e) => setPositionName(e.target.value)} className="bg-black/40 text-white border border-red-800/40 focus:shadow-[0_0_12px_rgba(255,0,0,0.7)]" />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="bg-red-700 hover:bg-red-800 shadow-[0_0_12px_rgba(255,0,0,0.6)]">
                {editingId ? "Update" : "Create"}
              </Button>

              {editingId && (
                <Button type="button" variant="ghost" className="border border-red-800/40 text-white/70 hover:shadow-[0_0_10px_rgba(255,0,0,0.5)]" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              )}
            </div>
          </form>

          {error && <p className="text-red-400 mt-3">{error}</p>}
        </div>

        {/* Positions Table */}
        <div className="overflow-hidden rounded-2xl border border-red-700/40 shadow-[0_0_20px_rgba(255,0,0,0.25)] bg-black/20">
          <table className="w-full table-fixed text-left">
            <thead className="bg-black/30 border-b border-red-800/30">
              <tr>
                <th className="px-4 py-3 text-sm text-white/80">ID</th>
                <th className="px-4 py-3 text-sm text-white/80">Code</th>
                <th className="px-4 py-3 text-sm text-white/80">Name</th>
                <th className="px-4 py-3 text-sm text-white/80">Actions</th>
              </tr>
            </thead>
            <tbody>
              {positions.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-sm text-white/60">No positions found.</td>
                </tr>
              )}

              {positions.map((p) => (
                <tr key={p.position_id} className="border border-red-700/30 hover:border-red-500/80 hover:bg-red-900/10 transition shadow-[0_0_6px_rgba(255,0,0,0.3)] hover:shadow-[0_0_14px_rgba(255,0,0,0.8)]">
                  <td className="px-4 py-3 align-top">{p.position_id}</td>
                  <td className="px-4 py-3 align-top">{p.position_code}</td>
                  <td className="px-4 py-3 align-top">{p.position_name}</td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center gap-2">
                      <button onClick={() => startEdit(p)} className="px-3 py-1 rounded-md text-sm bg-black/40 border border-red-700/40 text-white/90 hover:bg-red-800/20 hover:shadow-[0_0_10px_rgba(255,0,0,0.7)]">
                        Edit
                      </button>

                      <button onClick={() => handleDelete(p.position_id)} className="px-3 py-1 rounded-md text-sm text-red-400 border border-red-700/40 hover:bg-red-700/10 hover:shadow-[0_0_10px_rgba(255,0,0,0.7)]">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
