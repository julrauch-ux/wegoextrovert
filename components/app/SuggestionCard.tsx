"use client";

import { useState } from "react";
import { truncate } from "@/lib/utils";
import type { Suggestion, Prospect } from "@/lib/types";

interface SuggestionCardProps {
  suggestion: Suggestion & {
    prospects: Pick<Prospect, "full_name" | "company">;
    activities?: { post_text: string } | null;
  };
  onAction: (id: string, status: "approved" | "skipped") => void;
}

export default function SuggestionCard({ suggestion, onAction }: SuggestionCardProps) {
  const [loading, setLoading] = useState<"approved" | "skipped" | null>(null);
  const [done, setDone] = useState(false);

  async function handleAction(status: "approved" | "skipped") {
    setLoading(status);
    try {
      if (status === "approved") {
        await navigator.clipboard.writeText(suggestion.content);
      }
      const res = await fetch(`/api/suggestions/${suggestion.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed");
      setDone(true);
      onAction(suggestion.id, status);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  }

  if (done) return null;

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] p-5 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <p className="text-sm font-semibold text-wge-cream">{suggestion.prospects.full_name}</p>
          {suggestion.prospects.company && (
            <p className="text-xs text-wge-cream/50">{suggestion.prospects.company}</p>
          )}
        </div>
        <span className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
          suggestion.type === "comment"
            ? "bg-wge-blue/10 text-wge-blue"
            : "bg-wge-purple/10 text-wge-purple"
        }`}>
          {suggestion.type === "comment" ? "Comment" : "DM"}
        </span>
      </div>

      {/* Post snippet */}
      {suggestion.activities?.post_text && (
        <div className="mb-3 rounded-xl bg-white/[0.03] border border-white/5 px-3 py-2">
          <p className="text-xs text-wge-cream/40 leading-relaxed">
            {truncate(suggestion.activities.post_text, 120)}
          </p>
        </div>
      )}

      {/* Suggestion content */}
      <p className="text-sm text-wge-cream/90 leading-relaxed mb-4">{suggestion.content}</p>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleAction("approved")}
          disabled={loading !== null}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all disabled:opacity-50"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          {loading === "approved" ? "Copying…" : "Approve & Copy"}
        </button>
        <button
          onClick={() => handleAction("skipped")}
          disabled={loading !== null}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg text-wge-cream/50 hover:bg-white/5 hover:text-wge-cream transition-all disabled:opacity-50"
        >
          {loading === "skipped" ? "Skipping…" : "Skip"}
        </button>
      </div>
    </div>
  );
}
