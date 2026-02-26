"use client";

import { useState, FormEvent } from "react";
import clsx from "clsx";

interface WaitlistFormProps {
  variant?: "hero" | "banner";
}

export default function WaitlistForm({ variant = "hero" }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "You're on the list!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div
        className={clsx(
          "flex flex-col items-center gap-2 text-center",
          variant === "hero" ? "max-w-md" : "max-w-lg"
        )}
      >
        <div className="flex items-center gap-2 text-wge-cream">
          <svg className="w-5 h-5 text-wge-blue" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-semibold">{message}</span>
        </div>
        <p className="text-sm text-wge-cream/60">
          We&apos;ll reach out when we launch. Stay tuned!
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={clsx(
        "flex flex-col sm:flex-row gap-3",
        variant === "hero" ? "w-full max-w-md" : "w-full max-w-lg"
      )}
    >
      <div className="flex-1">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your work email"
          required
          disabled={status === "loading"}
          className={clsx(
            "w-full rounded-full px-5 py-3 bg-white/5 border text-wge-cream placeholder-wge-cream/40 focus:outline-none focus:ring-2 focus:ring-wge-blue transition-all duration-200 text-sm",
            status === "error"
              ? "border-red-500/60 focus:ring-red-500"
              : "border-white/10 focus:border-wge-blue/60",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          aria-label="Email address"
        />
        {status === "error" && message && (
          <p className="mt-1 text-xs text-red-400 pl-4">{message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={status === "loading" || !email}
        className="inline-flex items-center justify-center rounded-full px-6 py-3 bg-wge-gradient text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_24px_rgba(42,42,255,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 whitespace-nowrap"
      >
        {status === "loading" ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Joining...
          </span>
        ) : (
          "Join Waitlist"
        )}
      </button>
    </form>
  );
}
