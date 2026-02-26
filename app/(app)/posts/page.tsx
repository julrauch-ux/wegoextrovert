"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import ToneSelector from "@/components/app/ToneSelector";
import FormatSelector from "@/components/app/FormatSelector";
import PostPreview from "@/components/app/PostPreview";
import Skeleton from "@/components/app/Skeleton";
import type { Tone, PostFormat } from "@/lib/types";

export default function PostsPage() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [format, setFormat] = useState<PostFormat>("short");
  const [result, setResult] = useState<{ id?: string; content: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMock, setIsMock] = useState(false);

  async function handleGenerate() {
    if (!topic.trim()) return;
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/ai/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone, format }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");

      setResult({ id: data.id, content: data.content });
      setIsMock(data.isMock ?? false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-wge-cream">Post Writer</h1>
        <p className="text-wge-cream/50 mt-1">
          Generate a LinkedIn post from a topic with your preferred tone and format
        </p>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 mb-6 space-y-5">
        {/* Topic */}
        <div>
          <label className="block text-sm font-medium text-wge-cream/70 mb-1.5">
            Topic
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/10 text-wge-cream placeholder-wge-cream/40 focus:outline-none focus:ring-2 focus:ring-wge-blue text-sm"
            placeholder="e.g. lessons from my first year as a founder"
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          />
        </div>

        <ToneSelector value={tone} onChange={setTone} />
        <FormatSelector value={format} onChange={setFormat} />

        <Button
          onClick={handleGenerate}
          disabled={loading || !topic.trim()}
          className="rounded-xl"
        >
          {loading ? "Writing…" : "Generate Post"}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-400/10 rounded-xl px-4 py-3 mb-6">
          {error}
        </p>
      )}

      {isMock && (
        <div className="rounded-xl bg-amber-400/10 border border-amber-400/20 px-4 py-3 mb-6">
          <p className="text-sm text-amber-400">
            <strong>Demo mode:</strong> Set <code className="font-mono">ANTHROPIC_API_KEY</code> in{" "}
            <code className="font-mono">.env.local</code> to enable real AI generation.
          </p>
        </div>
      )}

      {loading && (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <Skeleton className="h-4 w-36 mb-4" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-4 w-full mb-2" />
          ))}
        </div>
      )}

      {!loading && result && (
        <PostPreview content={result.content} postId={result.id} />
      )}
    </div>
  );
}
