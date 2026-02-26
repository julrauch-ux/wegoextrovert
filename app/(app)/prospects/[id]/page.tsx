import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { formatDate, truncate } from "@/lib/utils";
import type { Prospect, Activity, Suggestion, Campaign } from "@/lib/types";

export default async function ProspectDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: prospect }, { data: activities }, { data: suggestions }] = await Promise.all([
    supabase
      .from("prospects")
      .select("*, campaigns(name, goal)")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("activities")
      .select("*")
      .eq("prospect_id", params.id)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("suggestions")
      .select("*")
      .eq("prospect_id", params.id)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  if (!prospect) notFound();

  const p = prospect as Prospect & { campaigns: Pick<Campaign, "name" | "goal"> | null };
  const activityList = (activities ?? []) as Activity[];
  const suggestionList = (suggestions ?? []) as Suggestion[];

  // Group suggestions by activity
  const suggestionsByActivity = suggestionList.reduce<Record<string, Suggestion[]>>((acc, s) => {
    const key = s.activity_id ?? "unlinked";
    acc[key] = acc[key] ?? [];
    acc[key].push(s);
    return acc;
  }, {});

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Back */}
      <Link href="/prospects" className="text-sm text-wge-cream/50 hover:text-wge-cream transition-colors inline-flex items-center gap-1 mb-6">
        ← Prospects
      </Link>

      {/* Prospect header */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-wge-cream">{p.full_name}</h1>
            {p.title && <p className="text-sm text-wge-cream/60 mt-0.5">{p.title}</p>}
            {p.company && <p className="text-sm text-wge-cream/50">{p.company}</p>}
          </div>
          <div className="flex flex-col items-end gap-2">
            {p.campaigns && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-wge-blue/10 text-wge-blue">
                {p.campaigns.name}
              </span>
            )}
            <span className="text-xs text-wge-cream/40">{p.touchpoint_count} touchpoints</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
          <a
            href={p.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-wge-blue hover:text-wge-purple transition-colors"
          >
            View on LinkedIn →
          </a>
          <span className="text-xs text-wge-cream/30">Added {formatDate(p.created_at)}</span>
        </div>

        {p.notes && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-xs font-semibold text-wge-cream/40 uppercase tracking-wider mb-1">Notes</p>
            <p className="text-sm text-wge-cream/70">{p.notes}</p>
          </div>
        )}
      </div>

      {/* Generate new activity CTA */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-wge-cream">Activity History</h2>
        <Link
          href={`/queue/new?prospect=${params.id}`}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-wge-blue/10 text-wge-blue text-xs font-semibold hover:bg-wge-blue/20 transition-all"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Generate suggestions
        </Link>
      </div>

      {/* Activity timeline */}
      {activityList.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center">
          <p className="text-sm text-wge-cream/40">No activity yet. Generate suggestions from a LinkedIn post.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activityList.map((activity) => {
            const actSuggestions = suggestionsByActivity[activity.id] ?? [];
            return (
              <div key={activity.id} className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <p className="text-sm text-wge-cream/70 leading-relaxed">{truncate(activity.post_text, 200)}</p>
                  <span className="flex-shrink-0 text-xs text-wge-cream/30">{formatDate(activity.created_at)}</span>
                </div>
                {activity.post_url && (
                  <a href={activity.post_url} target="_blank" rel="noopener noreferrer" className="text-xs text-wge-blue hover:text-wge-purple transition-colors">
                    View post →
                  </a>
                )}
                {actSuggestions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
                    {actSuggestions.map((s) => (
                      <div key={s.id} className="flex items-start gap-3">
                        <span className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                          s.type === "comment" ? "bg-wge-blue/10 text-wge-blue" : "bg-wge-purple/10 text-wge-purple"
                        }`}>
                          {s.type === "comment" ? "Comment" : "DM"}
                        </span>
                        <span className={`text-xs leading-relaxed ${
                          s.status === "approved" ? "text-green-400" : s.status === "skipped" ? "text-wge-cream/30 line-through" : "text-wge-cream/70"
                        }`}>
                          {truncate(s.content, 120)}
                        </span>
                        <span className="flex-shrink-0 text-xs text-wge-cream/30 capitalize">{s.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
