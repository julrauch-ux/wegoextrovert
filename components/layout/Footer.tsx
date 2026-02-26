import SparkleIcon from "@/components/ui/SparkleIcon";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 py-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <SparkleIcon size={16} className="text-wge-blue" />
          <span className="text-sm font-bold text-wge-cream tracking-tight">wge</span>
          <span className="text-sm text-wge-cream/40 ml-1">— wegoextrovert.ai</span>
        </div>

        {/* Copyright */}
        <p className="text-xs text-wge-cream/40">
          &copy; {year} wegoextrovert.ai. All rights reserved.
        </p>

        {/* Links */}
        <div className="flex items-center gap-6">
          <a
            href="#"
            className="text-xs text-wge-cream/40 hover:text-wge-cream/70 transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-xs text-wge-cream/40 hover:text-wge-cream/70 transition-colors"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
