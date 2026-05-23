import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, MessageSquare, History as HistoryIcon } from "lucide-react";
import { clearAllChats, deleteChat, useChats } from "@/lib/chat-store";

export const Route = createFileRoute("/_authenticated/history")({
  component: HistoryPage,
});

function HistoryPage() {
  const chats = useChats();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <header className="mb-6 flex items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs text-primary">
            <HistoryIcon className="h-3.5 w-3.5" /> History
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold">Your conversations</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Stored locally on this device.
          </p>
        </div>
        {chats.length > 0 && (
          <button
            onClick={() => {
              if (confirm("Delete all chats? This cannot be undone.")) clearAllChats();
            }}
            className="rounded-lg border border-destructive/40 px-3 py-2 text-xs text-destructive hover:bg-destructive/10"
          >
            Clear all
          </button>
        )}
      </header>

      {chats.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground/60" />
          <p className="mt-3 text-sm text-muted-foreground">No chats yet.</p>
          <Link
            to="/chat"
            search={{ new: "1" } as never}
            className="mt-5 inline-flex rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-background shadow-[var(--glow-cyan)]"
          >
            Start your first chat
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {chats.map((c) => (
            <li
              key={c.id}
              className="glass group flex items-center gap-3 rounded-xl p-3 transition-colors hover:border-primary/40"
            >
              <Link
                to="/chat"
                search={{ id: c.id } as never}
                className="flex min-w-0 flex-1 items-center gap-3"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-surface-2 text-base">
                  💬
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{c.title || "Untitled chat"}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {c.mode} · {c.messages.length} messages · {timeAgo(c.updatedAt)}
                  </div>
                </div>
              </Link>
              <button
                onClick={() => deleteChat(c.id)}
                className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                aria-label="Delete chat"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
