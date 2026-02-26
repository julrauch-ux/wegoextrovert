import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateComments } from "@/lib/anthropic";
import type { Tone } from "@/lib/types";

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { postText: string; tone?: Tone };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { postText, tone = "professional" } = body;
  if (!postText?.trim()) {
    return NextResponse.json({ error: "postText is required" }, { status: 400 });
  }

  try {
    const comments = await generateComments(postText.trim(), tone);

    const { data, error } = await supabase
      .from("comment_generations")
      .insert({ user_id: user.id, post_text: postText.trim(), comments })
      .select("id")
      .single();

    if (error) {
      console.error("DB insert error:", error);
    }

    return NextResponse.json({ id: data?.id, comments });
  } catch (err) {
    console.error("Comment generation error:", err);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
