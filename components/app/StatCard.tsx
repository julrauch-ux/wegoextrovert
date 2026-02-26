interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
}

export default function StatCard({ label, value, icon, description }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] p-6 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-wge-cream/50">{label}</p>
          <p className="mt-2 text-3xl font-bold text-wge-cream">{value}</p>
          {description && (
            <p className="mt-1 text-xs text-wge-cream/40">{description}</p>
          )}
        </div>
        <div className="w-10 h-10 rounded-xl bg-wge-blue/10 text-wge-blue flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
}
