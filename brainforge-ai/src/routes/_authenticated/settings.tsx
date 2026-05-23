import { createFileRoute } from "@tanstack/react-router";
import { AVATAR_OPTIONS, useAuth } from "@/lib/auth";
import { PERSONALITIES, type Personality } from "@/lib/ai";
import { useState } from "react";
import { Trophy, Sparkles, LogOut, Bell, Volume2 } from "lucide-react";
import { clearAllChats } from "@/lib/chat-store";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { user, updateUser, signOut } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [personality, setPersonality] = useState<Personality>("smart");
  const [sound, setSound] = useState(true);
  const [notifs, setNotifs] = useState(true);

  if (!user) return null;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Settings
        </div>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold">Preferences</h1>
      </header>

      <Section title="Profile">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-surface-2 text-3xl">
            {user.avatar}
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold">{user.name}</div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-accent">
              <Trophy className="h-3 w-3" /> Level {user.level} · {user.xp} XP
            </div>
          </div>
        </div>

        <Field label="Display name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => name.trim() && updateUser({ name: name.trim() })}
            className="w-full rounded-lg border border-border bg-surface/60 px-3 py-2 text-sm outline-none focus:border-primary/60"
          />
        </Field>

        <Field label="Avatar">
          <div className="flex flex-wrap gap-2">
            {AVATAR_OPTIONS.map((a) => (
              <button
                key={a}
                onClick={() => updateUser({ avatar: a })}
                className={`grid h-10 w-10 place-items-center rounded-lg border text-xl transition-all ${
                  user.avatar === a
                    ? "border-primary bg-primary/10 shadow-[var(--glow-cyan)]"
                    : "border-border bg-surface/60 hover:border-primary/40"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </Field>
      </Section>

      <Section title="AI personality (default)">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {PERSONALITIES.map((p) => (
            <button
              key={p.id}
              onClick={() => setPersonality(p.id)}
              className={`text-left rounded-xl border p-3 transition-all ${
                personality === p.id
                  ? "border-primary bg-primary/5 shadow-[var(--glow-cyan)]"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <div className="text-sm font-semibold">{p.label}</div>
              <div className="text-xs text-muted-foreground">{p.desc}</div>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Notifications & sound">
        <Toggle icon={<Bell className="h-4 w-4" />} label="Push notifications" value={notifs} onChange={setNotifs} />
        <Toggle icon={<Volume2 className="h-4 w-4" />} label="Sound effects" value={sound} onChange={setSound} />
      </Section>

      <Section title="Danger zone">
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            onClick={() => { if (confirm("Delete all chat history?")) clearAllChats(); }}
            className="rounded-xl border border-destructive/40 px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
          >
            Clear chat history
          </button>
          <button
            onClick={signOut}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2 text-sm hover:bg-surface-2"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="glass mb-4 rounded-2xl p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</div>
      {children}
    </div>
  );
}

function Toggle({
  icon, label, value, onChange,
}: { icon: React.ReactNode; label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="flex w-full items-center justify-between rounded-lg border border-border bg-surface/60 px-3 py-2.5 text-sm hover:border-primary/40"
    >
      <span className="flex items-center gap-2">{icon} {label}</span>
      <span
        className={`relative h-5 w-9 rounded-full transition-colors ${
          value ? "bg-gradient-primary shadow-[var(--glow-cyan)]" : "bg-surface-2"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-background transition-transform ${
            value ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}
