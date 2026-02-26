import { NextRequest, NextResponse } from "next/server";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ---------- Supabase (production + local with env vars) ----------
async function supabaseSignup(email: string): Promise<"added" | "exists"> {
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: existing } = await supabase
    .from("waitlist")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existing) return "exists";

  const { error } = await supabase.from("waitlist").insert({ email });
  if (error) throw error;

  return "added";
}

// ---------- Local JSON fallback (dev without env vars) ----------
async function localSignup(email: string): Promise<"added" | "exists"> {
  const { readFileSync, writeFileSync, mkdirSync, existsSync } = await import("node:fs");
  const { join } = await import("node:path");

  const dataDir = join(process.cwd(), "data");
  const dataFile = join(dataDir, "waitlist.json");

  let entries: { email: string; joinedAt: string }[] = [];
  try {
    if (existsSync(dataFile)) {
      entries = JSON.parse(readFileSync(dataFile, "utf-8"));
    }
  } catch {
    entries = [];
  }

  if (entries.some((e) => e.email === email)) return "exists";

  entries.push({ email, joinedAt: new Date().toISOString() });
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
  writeFileSync(dataFile, JSON.stringify(entries, null, 2), "utf-8");
  return "added";
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

  const raw =
    typeof body === "object" &&
    body !== null &&
    "email" in body &&
    typeof (body as Record<string, unknown>).email === "string"
      ? (body as Record<string, string>).email.trim().toLowerCase()
      : "";

  if (!raw) {
    return NextResponse.json(
      { success: false, message: "Email address is required." },
      { status: 400 }
    );
  }

  if (!isValidEmail(raw)) {
    return NextResponse.json(
      { success: false, message: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  try {
    const useSupabase = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
    const result = useSupabase ? await supabaseSignup(raw) : await localSignup(raw);

    if (result === "exists") {
      return NextResponse.json(
        { success: true, message: "You're already on the list!" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: true, message: "You're on the list! We'll be in touch soon." },
      { status: 201 }
    );
  } catch (err) {
    console.error("[waitlist] error:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
