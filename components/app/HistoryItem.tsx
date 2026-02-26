import { formatDate, truncate } from "@/lib/utils";
import CopyButton from "./CopyButton";

interface HistoryItemProps {
  type: "comment" | "post";
  title: string;
  preview: string;
  date: string;
  copyText?: string;
}

export default function HistoryItem({ type, title, preview, date, copyText }: HistoryItemProps) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-white/5 last:border-0">
      <div className={`mt-0.5 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
        type === "comment"
          ? "bg-wge-blue/15 text-wge-blue"
          : "bg-wge-purple/15 text-wge-purple"
      }`}>
        {type === "comment" ? "Comment" : "Post"}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-wge-cream">{truncate(title, 70)}</p>
        <p className="text-xs text-wge-cream/40 mt-0.5 truncate">{truncate(preview, 100)}</p>
        <p className="text-xs text-wge-cream/30 mt-1">{formatDate(date)}</p>
      </div>
      {copyText && <CopyButton text={copyText} />}
    </div>
  );
}
