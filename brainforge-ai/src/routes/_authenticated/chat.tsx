import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChatInput } from "@/components/ChatInput";
import { ChatMessageView } from "@/components/ChatMessage";
import { useAuth } from "@/lib/auth";
import {
  type Chat,
  createChat,
  getChat,
  upsertChat,
} from "@/lib/chat-store";
import {
  PERSONALITIES,
  TOOL_MODES,
  type Personality,
  type ToolMode,
} from "@/lib/ai";
import { generateAIReplyServer } from "@/lib/ai.functions";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, ChevronDown } from "lucide-react";

interface Search {
  id?: string;
  mode?: ToolMode;
  new?: string;
}

export const Route = createFileRoute("/_authenticated/chat")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    id: typeof s.id === "string" ? s.id : undefined,
    mode: typeof s.mode === "string" ? (s.mode as ToolMode) : undefined,
    new: typeof s.new === "string" ? s.new : undefined,
  }),
  component: ChatPage,
});

function ChatPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [chat, setChat] = useState<Chat | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [personality, setPersonality] = useState<Personality>("smart");
  const [mode, setMode] = useState<ToolMode>(search.mode || "chat");
  const scrollRef = useRef<HTMLDivElement>(null);
  const callAI = useServerFn(generateAIReplyServer);

  const runAI = async (history: { role: "user" | "assistant"; content: string }[]) => {
    try {
      const res = await callAI({ data: { messages: history, personality, mode } });
      if (res.error) return `⚠️ ${res.error}`;
      return res.reply;
    } catch (e) {
      console.error(e);
      return "⚠️ Something went wrong reaching the AI. Please try again.";
    }
  };

  // Initialize / load chat
  useEffect(() => {
    if (search.id) {
      const found = getChat(search.id);
      if (found) {
        setChat(found);
        setPersonality(found.personality);
        setMode(found.mode);
        return;
      }
    }
    if (search.new || !chat) {
      const c = createChat(personality, search.mode || mode);
      setChat(c);
      navigate({ to: "/chat", search: { id: c.id }, replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.id, search.new]);

  // Persist mode/personality changes
  useEffect(() => {
    if (!chat) return;
    if (chat.personality !== personality || chat.mode !== mode) {
      const next = { ...chat, personality, mode, updatedAt: Date.now() };
      setChat(next);
      upsertChat(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personality, mode]);

  // autoscroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chat?.messages.length, streaming]);

  const send = async (text: string, files: string[]) => {
    if (!chat) return;
    const fileNote = files.length ? `\n\n📎 _Attached: ${files.join(", ")}_` : "";
    const userMsg = {
      id: crypto.randomUUID(),
      role: "user" as const,
      content: text + fileNote,
      createdAt: Date.now(),
    };
    const updated: Chat = {
      ...chat,
      title: chat.messages.length === 0 ? text.slice(0, 48) : chat.title,
      messages: [...chat.messages, userMsg],
      updatedAt: Date.now(),
    };
    setChat(updated);
    upsertChat(updated);
    setStreaming(true);

    try {
      const history = updated.messages.map((m) => ({ role: m.role, content: m.content }));
      const reply = await runAI(history);
      const aiMsg = {
        id: crypto.randomUUID(),
        role: "assistant" as const,
        content: reply,
        createdAt: Date.now(),
      };
      const next: Chat = { ...updated, messages: [...updated.messages, aiMsg], updatedAt: Date.now() };
      setChat(next);
      upsertChat(next);
      if (user) updateUser({ xp: user.xp + 10, level: Math.floor((user.xp + 10) / 100) + 1 });
    } finally {
      setStreaming(false);
    }
  };

  const regenerate = async (msgId: string) => {
    if (!chat) return;
    const idx = chat.messages.findIndex((m) => m.id === msgId);
    if (idx <= 0) return;
    const trimmed: Chat = { ...chat, messages: chat.messages.slice(0, idx), updatedAt: Date.now() };
    setChat(trimmed);
    upsertChat(trimmed);
    setStreaming(true);
    try {
      const history = trimmed.messages.map((m) => ({ role: m.role, content: m.content }));
      const reply = await runAI(history);
      const aiMsg = {
        id: crypto.randomUUID(),
        role: "assistant" as const,
        content: reply,
        createdAt: Date.now(),
      };
      const next: Chat = { ...trimmed, messages: [...trimmed.messages, aiMsg], updatedAt: Date.now() };
      setChat(next);
      upsertChat(next);
    } finally {
      setStreaming(false);
    }
  };

  const deleteMsg = (msgId: string) => {
    if (!chat) return;
    const next: Chat = {
      ...chat,
      messages: chat.messages.filter((m) => m.id !== msgId),
      updatedAt: Date.now(),
    };
    setChat(next);
    upsertChat(next);
  };

  const activeTool = useMemo(() => TOOL_MODES.find((t) => t.id === mode)!, [mode]);

  if (!chat) return null;

  return (
    <div className="flex h-screen flex-col">
      <ChatHeader
        personality={personality}
        setPersonality={setPersonality}
        mode={mode}
        setMode={setMode}
      />

      <div ref={scrollRef} className="scrollbar-thin flex-1 overflow-y-auto">
        {chat.messages.length === 0 ? (
          <EmptyState toolLabel={activeTool.label} toolIcon={activeTool.icon} />
        ) : (
          <div className="mx-auto max-w-3xl py-6">
            {chat.messages.map((m, i) => (
              <ChatMessageView
                key={m.id}
                message={m}
                isLast={i === chat.messages.length - 1}
                isStreaming={streaming && i === chat.messages.length - 1}
                avatar={user?.avatar}
                onRegenerate={m.role === "assistant" ? () => regenerate(m.id) : undefined}
                onDelete={() => deleteMsg(m.id)}
              />
            ))}
            {streaming && chat.messages[chat.messages.length - 1]?.role === "user" && (
              <div className="flex gap-3 px-4 py-4 sm:px-6 animate-fade-up">
                <div className="hidden sm:grid h-9 w-9 place-items-center rounded-lg bg-gradient-primary text-background font-black">B</div>
                <div className="glass flex items-center gap-1.5 rounded-2xl px-4 py-3">
                  <Dot delay="0s" /><Dot delay="0.15s" /><Dot delay="0.3s" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="sticky bottom-0 px-3 pb-4 pt-2 sm:px-6">
        <ChatInput onSend={send} disabled={streaming} />
        <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-muted-foreground">
          BrainForge can make mistakes. Connect a real model in Settings for live answers.
        </p>
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="h-2 w-2 rounded-full bg-primary"
      style={{ animation: "pulse-glow 1.2s ease-in-out infinite", animationDelay: delay }}
    />
  );
}

function ChatHeader({
  personality, setPersonality, mode, setMode,
}: {
  personality: Personality;
  setPersonality: (p: Personality) => void;
  mode: ToolMode;
  setMode: (m: ToolMode) => void;
}) {
  return (
    <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-2 border-b border-border/50 bg-background/60 px-4 py-3 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Sparkles className="h-4 w-4 text-primary" />
        BrainForge
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Select label="Mode" value={mode} onChange={(v) => setMode(v as ToolMode)}
          options={TOOL_MODES.map((t) => ({ value: t.id, label: `${t.icon} ${t.label}` }))} />
        <Select label="Personality" value={personality} onChange={(v) => setPersonality(v as Personality)}
          options={PERSONALITIES.map((p) => ({ value: p.id, label: p.label }))} />
      </div>
    </header>
  );
}

function Select({
  label, value, onChange, options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="relative inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface/60 px-2.5 py-1.5 text-xs hover:border-primary/40">
      <span className="text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer appearance-none bg-transparent pr-4 font-medium text-foreground outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-surface text-foreground">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none -ml-3 h-3.5 w-3.5 text-muted-foreground" />
    </label>
  );
}

function EmptyState({ toolLabel, toolIcon }: { toolLabel: string; toolIcon: string }) {
  const suggestions = [
    "Write a launch tweet for a futuristic AI app",
    "Generate a Python function to debounce events",
    "Give me 5 startup ideas in renewable energy",
    "Summarize the plot of Inception in 3 bullets",
  ];
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-16 text-center">
      <div className="mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-primary shadow-[var(--glow-cyan)] animate-float">
        <span className="text-3xl">{toolIcon}</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold">
        Ready to forge in <span className="text-gradient">{toolLabel}</span> mode
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Ask anything. Switch personality or mode anytime above.
      </p>
      <div className="mt-8 grid w-full gap-2 sm:grid-cols-2">
        {suggestions.map((s) => (
          <div
            key={s}
            className="glass rounded-xl p-3 text-left text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}
