import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 select-none"
      aria-label="CEFITIPS inicio"
    >
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        aria-hidden="true"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="50%" stopColor="#F43F5E" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
        <path
          d="M18 3 L33 11 L33 25 L18 33 L3 25 L3 11 Z"
          fill="url(#logoGrad)"
        />
        <path
          d="M12 14 L18 18 L24 14 M12 22 L18 18 L24 22"
          stroke="#0B0617"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <span
        className="text-lg font-black tracking-tight"
        style={{ fontFamily: "var(--font-display, Outfit, sans-serif)" }}
      >
        CEFI
        <span className="gradient-text">TIPS</span>
      </span>
    </Link>
  );
}
