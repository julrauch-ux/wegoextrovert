import { cn } from "@/lib/utils";
import type { PostFormat } from "@/lib/types";

const FORMATS: { value: PostFormat; label: string; description: string }[] = [
  { value: "short", label: "Short", description: "Punchy & concise" },
  { value: "long", label: "Long", description: "Story + takeaways" },
  { value: "list", label: "List", description: "Numbered bullets" },
  { value: "hook-heavy", label: "Hook-Heavy", description: "Bold opener" },
  { value: "question", label: "Question", description: "Thought-provoking" },
];

interface FormatSelectorProps {
  value: PostFormat;
  onChange: (format: PostFormat) => void;
}

export default function FormatSelector({ value, onChange }: FormatSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-wge-cream/70 mb-2">Format</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {FORMATS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => onChange(f.value)}
            className={cn(
              "flex flex-col items-start px-3 py-2.5 rounded-xl border text-left transition-all",
              value === f.value
                ? "border-wge-blue bg-wge-blue/10 text-wge-blue"
                : "border-white/10 bg-white/[0.02] text-wge-cream/60 hover:bg-white/5 hover:text-wge-cream"
            )}
          >
            <span className="text-sm font-medium">{f.label}</span>
            <span className="text-xs opacity-60 mt-0.5">{f.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
