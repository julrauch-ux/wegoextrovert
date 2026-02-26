"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import SuggestionCard from "@/components/app/SuggestionCard";
import Skeleton from "@/components/app/Skeleton";
import EmptyState from "@/components/app/EmptyState";
import type { Suggestion, Prospect } from "@/lib/types";

type QueueSuggestion = Suggestion & {
  prospects: Pick<Prospect, "full_name" | "company">;
  activities?: { post_text: string } | null;
};

export default function QueuePage() {
  const [suggestions, setSuggestions] = useState<QueueSuggestion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQueue = useCallback(async () => {
    try {
      const res = await fetch("/api/queue");
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  function handleAction(id: string) {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-wge-cream">Review Queue</h1>
          <p className="text-wge-cream/50 mt-1">
            {loading ? "Loading…" : `${suggestions.length} pending suggestion${suggestions.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Link
          href="/queue/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-wge-blue text-white text-sm font-semibold hover:opacity-90 transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Generate suggestions
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-44 w-full rounded-2xl" />
          ))}
        </div>
      ) : suggestions.length === 0 ? (
        <EmptyState
          title="Queue is clear"
          description="All suggestions have been reviewed. Generate new ones by pasting a prospect's post."
          action={
            <Link
              href="/queue/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-wge-blue text-white text-sm font-semibold hover:opacity-90 transition-all"
            >
              Generate suggestions
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              onAction={handleAction}
            />
          ))}
        </div>
      )}
    </div>
  );
}
