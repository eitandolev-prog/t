import { cn } from "@/lib/utils";

export function Logo({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className="grid place-items-center rounded-lg bg-gradient-primary animate-pulse-glow"
        style={{ width: size, height: size }}
        aria-hidden
      >
        <span className="text-background text-base font-black">B</span>
      </div>
      <span className="text-lg font-bold tracking-tight">
        Brain<span className="text-gradient">Forge</span>
      </span>
    </div>
  );
}
