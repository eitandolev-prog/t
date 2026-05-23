import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Mail, User, Sparkles, ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { user, ready, signIn } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (ready && user) navigate({ to: "/chat" });
  }, [ready, user, navigate]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    signIn(email.trim(), name.trim() || undefined);
    navigate({ to: "/chat" });
  };

  return (
    <div className="min-h-screen grid place-items-center px-4 py-10">
      <div className="absolute top-6 left-6">
        <Logo />
      </div>

      <div className="glass w-full max-w-md animate-fade-up rounded-3xl border border-primary/20 p-8 shadow-[var(--glow-cyan)]">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary shadow-[var(--glow-cyan)] animate-float">
            <Sparkles className="h-7 w-7 text-background" />
          </div>
          <h1 className="text-2xl font-bold">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin" ? "Sign in to keep forging." : "Join in seconds — no card needed."}
          </p>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          {mode === "signup" && (
            <Field icon={User} placeholder="Your name" value={name} onChange={setName} />
          )}
          <Field
            icon={Mail}
            type="email"
            placeholder="you@brainforge.ai"
            value={email}
            onChange={setEmail}
            required
          />
          <input type="password" placeholder="••••••••" className="hidden" readOnly />
          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-4 py-3 text-sm font-semibold text-background shadow-[var(--glow-cyan)] transition-transform hover:scale-[1.02]"
          >
            {mode === "signin" ? "Sign in" : "Create account"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="font-semibold text-primary hover:underline"
          >
            {mode === "signin" ? "Create one" : "Sign in"}
          </button>
        </p>

        <p className="mt-4 text-center text-[11px] text-muted-foreground">
          Demo auth — no password required. Wire to Lovable Cloud later.
        </p>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  ...props
}: {
  icon: React.ComponentType<{ className?: string }>;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-border bg-surface/60 px-3 py-2.5 focus-within:border-primary/60 focus-within:shadow-[var(--glow-cyan)] transition-shadow">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <input
        type={props.type || "text"}
        placeholder={props.placeholder}
        value={props.value}
        required={props.required}
        onChange={(e) => props.onChange(e.target.value)}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
      />
    </label>
  );
}
