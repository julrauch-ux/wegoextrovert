import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { status: "approved" | "skipped" };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { status } = body;
  if (status !== "approved" && status !== "skipped") {
    return NextResponse.json({ error: "status must be 'approved' or 'skipped'" }, { status: 400 });
  }

  // Update suggestion status
  const { data: suggestion, error: suggestionError } = await supabase
    .from("suggestions")
    .update({ status })
    .eq("id", params.id)
    .eq("user_id", user.id)
    .select("prospect_id")
    .single();

  if (suggestionError || !suggestion) {
    return NextResponse.json({ error: suggestionError?.message ?? "Not found" }, { status: 404 });
  }

  // Increment touchpoint_count on approve
  if (status === "approved") {
    const { data: prospect } = await supabase
      .from("prospects")
      .select("touchpoint_count")
      .eq("id", suggestion.prospect_id)
      .eq("user_id", user.id)
      .single();
    if (prospect) {
      await supabase
        .from("prospects")
        .update({ touchpoint_count: (prospect.touchpoint_count ?? 0) + 1 })
        .eq("id", suggestion.prospect_id)
        .eq("user_id", user.id);
    }
  }

  return NextResponse.json({ success: true });
}
