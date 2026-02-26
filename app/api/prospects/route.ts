import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("prospects")
    .select("*, campaigns(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: {
    full_name: string;
    linkedin_url: string;
    company?: string;
    title?: string;
    campaign_id?: string;
    notes?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { full_name, linkedin_url, company, title, campaign_id, notes } = body;
  if (!full_name?.trim() || !linkedin_url?.trim()) {
    return NextResponse.json({ error: "full_name and linkedin_url are required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("prospects")
    .insert({
      user_id: user.id,
      full_name: full_name.trim(),
      linkedin_url: linkedin_url.trim(),
      company: company?.trim() || null,
      title: title?.trim() || null,
      campaign_id: campaign_id || null,
      notes: notes?.trim() || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
