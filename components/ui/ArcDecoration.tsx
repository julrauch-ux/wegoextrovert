interface ArcDecorationProps {
  className?: string;
  variant?: "top" | "bottom";
}

export default function ArcDecoration({
  className = "",
  variant = "top",
}: ArcDecorationProps) {
  return (
    <svg
      viewBox="0 0 1200 120"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      {variant === "top" ? (
        <path
          d="M0,60 Q300,0 600,60 Q900,120 1200,60"
          fill="none"
          stroke="url(#arcGradient)"
          strokeWidth="1"
          opacity="0.4"
        />
      ) : (
        <path
          d="M0,60 Q300,120 600,60 Q900,0 1200,60"
          fill="none"
          stroke="url(#arcGradient)"
          strokeWidth="1"
          opacity="0.4"
        />
      )}
      <defs>
        <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2A2AFF" stopOpacity="0" />
          <stop offset="30%" stopColor="#2A2AFF" stopOpacity="1" />
          <stop offset="70%" stopColor="#7B61FF" stopOpacity="1" />
          <stop offset="100%" stopColor="#7B61FF" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
