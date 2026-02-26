import CopyButton from "./CopyButton";

interface CommentCardProps {
  index: number;
  text: string;
}

export default function CommentCard({ index, text }: CommentCardProps) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] p-5 transition-colors group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3 flex-1 min-w-0">
          <span className="w-6 h-6 rounded-full bg-wge-blue/10 text-wge-blue text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
            {index + 1}
          </span>
          <p className="text-sm text-wge-cream/90 leading-relaxed">{text}</p>
        </div>
        <CopyButton text={text} />
      </div>
    </div>
  );
}
