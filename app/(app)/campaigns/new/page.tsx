"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Link from "next/link";

const GOALS = [
  { value: "warm_outreach", label: "Warm Outreach" },
  { value: "hiring", label: "Hiring" },
  { value: "partnerships", label: "Partnerships" },
  { value: "sales", label: "Sales" },
  { value: "networking", label: "Networking" },
];

export default function NewCampaignPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("warm_outreach");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, goal, description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create campaign");
      router.push("/campaigns");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <div className="mb-8">
        <Link href="/campaigns" className="text-sm text-wge-cream/50 hover:text-wge-cream transition-colors mb-4 inline-flex items-center gap-1">
          ← Campaigns
        </Link>
        <h1 className="text-2xl font-bold text-wge-cream mt-3">New Campaign</h1>
        <p className="text-wge-cream/50 mt-1">Group prospects under a shared outreach goal</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-wge-cream/70 mb-1.5">Campaign name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Series A Founders Q1"
            className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/10 text-wge-cream placeholder-wge-cream/40 focus:outline-none focus:ring-2 focus:ring-wge-blue text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-wge-cream/70 mb-2">Goal</label>
          <div className="flex flex-wrap gap-2">
            {GOALS.map((g) => (
              <button
                key={g.value}
                type="button"
                onClick={() => setGoal(g.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  goal === g.value
                    ? "bg-wge-blue text-white"
                    : "bg-white/5 text-wge-cream/60 hover:bg-white/10 hover:text-wge-cream"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-wge-cream/70 mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="What's the context and goal of this campaign?"
            className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/10 text-wge-cream placeholder-wge-cream/40 focus:outline-none focus:ring-2 focus:ring-wge-blue resize-none text-sm"
          />
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-400/10 rounded-xl px-4 py-3">{error}</p>
        )}

        <div className="flex gap-3">
          <Button type="submit" disabled={loading || !name.trim()} className="rounded-xl">
            {loading ? "Creating…" : "Create Campaign"}
          </Button>
          <Link
            href="/campaigns"
            className="inline-flex items-center px-4 py-2 rounded-xl text-sm text-wge-cream/50 hover:text-wge-cream hover:bg-white/5 transition-all"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
