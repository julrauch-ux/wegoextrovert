import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generatePost, isMockMode } from "@/lib/anthropic";
import type { Tone, PostFormat } from "@/lib/types";

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { topic: string; tone: Tone; format: PostFormat };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { topic, tone = "professional", format = "short" } = body;
  if (!topic?.trim()) {
    return NextResponse.json({ error: "topic is required" }, { status: 400 });
  }

  try {
    const content = await generatePost(topic.trim(), tone, format);

    const { data, error } = await supabase
      .from("post_drafts")
      .insert({ user_id: user.id, topic: topic.trim(), tone, format, content })
      .select("id")
      .single();

    if (error) {
      console.error("DB insert error:", error);
    }

    return NextResponse.json({ id: data?.id, content, isMock: isMockMode });
  } catch (err) {
    console.error("Post generation error:", err);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
