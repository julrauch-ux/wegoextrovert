import Link from "next/link";
import SparkleIcon from "@/components/ui/SparkleIcon";
import ArcDecoration from "@/components/ui/ArcDecoration";
import Button from "@/components/ui/Button";

export default function CtaBannerSection() {
  return (
    <section className="relative section-padding overflow-hidden border-t border-white/5">
      {/* Gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-wge-blue/10 via-transparent to-wge-purple/10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-wge-gradient opacity-20" />
      </div>

      {/* Arc decoration */}
      <ArcDecoration
        variant="top"
        className="absolute top-0 left-0 right-0 w-full h-16 opacity-20"
      />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Sparkle */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-wge-gradient flex items-center justify-center shadow-[0_0_24px_rgba(42,42,255,0.4)]">
            <SparkleIcon size={20} className="text-white" />
          </div>
        </div>

        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          Ready to become{" "}
          <span className="text-gradient">the most visible person</span>{" "}
          in your industry?
        </h2>

        <p className="text-lg text-wge-cream/50 mb-10 max-w-xl mx-auto">
          Start building your LinkedIn presence today — AI-powered, fully automated, and built for results.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup">
            <Button size="lg" className="w-full sm:w-auto px-10">
              Get Started Free
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto px-10">
              Sign in
            </Button>
          </Link>
        </div>

        <p className="mt-6 text-xs text-wge-cream/30">
          No credit card required &bull; Cancel anytime
        </p>
      </div>
    </section>
  );
}
