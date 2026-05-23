import { Link, useRouterState } from "@tanstack/react-router";
import { MessageSquare, History, Sparkles, Settings, LogOut, Plus, Trophy } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

const items = [
  { to: "/chat", label: "Chat", icon: MessageSquare },
  { to: "/tools", label: "AI Tools", icon: Sparkles },
  { to: "/history", label: "History", icon: History },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar({ onNewChat }: { onNewChat?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user, signOut } = useAuth();

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col gap-4 border-r border-border/60 bg-surface/40 px-3 py-4 backdrop-blur-xl">
      <div className="px-2">
        <Logo />
      </div>

      <button
        onClick={onNewChat}
        className="mx-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-3 py-2.5 text-sm font-semibold text-background shadow-[var(--glow-cyan)] transition-transform hover:scale-[1.02]"
      >
        <Plus className="h-4 w-4" /> New chat
      </button>

      <nav className="flex flex-col gap-1 px-1">
        {items.map((it) => {
          const Icon = it.icon;
          const active = path.startsWith(it.to);
          return (
            <Link
              key={it.to}
              to={it.to}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
              )}
            >
              <Icon className={cn("h-4 w-4", active && "drop-shadow-[0_0_6px_var(--neon-cyan)]")} />
              {it.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-2 px-1">
        {user && (
          <div className="glass flex items-center gap-3 rounded-xl p-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-surface-2 text-lg">
              {user.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{user.name}</div>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Trophy className="h-3 w-3 text-accent" />
                Lvl {user.level} · {user.xp} XP
              </div>
            </div>
            <button
              onClick={signOut}
              className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-surface-2 hover:text-destructive"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

export function MobileNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-primary/20 px-2 py-2">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {items.map((it) => {
          const Icon = it.icon;
          const active = path.startsWith(it.to);
          return (
            <Link
              key={it.to}
              to={it.to}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[10px] transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
