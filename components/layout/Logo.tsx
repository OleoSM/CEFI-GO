import Image from "next/image";
import Link from "next/link";

export default function Logo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 select-none" aria-label="CEFI GO inicio">
      <Image
        src="/logos/ICO-mini.png"
        alt="CEFI GO"
        width={36}
        height={36}
        className="shrink-0 rounded-lg"
        priority
      />
      {!collapsed && (
        <span
          className="text-lg font-black tracking-tight"
          style={{ fontFamily: "var(--font-display, Outfit, sans-serif)" }}
        >
          CEFI <span className="gradient-text">GO</span>
        </span>
      )}
    </Link>
  );
}
