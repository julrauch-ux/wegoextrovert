"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Button from "@/components/ui/Button";
import Link from "next/link";
import type { Prospect, Tone } from "@/lib/types";

const TONES: { value: Tone; label: string }[] = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "witty", label: "Witty" },
  { value: "inspirational", label: "Inspirational" },
];

function NewActivityForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedProspect = searchParams.get("prospect") ?? "";

  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [prospectId, setProspectId] = useState(preselectedProspect);
  const [postText, setPostText] = useState("");
  const [postUrl, setPostUrl] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/prospects")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setProspects(data);
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prospectId || !postText.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospect_id: prospectId,
          post_text: postText.trim(),
          post_url: postUrl.trim() || undefined,
          tone,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      router.push("/queue");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  const inputCls = "w-full rounded-xl px-4 py-3 bg-white/5 border border-white/10 text-wge-cream placeholder-wge-cream/40 focus:outline-none focus:ring-2 focus:ring-wge-blue text-sm";

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-5">
      {/* Prospect selector */}
      <div>
        <label className="block text-sm font-medium text-wge-cream/70 mb-1.5">Prospect *</label>
        <select
          value={prospectId}
          onChange={(e) => setProspectId(e.target.value)}
          required
          className={inputCls}
        >
          <option value="">Select a prospect…</option>
          {prospects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.full_name}{p.company ? ` — ${p.company}` : ""}
            </option>
          ))}
        </select>
        {prospects.length === 0 && (
          <p className="text-xs text-wge-cream/40 mt-1">
            No prospects yet.{" "}
            <Link href="/prospects/new" className="text-wge-blue hover:underline">Add one first</Link>.
          </p>
        )}
      </div>

      {/* Tone */}
      <div>
        <label className="block text-sm font-medium text-wge-cream/70 mb-2">Tone</label>
        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTone(t.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                tone === t.value
                  ? "bg-wge-blue text-white"
                  : "bg-white/5 text-wge-cream/60 hover:bg-white/10 hover:text-wge-cream"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Post text */}
      <div>
        <label className="block text-sm font-medium text-wge-cream/70 mb-1.5">LinkedIn post *</label>
        <textarea
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          rows={7}
          required
          placeholder="Paste the prospect's LinkedIn post here…"
          className={`${inputCls} resize-none`}
        />
      </div>

      {/* Optional URL */}
      <div>
        <label className="block text-sm font-medium text-wge-cream/70 mb-1.5">Post URL (optional)</label>
        <input
          type="url"
          value={postUrl}
          onChange={(e) => setPostUrl(e.target.value)}
          placeholder="https://linkedin.com/posts/…"
          className={inputCls}
        />
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-400/10 rounded-xl px-4 py-3">{error}</p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading || !prospectId || !postText.trim()} className="rounded-xl">
          {loading ? "Generating…" : "Generate Suggestions"}
        </Button>
        <Link
          href="/queue"
          className="inline-flex items-center px-4 py-2 rounded-xl text-sm text-wge-cream/50 hover:text-wge-cream hover:bg-white/5 transition-all"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

export default function NewQueuePage() {
  return (
    <div className="p-8 max-w-xl mx-auto">
      <div className="mb-8">
        <Link href="/queue" className="text-sm text-wge-cream/50 hover:text-wge-cream transition-colors mb-4 inline-flex items-center gap-1">
          ← Review Queue
        </Link>
        <h1 className="text-2xl font-bold text-wge-cream mt-3">Generate Suggestions</h1>
        <p className="text-wge-cream/50 mt-1">Paste a prospect&apos;s post to generate 3 comments + 1 DM</p>
      </div>
      <Suspense fallback={<div className="text-sm text-wge-cream/40">Loading…</div>}>
        <NewActivityForm />
      </Suspense>
    </div>
  );
}
