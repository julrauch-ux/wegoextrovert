import SparkleIcon from "@/components/ui/SparkleIcon";
import WaitlistForm from "@/components/ui/WaitlistForm";
import ArcDecoration from "@/components/ui/ArcDecoration";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Radial glow background */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-wge-gradient-radial opacity-60" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-wge-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-wge-purple/5 rounded-full blur-3xl" />
      </div>

      {/* Arc decoration */}
      <ArcDecoration
        variant="bottom"
        className="absolute bottom-0 left-0 right-0 w-full h-20 opacity-30"
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-wge-blue/30 bg-wge-blue/5 px-4 py-1.5 mb-8 animate-fadeUp">
          <SparkleIcon size={12} className="text-wge-blue" />
          <span className="text-xs font-medium text-wge-blue tracking-wide uppercase">
            Early Access — Join the Waitlist
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-6 opacity-0 animate-fadeUp-delay-1">
          LinkedIn Growth{" "}
          <span className="text-gradient">on Autopilot</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-wge-cream/60 max-w-2xl mx-auto mb-10 leading-relaxed opacity-0 animate-fadeUp-delay-2">
          AI-powered engagement that builds your LinkedIn presence, grows your
          network, and drives qualified leads — while you focus on what actually
          matters.
        </p>

        {/* Waitlist Form */}
        <div
          id="hero-form"
          className="flex justify-center mb-8 opacity-0 animate-fadeUp-delay-3"
        >
          <WaitlistForm variant="hero" />
        </div>

        {/* Social proof */}
        <p className="text-sm text-wge-cream/40 opacity-0 animate-fadeUp-delay-3">
          Join{" "}
          <span className="text-wge-cream/70 font-medium">500+ professionals</span>{" "}
          already on the waitlist &mdash; no credit card required
        </p>
      </div>
    </section>
  );
}
