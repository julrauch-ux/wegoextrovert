import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProspectRow from "@/components/app/ProspectRow";
import EmptyState from "@/components/app/EmptyState";
import type { Prospect } from "@/lib/types";

export default async function ProspectsPage({
  searchParams,
}: {
  searchParams: { campaign?: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let query = supabase
    .from("prospects")
    .select("*, campaigns(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (searchParams.campaign) {
    query = query.eq("campaign_id", searchParams.campaign);
  }

  const { data: prospects } = await query;
  const prospectList = (prospects ?? []) as (Prospect & { campaigns?: { name: string } | null })[];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-wge-cream">Prospects</h1>
          <p className="text-wge-cream/50 mt-1">
            {searchParams.campaign ? "Filtered by campaign" : "All your LinkedIn prospects"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {searchParams.campaign && (
            <Link href="/prospects" className="text-sm text-wge-cream/50 hover:text-wge-cream transition-colors">
              Clear filter
            </Link>
          )}
          <Link
            href="/prospects/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-wge-blue text-white text-sm font-semibold hover:opacity-90 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Prospect
          </Link>
        </div>
      </div>

      {prospectList.length === 0 ? (
        <EmptyState
          title="No prospects yet"
          description="Add your first prospect to start tracking LinkedIn engagement."
          action={
            <Link
              href="/prospects/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-wge-blue text-white text-sm font-semibold hover:opacity-90 transition-all"
            >
              Add prospect
            </Link>
          }
        />
      ) : (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="py-3 pl-4 pr-3 text-left text-xs font-semibold text-wge-cream/40 uppercase tracking-wider">Name</th>
                <th className="py-3 px-3 text-left text-xs font-semibold text-wge-cream/40 uppercase tracking-wider">Company</th>
                <th className="py-3 px-3 text-left text-xs font-semibold text-wge-cream/40 uppercase tracking-wider">Campaign</th>
                <th className="py-3 px-3 text-center text-xs font-semibold text-wge-cream/40 uppercase tracking-wider">Touchpoints</th>
                <th className="py-3 px-3 text-left text-xs font-semibold text-wge-cream/40 uppercase tracking-wider">Added</th>
                <th className="py-3 pl-3 pr-4" />
              </tr>
            </thead>
            <tbody>
              {prospectList.map((prospect) => (
                <ProspectRow key={prospect.id} prospect={prospect} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
