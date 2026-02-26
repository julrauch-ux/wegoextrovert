const steps = [
  {
    number: "01",
    title: "Connect Your LinkedIn",
    description:
      "Securely link your LinkedIn account in under 60 seconds. No technical setup required.",
  },
  {
    number: "02",
    title: "Define Your Voice",
    description:
      "Train the AI on your tone, topics, and target audience. It learns to write exactly like you.",
  },
  {
    number: "03",
    title: "AI Does the Heavy Lifting",
    description:
      "wge automatically engages with posts, suggests comments, and drafts content that resonates.",
  },
  {
    number: "04",
    title: "Watch Your Network Grow",
    description:
      "Track follower growth, connection requests, and lead conversations — all in one dashboard.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-padding">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-wge-blue uppercase tracking-widest mb-3">
            How It Works
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            From setup to results{" "}
            <span className="text-gradient">in minutes</span>
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative group p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-wge-blue/20 transition-all duration-300"
            >
              {/* Number */}
              <div className="text-5xl font-black text-gradient opacity-30 mb-4 leading-none">
                {step.number}
              </div>

              <h3 className="text-lg font-semibold text-wge-cream mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-wge-cream/50 leading-relaxed">
                {step.description}
              </p>

              {/* Hover accent */}
              <div className="absolute inset-x-0 bottom-0 h-px bg-wge-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
