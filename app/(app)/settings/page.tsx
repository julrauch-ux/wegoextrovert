"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/app/Skeleton";
import type { Profile } from "@/lib/types";

const TONES = ["professional", "casual", "witty", "inspirational"];

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password change state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: profile.full_name,
        linkedin_url: profile.linkedin_url,
        industry: profile.industry,
        preferred_tone: profile.preferred_tone,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Save failed");
    } else {
      setProfile(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setSaving(false);
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(false);

    if (newPassword.length < 8) {
      setPwError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("Passwords don't match.");
      return;
    }

    setPwLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPwError(error.message);
    } else {
      setPwSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPwSuccess(false), 3000);
    }
    setPwLoading(false);
  }

  if (loading) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <Skeleton className="h-8 w-32 mb-8" />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="mb-4">
            <Skeleton className="h-4 w-24 mb-1.5" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-wge-cream">Settings</h1>
        <p className="text-wge-cream/50 mt-1">Manage your profile and account</p>
      </div>

      {/* Profile form */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 mb-6">
        <h2 className="text-sm font-semibold text-wge-cream mb-5">Profile</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-wge-cream/70 mb-1.5">Full name</label>
            <input
              type="text"
              value={profile?.full_name ?? ""}
              onChange={(e) => setProfile((p) => p ? { ...p, full_name: e.target.value } : p)}
              className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/10 text-wge-cream placeholder-wge-cream/40 focus:outline-none focus:ring-2 focus:ring-wge-blue text-sm"
              placeholder="Jane Smith"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-wge-cream/70 mb-1.5">Email</label>
            <input
              type="email"
              value={profile?.email ?? ""}
              disabled
              className="w-full rounded-xl px-4 py-3 bg-white/[0.03] border border-white/10 text-wge-cream/40 text-sm cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-wge-cream/70 mb-1.5">LinkedIn URL</label>
            <input
              type="url"
              value={profile?.linkedin_url ?? ""}
              onChange={(e) => setProfile((p) => p ? { ...p, linkedin_url: e.target.value } : p)}
              className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/10 text-wge-cream placeholder-wge-cream/40 focus:outline-none focus:ring-2 focus:ring-wge-blue text-sm"
              placeholder="https://linkedin.com/in/yourname"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-wge-cream/70 mb-1.5">Industry</label>
            <input
              type="text"
              value={profile?.industry ?? ""}
              onChange={(e) => setProfile((p) => p ? { ...p, industry: e.target.value } : p)}
              className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/10 text-wge-cream placeholder-wge-cream/40 focus:outline-none focus:ring-2 focus:ring-wge-blue text-sm"
              placeholder="e.g. SaaS, Finance, Healthcare"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-wge-cream/70 mb-2">Default tone</label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setProfile((p) => p ? { ...p, preferred_tone: t } : p)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
                    profile?.preferred_tone === t
                      ? "bg-wge-blue text-white"
                      : "bg-white/5 text-wge-cream/60 hover:bg-white/10 hover:text-wge-cream"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 rounded-lg px-3 py-2">{error}</p>
          )}
          {success && (
            <p className="text-sm text-green-400 bg-green-400/10 rounded-lg px-3 py-2">Profile saved.</p>
          )}

          <Button type="submit" disabled={saving} className="rounded-xl">
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </div>

      {/* Change password */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <h2 className="text-sm font-semibold text-wge-cream mb-5">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-wge-cream/70 mb-1.5">New password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/10 text-wge-cream placeholder-wge-cream/40 focus:outline-none focus:ring-2 focus:ring-wge-blue text-sm"
              placeholder="Min. 8 characters"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-wge-cream/70 mb-1.5">Confirm password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/10 text-wge-cream placeholder-wge-cream/40 focus:outline-none focus:ring-2 focus:ring-wge-blue text-sm"
              placeholder="Repeat new password"
            />
          </div>

          {pwError && (
            <p className="text-sm text-red-400 bg-red-400/10 rounded-lg px-3 py-2">{pwError}</p>
          )}
          {pwSuccess && (
            <p className="text-sm text-green-400 bg-green-400/10 rounded-lg px-3 py-2">Password updated.</p>
          )}

          <Button type="submit" variant="outline" disabled={pwLoading} className="rounded-xl">
            {pwLoading ? "Updating…" : "Update password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
