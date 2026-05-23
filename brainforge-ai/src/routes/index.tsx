import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Code2, Languages, Lightbulb, MessageSquare, Zap } from "lucide-react";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo />
        <nav className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
            Sign in
          </Link>
          <Link
            to="/login"
            className="rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-background shadow-[var(--glow-cyan)] transition-transform hover:scale-105"
          >
            Launch app
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 pt-10 pb-24">
        <section className="text-center">
          <div className="mx-auto inline-flex animate-fade-up items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            New · Personality modes, tools & chat history
          </div>
          <h1 className="mt-6 text-5xl sm:text-6xl md:text-7xl font-black tracking-tight animate-fade-up">
            Forge ideas at the
            <br />
            <span className="text-gradient">speed of thought.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-muted-foreground animate-fade-up">
            BrainForge AI is your neon-lit workspace for writing, coding,
            translating, and brainstorming — all in one cinematic chat.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 animate-fade-up">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-background shadow-[var(--glow-cyan)] transition-transform hover:scale-105"
            >
              <Zap className="h-4 w-4" /> Start forging — it's free
            </Link>
            <a
              href="#features"
              className="rounded-xl border border-border px-6 py-3 text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary"
            >
              See what it does
            </a>
          </div>
        </section>

        <section id="features" className="mt-24 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: MessageSquare, title: "Cinematic AI chat", desc: "Typing animation, markdown, code blocks, regenerate & copy." },
            { icon: Code2, title: "Code generator", desc: "Snippets in any language with one prompt." },
            { icon: Lightbulb, title: "Idea engine", desc: "Brainstorm products, plots, projects, and pivots." },
            { icon: Languages, title: "Multi-language translate", desc: "Native-feeling output across 50+ languages." },
            { icon: Sparkles, title: "Personality modes", desc: "Smart, funny, hacker, teacher, poet — pick a vibe." },
            { icon: Zap, title: "Tools & history", desc: "Writer, summarizer, image prompts. Saved automatically." },
          ].map((f) => {
            const I = f.icon;
            return (
              <div
                key={f.title}
                className="glass group rounded-2xl p-5 transition-transform hover:-translate-y-1"
              >
                <div className="mb-3 inline-grid h-10 w-10 place-items-center rounded-lg bg-gradient-primary text-background shadow-[var(--glow-cyan)]">
                  <I className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            );
          })}
        </section>
      </main>

      <footer className="border-t border-border/50 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} BrainForge AI · Forged with ⚡
      </footer>
    </div>
  );
}
