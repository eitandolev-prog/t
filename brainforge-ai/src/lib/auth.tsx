import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  createdAt: number;
}

interface AuthContextValue {
  user: AuthUser | null;
  ready: boolean;
  signIn: (email: string, name?: string) => void;
  signOut: () => void;
  updateUser: (patch: Partial<AuthUser>) => void;
}

const AuthCtx = createContext<AuthContextValue | null>(null);
const KEY = "brainforge.user";

const AVATARS = ["🤖", "🧠", "👾", "🦾", "🛸", "🪐", "⚡", "🔮", "🧬", "🚀"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (user) localStorage.setItem(KEY, JSON.stringify(user));
    else localStorage.removeItem(KEY);
  }, [user, ready]);

  const signIn = (email: string, name?: string) => {
    const cleanName = (name || email.split("@")[0] || "Explorer").trim();
    setUser({
      id: crypto.randomUUID(),
      email,
      name: cleanName,
      avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
      xp: 120,
      level: 2,
      createdAt: Date.now(),
    });
  };

  const signOut = () => setUser(null);
  const updateUser = (patch: Partial<AuthUser>) =>
    setUser((u) => (u ? { ...u, ...patch } : u));

  return (
    <AuthCtx.Provider value={{ user, ready, signIn, signOut, updateUser }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export const AVATAR_OPTIONS = AVATARS;
