import { cn } from "@/lib/utils";
import type { Tone } from "@/lib/types";

const TONES: { value: Tone; label: string }[] = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "witty", label: "Witty" },
  { value: "inspirational", label: "Inspirational" },
];

interface ToneSelectorProps {
  value: Tone;
  onChange: (tone: Tone) => void;
}

export default function ToneSelector({ value, onChange }: ToneSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-wge-cream/70 mb-2">Tone</label>
      <div className="flex flex-wrap gap-2">
        {TONES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange(t.value)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
              value === t.value
                ? "bg-wge-blue text-white"
                : "bg-white/5 text-wge-cream/60 hover:bg-white/10 hover:text-wge-cream"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
