import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Campaign } from "@/lib/types";

const GOAL_LABELS: Record<string, string> = {
  warm_outreach: "Warm Outreach",
  hiring: "Hiring",
  partnerships: "Partnerships",
  sales: "Sales",
  networking: "Networking",
};

interface CampaignCardProps {
  campaign: Campaign & { prospect_count?: number };
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] p-5 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-wge-cream truncate">{campaign.name}</h3>
          <span className="text-xs text-wge-cream/50">
            {GOAL_LABELS[campaign.goal] ?? campaign.goal}
          </span>
        </div>
        <span className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
          campaign.is_active
            ? "bg-green-500/10 text-green-400"
            : "bg-white/5 text-wge-cream/40"
        }`}>
          {campaign.is_active ? "Active" : "Paused"}
        </span>
      </div>

      {campaign.description && (
        <p className="text-sm text-wge-cream/60 mb-3 line-clamp-2">{campaign.description}</p>
      )}

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
        <div className="flex items-center gap-4">
          <span className="text-sm">
            <span className="font-semibold text-wge-cream">{campaign.prospect_count ?? 0}</span>
            <span className="text-wge-cream/40 ml-1">prospects</span>
          </span>
          <span className="text-xs text-wge-cream/30">{formatDate(campaign.created_at)}</span>
        </div>
        <Link
          href={`/prospects?campaign=${campaign.id}`}
          className="text-xs text-wge-blue/70 hover:text-wge-blue transition-colors"
        >
          View prospects →
        </Link>
      </div>
    </div>
  );
}
