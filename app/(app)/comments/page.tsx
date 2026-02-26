"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import CommentCard from "@/components/app/CommentCard";
import Skeleton from "@/components/app/Skeleton";
import type { Tone } from "@/lib/types";

const TONES: { value: Tone; label: string }[] = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "witty", label: "Witty" },
  { value: "inspirational", label: "Inspirational" },
];

export default function CommentsPage() {
  const [postText, setPostText] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [comments, setComments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMock, setIsMock] = useState(false);

  async function handleGenerate() {
    if (!postText.trim()) return;
    setError(null);
    setLoading(true);
    setComments([]);

    try {
      const res = await fetch("/api/ai/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postText, tone }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");

      setComments(data.comments);
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
        <h1 className="text-2xl font-bold text-wge-cream">Comment Generator</h1>
        <p className="text-wge-cream/50 mt-1">
          Paste a LinkedIn post and get 5 AI-crafted comment suggestions
        </p>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 mb-6">
        {/* Tone selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-wge-cream/70 mb-2">Tone</label>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <button
                key={t.value}
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

        {/* Post text input */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-wge-cream/70 mb-1.5">
            LinkedIn Post
          </label>
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            rows={6}
            className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/10 text-wge-cream placeholder-wge-cream/40 focus:outline-none focus:ring-2 focus:ring-wge-blue resize-none text-sm"
            placeholder="Paste the LinkedIn post you want to comment on…"
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={loading || !postText.trim()}
          className="rounded-xl"
        >
          {loading ? "Generating…" : "Generate Comments"}
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

      {/* Loading skeletons */}
      {loading && (
        <div className="space-y-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && comments.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-wge-cream/60 mb-3">
            {comments.length} suggestions generated
          </h2>
          {comments.map((comment, i) => (
            <CommentCard key={i} index={i} text={comment} />
          ))}
        </div>
      )}
    </div>
  );
}
