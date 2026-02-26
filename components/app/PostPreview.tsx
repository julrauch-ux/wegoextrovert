"use client";

import { useState } from "react";
import CopyButton from "./CopyButton";

interface PostPreviewProps {
  content: string;
  postId?: string;
  onSave?: () => void;
}

export default function PostPreview({ content, postId, onSave }: PostPreviewProps) {
  const [saved, setSaved] = useState(!!postId);

  async function handleSave() {
    if (saved || !postId) return;
    setSaved(true);
    onSave?.();
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-wge-cream">Generated Post</h2>
        <div className="flex items-center gap-2">
          <CopyButton text={content} />
          <button
            onClick={handleSave}
            disabled={saved}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
              saved
                ? "bg-green-500/15 text-green-400 cursor-default"
                : "bg-white/5 text-wge-cream/50 hover:bg-white/10 hover:text-wge-cream"
            }`}
          >
            {saved ? (
              <>
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Saved
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                </svg>
                Save Draft
              </>
            )}
          </button>
        </div>
      </div>
      <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
        <p className="text-sm text-wge-cream/90 leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}
