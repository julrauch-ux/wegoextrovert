"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8">
      <div className="mb-8 text-center">
        <span className="text-2xl font-bold text-gradient">wge</span>
        <h1 className="mt-3 text-xl font-semibold text-wge-cream">Reset password</h1>
        <p className="mt-1 text-sm text-wge-cream/50">
          {sent ? "Check your inbox" : "We'll send you a reset link"}
        </p>
      </div>

      {sent ? (
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm text-wge-cream/70">
            Email sent to <span className="text-wge-cream font-medium">{email}</span>.<br />
            Click the link in the email to set a new password.
          </p>
          <p className="text-xs text-wge-cream/30">Check your spam folder if it doesn't arrive.</p>
        </div>
      ) : (
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

          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 rounded-lg px-3 py-2">{error}</p>
          )}

          <Button type="submit" className="w-full rounded-xl" disabled={loading}>
            {loading ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-wge-cream/50">
        <Link href="/login" className="text-wge-blue hover:text-wge-purple transition-colors">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
