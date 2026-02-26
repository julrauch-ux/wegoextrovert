import clsx from "clsx";

const plans = [
  {
    name: "Light",
    price: 29,
    description: "Perfect for solo professionals building their personal brand.",
    features: [
      "Up to 30 AI comment suggestions/day",
      "5 AI-generated posts/month",
      "Basic growth analytics",
      "Email support",
    ],
    cta: "Join Waitlist",
    highlighted: false,
  },
  {
    name: "Business",
    price: 49,
    description: "For growth-focused professionals ready to accelerate results.",
    features: [
      "Unlimited AI comment suggestions",
      "20 AI-generated posts/month",
      "Advanced analytics & insights",
      "Smart targeting engine",
      "Scheduled publishing",
      "Priority support",
    ],
    cta: "Join Waitlist",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Pro",
    price: 75,
    description: "For teams and power users who want maximum LinkedIn impact.",
    features: [
      "Everything in Business",
      "Unlimited content generation",
      "Lead inbox & CRM integration",
      "Team collaboration (up to 5 seats)",
      "Custom AI voice training",
      "Dedicated account manager",
    ],
    cta: "Join Waitlist",
    highlighted: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="section-padding border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-wge-blue uppercase tracking-widest mb-3">
            Pricing
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Simple,{" "}
            <span className="text-gradient">transparent pricing</span>
          </h2>
          <p className="mt-4 text-wge-cream/50">
            Early waitlist members get 50% off for their first 3 months.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={clsx(
                "relative rounded-2xl border p-8 transition-all duration-300",
                plan.highlighted
                  ? "border-wge-blue/50 bg-wge-blue/5 ring-1 ring-wge-blue/30 scale-[1.02] shadow-[0_0_40px_rgba(42,42,255,0.15)]"
                  : "border-white/5 bg-white/[0.02] hover:border-white/10"
              )}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-block px-4 py-1 rounded-full text-xs font-semibold text-white bg-wge-gradient shadow-[0_0_16px_rgba(42,42,255,0.4)]">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan name */}
              <p className="text-sm font-medium text-wge-cream/60 uppercase tracking-widest mb-2">
                {plan.name}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-5xl font-black text-wge-cream">${plan.price}</span>
                <span className="text-wge-cream/40 text-sm">/month</span>
              </div>

              <p className="text-sm text-wge-cream/50 mb-6 leading-relaxed">
                {plan.description}
              </p>

              {/* CTA */}
              <a
                href="#hero-form"
                className={clsx(
                  "block w-full text-center rounded-full py-3 text-sm font-semibold transition-all duration-200 mb-6",
                  plan.highlighted
                    ? "bg-wge-gradient text-white hover:opacity-90 shadow-[0_0_20px_rgba(42,42,255,0.3)]"
                    : "border border-white/10 text-wge-cream hover:bg-white/5"
                )}
              >
                {plan.cta}
              </a>

              {/* Features */}
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <svg
                      className={clsx(
                        "w-4 h-4 mt-0.5 shrink-0",
                        plan.highlighted ? "text-wge-blue" : "text-wge-purple/70"
                      )}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-wge-cream/60">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
