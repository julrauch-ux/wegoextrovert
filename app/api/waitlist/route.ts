import { NextRequest, NextResponse } from "next/server";

interface WaitlistEntry {
  email: string;
  joinedAt: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ---------- Vercel KV (production) ----------
async function kvSignup(email: string): Promise<"added" | "exists"> {
  const { kv } = await import("@vercel/kv");
  const isMember = await kv.sismember("waitlist:emails", email);
  if (isMember) return "exists";
  await kv.sadd("waitlist:emails", email);
  await kv.rpush(
    "waitlist:entries",
    JSON.stringify({ email, joinedAt: new Date().toISOString() } satisfies WaitlistEntry)
  );
  return "added";
}

// ---------- Local JSON fallback (dev) ----------
async function localSignup(email: string): Promise<"added" | "exists"> {
  const { readFileSync, writeFileSync, mkdirSync, existsSync } = await import("node:fs");
  const { join } = await import("node:path");

  const dataDir = join(process.cwd(), "data");
  const dataFile = join(dataDir, "waitlist.json");

  let entries: WaitlistEntry[] = [];
  try {
    if (existsSync(dataFile)) {
      entries = JSON.parse(readFileSync(dataFile, "utf-8")) as WaitlistEntry[];
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
    const useKv = Boolean(process.env.KV_REST_API_URL);
    const result = useKv ? await kvSignup(raw) : await localSignup(raw);

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
