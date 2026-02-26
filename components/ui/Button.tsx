import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-wge-blue focus-visible:ring-offset-2 focus-visible:ring-offset-wge-black disabled:opacity-50 disabled:cursor-not-allowed",
        {
          "bg-wge-gradient text-white hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_24px_rgba(42,42,255,0.35)]":
            variant === "primary",
          "border border-wge-blue text-wge-blue hover:bg-wge-blue/10 active:bg-wge-blue/20":
            variant === "outline",
          "text-wge-cream/70 hover:text-wge-cream active:text-wge-cream/80":
            variant === "ghost",
        },
        {
          "px-4 py-2 text-sm": size === "sm",
          "px-6 py-3 text-base": size === "md",
          "px-8 py-4 text-lg": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
