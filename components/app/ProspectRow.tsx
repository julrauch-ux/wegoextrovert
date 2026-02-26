import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Prospect } from "@/lib/types";

interface ProspectRowProps {
  prospect: Prospect & { campaigns?: { name: string } | null };
}

export default function ProspectRow({ prospect }: ProspectRowProps) {
  return (
    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
      <td className="py-3 pl-4 pr-3">
        <Link href={`/prospects/${prospect.id}`} className="font-medium text-sm text-wge-cream hover:text-wge-blue transition-colors">
          {prospect.full_name}
        </Link>
        {prospect.title && (
          <p className="text-xs text-wge-cream/40 mt-0.5">{prospect.title}</p>
        )}
      </td>
      <td className="py-3 px-3 text-sm text-wge-cream/70">{prospect.company ?? "—"}</td>
      <td className="py-3 px-3">
        {prospect.campaigns?.name ? (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-wge-blue/10 text-wge-blue">
            {prospect.campaigns.name}
          </span>
        ) : (
          <span className="text-xs text-wge-cream/30">—</span>
        )}
      </td>
      <td className="py-3 px-3 text-sm text-center text-wge-cream/70">{prospect.touchpoint_count}</td>
      <td className="py-3 px-3 text-xs text-wge-cream/40">{formatDate(prospect.created_at)}</td>
      <td className="py-3 pl-3 pr-4 text-right">
        <Link
          href={`/prospects/${prospect.id}`}
          className="text-xs text-wge-blue/70 hover:text-wge-blue transition-colors"
        >
          View →
        </Link>
      </td>
    </tr>
  );
}
