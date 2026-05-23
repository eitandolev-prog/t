import { createFileRoute, Link } from "@tanstack/react-router";
import { TOOL_MODES, type ToolMode } from "@/lib/ai";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/tools")({
  component: ToolsPage,
});

function ToolsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          AI tools
        </div>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold">Pick a superpower</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Each tool tunes BrainForge for a specific job. Tap one to start a focused chat.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TOOL_MODES.map((t) => (
          <ToolCard key={t.id} mode={t.id} icon={t.icon} label={t.label} desc={t.desc} />
        ))}
      </div>
    </div>
  );
}

function ToolCard({
  mode, icon, label, desc,
}: { mode: ToolMode; icon: string; label: string; desc: string }) {
  return (
    <Link
      to="/chat"
      search={{ mode, new: "1" } as never}
      className="glass group block rounded-2xl p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--glow-cyan)]"
    >
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary text-2xl shadow-[var(--glow-cyan)]">
        {icon}
      </div>
      <h3 className="text-base font-semibold">{label}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      <div className="mt-4 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
        Open →
      </div>
    </Link>
  );
}
