"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-wge-cream/70 mb-1.5">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/10 text-wge-cream placeholder-wge-cream/40 focus:outline-none focus:ring-2 focus:ring-wge-blue"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-wge-cream/70 mb-1.5">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/10 text-wge-cream placeholder-wge-cream/40 focus:outline-none focus:ring-2 focus:ring-wge-blue"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-400/10 rounded-lg px-3 py-2">{error}</p>
      )}

      <Button type="submit" className="w-full rounded-xl" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8">
      <div className="mb-8 text-center">
        <span className="text-2xl font-bold text-gradient">wge</span>
        <h1 className="mt-3 text-xl font-semibold text-wge-cream">Welcome back</h1>
        <p className="mt-1 text-sm text-wge-cream/50">Sign in to your account</p>
      </div>

      <Suspense fallback={<div className="h-48 animate-pulse bg-white/5 rounded-xl" />}>
        <LoginForm />
      </Suspense>

      <p className="mt-6 text-center text-sm text-wge-cream/50">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-wge-blue hover:text-wge-purple transition-colors">
          Sign up
        </Link>
      </p>
    </div>
  );
}
