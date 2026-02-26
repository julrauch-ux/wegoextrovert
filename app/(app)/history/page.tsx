import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import HistoryItem from "@/components/app/HistoryItem";
import EmptyState from "@/components/app/EmptyState";
import Link from "next/link";
import type { CommentGeneration, PostDraft } from "@/lib/types";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const tab = searchParams.tab === "posts" ? "posts" : "comments";
  const PAGE_SIZE = 20;

  const [commentsResult, postsResult] = await Promise.all([
    supabase
      .from("comment_generations")
      .select("id, post_text, comments, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(PAGE_SIZE),
    supabase
      .from("post_drafts")
      .select("id, topic, content, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(PAGE_SIZE),
  ]);

  const comments = (commentsResult.data ?? []) as Pick<CommentGeneration, "id" | "post_text" | "comments" | "created_at">[];
  const posts = (postsResult.data ?? []) as Pick<PostDraft, "id" | "topic" | "content" | "created_at">[];

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-wge-cream">History</h1>
        <p className="text-wge-cream/50 mt-1">Your past comment generations and post drafts</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/[0.03] rounded-xl p-1 mb-6 w-fit">
        <Link
          href="/history?tab=comments"
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
            tab === "comments"
              ? "bg-white/10 text-wge-cream"
              : "text-wge-cream/50 hover:text-wge-cream"
          }`}
        >
          Comments ({comments.length})
        </Link>
        <Link
          href="/history?tab=posts"
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
            tab === "posts"
              ? "bg-white/10 text-wge-cream"
              : "text-wge-cream/50 hover:text-wge-cream"
          }`}
        >
          Posts ({posts.length})
        </Link>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] px-6 py-2">
        {tab === "comments" ? (
          comments.length === 0 ? (
            <EmptyState
              title="No comment generations yet"
              description="Use the Comment Generator to create AI-crafted LinkedIn comments."
              action={
                <Link
                  href="/comments"
                  className="inline-flex items-center px-4 py-2 rounded-xl bg-wge-blue/10 text-wge-blue text-sm font-medium hover:bg-wge-blue/20 transition-colors"
                >
                  Generate comments
                </Link>
              }
            />
          ) : (
            comments.map((item) => (
              <HistoryItem
                key={item.id}
                type="comment"
                title={item.post_text}
                preview={(item.comments as string[])[0] ?? ""}
                date={item.created_at}
                copyText={(item.comments as string[]).join("\n\n")}
              />
            ))
          )
        ) : (
          posts.length === 0 ? (
            <EmptyState
              title="No post drafts yet"
              description="Use the Post Writer to generate AI-written LinkedIn posts."
              action={
                <Link
                  href="/posts"
                  className="inline-flex items-center px-4 py-2 rounded-xl bg-wge-purple/10 text-wge-purple text-sm font-medium hover:bg-wge-purple/20 transition-colors"
                >
                  Write a post
                </Link>
              }
            />
          ) : (
            posts.map((item) => (
              <HistoryItem
                key={item.id}
                type="post"
                title={item.topic}
                preview={item.content}
                date={item.created_at}
                copyText={item.content}
              />
            ))
          )
        )}
      </div>
    </div>
  );
}
