import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import CampaignCard from "@/components/app/CampaignCard";
import EmptyState from "@/components/app/EmptyState";
import type { Campaign } from "@/lib/types";

export default async function CampaignsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch campaigns with prospect counts
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: prospectCounts } = await supabase
    .from("prospects")
    .select("campaign_id")
    .eq("user_id", user.id)
    .not("campaign_id", "is", null);

  const countMap: Record<string, number> = {};
  for (const p of prospectCounts ?? []) {
    if (p.campaign_id) {
      countMap[p.campaign_id] = (countMap[p.campaign_id] ?? 0) + 1;
    }
  }

  const campaignList = ((campaigns ?? []) as Campaign[]).map((c) => ({
    ...c,
    prospect_count: countMap[c.id] ?? 0,
  }));

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-wge-cream">Campaigns</h1>
          <p className="text-wge-cream/50 mt-1">Organize your outreach into focused campaigns</p>
        </div>
        <Link
          href="/campaigns/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-wge-blue text-white text-sm font-semibold hover:opacity-90 transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Campaign
        </Link>
      </div>

      {campaignList.length === 0 ? (
        <EmptyState
          title="No campaigns yet"
          description="Create a campaign to organize your LinkedIn outreach prospects."
          action={
            <Link
              href="/campaigns/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-wge-blue text-white text-sm font-semibold hover:opacity-90 transition-all"
            >
              Create campaign
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {campaignList.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  );
}
