"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Link from "next/link";
import type { Campaign } from "@/lib/types";

export default function NewProspectPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [form, setForm] = useState({
    full_name: "",
    linkedin_url: "",
    company: "",
    title: "",
    campaign_id: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/campaigns")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCampaigns(data);
      })
      .catch(() => {});
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.full_name.trim() || !form.linkedin_url.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/prospects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name.trim(),
          linkedin_url: form.linkedin_url.trim(),
          company: form.company.trim() || undefined,
          title: form.title.trim() || undefined,
          campaign_id: form.campaign_id || undefined,
          notes: form.notes.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to add prospect");
      router.push("/prospects");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  const inputCls = "w-full rounded-xl px-4 py-3 bg-white/5 border border-white/10 text-wge-cream placeholder-wge-cream/40 focus:outline-none focus:ring-2 focus:ring-wge-blue text-sm";

  return (
    <div className="p-8 max-w-xl mx-auto">
      <div className="mb-8">
        <Link href="/prospects" className="text-sm text-wge-cream/50 hover:text-wge-cream transition-colors mb-4 inline-flex items-center gap-1">
          ← Prospects
        </Link>
        <h1 className="text-2xl font-bold text-wge-cream mt-3">Add Prospect</h1>
        <p className="text-wge-cream/50 mt-1">Track a LinkedIn prospect for outreach</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-wge-cream/70 mb-1.5">Full name *</label>
            <input name="full_name" type="text" value={form.full_name} onChange={handleChange} required placeholder="Jane Smith" className={inputCls} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-wge-cream/70 mb-1.5">LinkedIn URL *</label>
            <input name="linkedin_url" type="url" value={form.linkedin_url} onChange={handleChange} required placeholder="https://linkedin.com/in/..." className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-wge-cream/70 mb-1.5">Company</label>
            <input name="company" type="text" value={form.company} onChange={handleChange} placeholder="Acme Corp" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-wge-cream/70 mb-1.5">Title</label>
            <input name="title" type="text" value={form.title} onChange={handleChange} placeholder="VP of Engineering" className={inputCls} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-wge-cream/70 mb-1.5">Campaign</label>
            <select name="campaign_id" value={form.campaign_id} onChange={handleChange} className={inputCls}>
              <option value="">No campaign</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-wge-cream/70 mb-1.5">Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Context, mutual connections, conversation starters…" className={`${inputCls} resize-none`} />
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-400/10 rounded-xl px-4 py-3">{error}</p>
        )}

        <div className="flex gap-3">
          <Button type="submit" disabled={loading || !form.full_name.trim() || !form.linkedin_url.trim()} className="rounded-xl">
            {loading ? "Adding…" : "Add Prospect"}
          </Button>
          <Link
            href="/prospects"
            className="inline-flex items-center px-4 py-2 rounded-xl text-sm text-wge-cream/50 hover:text-wge-cream hover:bg-white/5 transition-all"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
