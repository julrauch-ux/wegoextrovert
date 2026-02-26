import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import StatCard from "@/components/app/StatCard";
import { formatDate, truncate } from "@/lib/utils";
import Link from "next/link";
import type { CommentGeneration, PostDraft } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [commentsResult, postsResult] = await Promise.all([
    supabase
      .from("comment_generations")
      .select("id, post_text, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("post_drafts")
      .select("id, topic, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const [totalComments, totalPosts, totalProspects, totalPending] = await Promise.all([
    supabase
      .from("comment_generations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("post_drafts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("prospects")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("suggestions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "pending"),
  ]);

  const commentCount = totalComments.count ?? 0;
  const postCount = totalPosts.count ?? 0;
  const prospectCount = totalProspects.count ?? 0;
  const pendingCount = totalPending.count ?? 0;
  const recentComments = (commentsResult.data ?? []) as Pick<CommentGeneration, "id" | "post_text" | "created_at">[];
  const recentPosts = (postsResult.data ?? []) as Pick<PostDraft, "id" | "topic" | "created_at">[];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-wge-cream">Dashboard</h1>
        <p className="text-wge-cream/50 mt-1">Your LinkedIn growth at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Prospects"
          value={prospectCount}
          description="Tracked contacts"
          icon={
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
          }
        />
        <StatCard
          label="Queue"
          value={pendingCount}
          description="Pending suggestions"
          icon={
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h7a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          }
        />
        <StatCard
          label="Comment Sets"
          value={commentCount}
          description="AI comment batches"
          icon={
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" clipRule="evenodd" />
            </svg>
          }
        />
        <StatCard
          label="Post Drafts"
          value={postCount}
          description="AI-written drafts"
          icon={
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          }
        />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <Link
          href="/queue"
          className="rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] p-5 transition-colors flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-semibold text-wge-cream">Review Queue</p>
            <p className="text-xs text-wge-cream/40 mt-0.5">
              {pendingCount > 0 ? `${pendingCount} suggestion${pendingCount !== 1 ? "s" : ""} waiting` : "Queue is clear"}
            </p>
          </div>
          <span className="text-wge-blue text-lg">→</span>
        </Link>
        <Link
          href="/queue/new"
          className="rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] p-5 transition-colors flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-semibold text-wge-cream">Generate Suggestions</p>
            <p className="text-xs text-wge-cream/40 mt-0.5">Paste a prospect&apos;s post → AI comments + DM</p>
          </div>
          <span className="text-wge-blue text-lg">→</span>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Comments */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-wge-cream">Recent Comments</h2>
            <Link href="/comments" className="text-xs text-wge-blue hover:text-wge-purple transition-colors">
              Generate new
            </Link>
          </div>
          {recentComments.length === 0 ? (
            <p className="text-sm text-wge-cream/40 py-4 text-center">No comment generations yet</p>
          ) : (
            <div className="space-y-3">
              {recentComments.map((item) => (
                <div key={item.id} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-wge-blue mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-wge-cream">{truncate(item.post_text, 60)}</p>
                    <p className="text-xs text-wge-cream/40 mt-0.5">{formatDate(item.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Posts */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-wge-cream">Recent Post Drafts</h2>
            <Link href="/posts" className="text-xs text-wge-blue hover:text-wge-purple transition-colors">
              Write new
            </Link>
          </div>
          {recentPosts.length === 0 ? (
            <p className="text-sm text-wge-cream/40 py-4 text-center">No post drafts yet</p>
          ) : (
            <div className="space-y-3">
              {recentPosts.map((item) => (
                <div key={item.id} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-wge-purple mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-wge-cream">{truncate(item.topic, 60)}</p>
                    <p className="text-xs text-wge-cream/40 mt-0.5">{formatDate(item.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
