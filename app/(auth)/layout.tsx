import NebulaBackground from "@/components/ui/nebula-background";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0617]">
      <NebulaBackground />
      <div className="grid-overlay fixed inset-0 pointer-events-none" aria-hidden="true" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
