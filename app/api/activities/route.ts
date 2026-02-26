import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateSuggestions } from "@/lib/anthropic";
import type { Tone } from "@/lib/types";

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { prospect_id: string; post_text: string; post_url?: string; tone?: Tone };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { prospect_id, post_text, post_url, tone = "professional" } = body;
  if (!prospect_id?.trim() || !post_text?.trim()) {
    return NextResponse.json({ error: "prospect_id and post_text are required" }, { status: 400 });
  }

  // Verify prospect belongs to user
  const { data: prospect, error: prospectError } = await supabase
    .from("prospects")
    .select("id, full_name, title")
    .eq("id", prospect_id)
    .eq("user_id", user.id)
    .single();

  if (prospectError || !prospect) {
    return NextResponse.json({ error: "Prospect not found" }, { status: 404 });
  }

  // Insert activity
  const { data: activity, error: activityError } = await supabase
    .from("activities")
    .insert({
      user_id: user.id,
      prospect_id,
      post_text: post_text.trim(),
      post_url: post_url?.trim() || null,
    })
    .select()
    .single();

  if (activityError || !activity) {
    return NextResponse.json({ error: activityError?.message ?? "Failed to save activity" }, { status: 500 });
  }

  // Generate suggestions
  let suggestions: { comments: string[]; dm: string };
  try {
    suggestions = await generateSuggestions(post_text.trim(), prospect.full_name, prospect.title, tone);
  } catch (err) {
    console.error("generateSuggestions error:", err);
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }

  // Save suggestions to DB
  const suggestionRows = [
    ...suggestions.comments.map((content) => ({
      user_id: user.id,
      prospect_id,
      activity_id: activity.id,
      type: "comment",
      content,
      status: "pending",
    })),
    {
      user_id: user.id,
      prospect_id,
      activity_id: activity.id,
      type: "dm",
      content: suggestions.dm,
      status: "pending",
    },
  ];

  const { error: suggestionsError } = await supabase.from("suggestions").insert(suggestionRows);
  if (suggestionsError) {
    console.error("Suggestions insert error:", suggestionsError);
  }

  return NextResponse.json({ activity, suggestions }, { status: 201 });
}
