"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

export default function SidebarLink({ href, icon, label }: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
        isActive
          ? "bg-wge-blue/15 text-wge-blue"
          : "text-wge-cream/60 hover:bg-white/5 hover:text-wge-cream"
      )}
    >
      <span className="w-5 h-5 flex-shrink-0">{icon}</span>
      {label}
    </Link>
  );
}
