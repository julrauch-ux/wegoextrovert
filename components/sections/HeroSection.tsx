import Link from "next/link";
import SparkleIcon from "@/components/ui/SparkleIcon";
import ArcDecoration from "@/components/ui/ArcDecoration";
import Button from "@/components/ui/Button";

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
            Now Live — Start Growing Today
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

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 opacity-0 animate-fadeUp-delay-3">
          <Link href="/signup">
            <Button size="lg" className="w-full sm:w-auto px-8">
              Get Started Free
            </Button>
          </Link>
          <Link
            href="/login"
            className="text-sm text-wge-cream/60 hover:text-wge-cream transition-colors duration-150"
          >
            Already have an account? Sign in &rarr;
          </Link>
        </div>

        {/* Social proof */}
        <p className="text-sm text-wge-cream/40 opacity-0 animate-fadeUp-delay-3">
          No credit card required &bull; Set up in under 2 minutes
        </p>
      </div>
    </section>
  );
}
