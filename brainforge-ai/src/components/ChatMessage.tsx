import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, RefreshCw, Trash2, Check } from "lucide-react";
import type { ChatMessage as Msg } from "@/lib/chat-store";
import { useTypingReveal } from "./TypingText";
import { cn } from "@/lib/utils";

interface Props {
  message: Msg;
  isLast: boolean;
  isStreaming?: boolean;
  onRegenerate?: () => void;
  onDelete?: () => void;
  avatar?: string;
}

export function ChatMessageView({
  message,
  isLast,
  isStreaming = false,
  onRegenerate,
  onDelete,
  avatar,
}: Props) {
  const isUser = message.role === "user";
  const animate = !isUser && isLast && isStreaming;
  const { shown, done } = useTypingReveal(message.content, 10, animate);

  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div
      className={cn(
        "group flex gap-3 animate-fade-up px-4 py-4 sm:px-6",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      {!isUser && (
        <div className="hidden sm:grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-primary text-background font-black shadow-[var(--glow-cyan)]">
          B
        </div>
      )}

      <div className={cn("flex max-w-[85%] flex-col gap-2", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm sm:text-[15px] prose-chat",
            isUser
              ? "bg-gradient-primary text-background font-medium shadow-[var(--glow-cyan)]"
              : "glass text-foreground",
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {shown || (animate ? "" : message.content)}
              </ReactMarkdown>
              {animate && !done && (
                <span className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 bg-primary animate-blink" />
              )}
            </>
          )}
        </div>

        {!isUser && (!animate || done) && (
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <IconBtn label={copied ? "Copied" : "Copy"} onClick={copy}>
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </IconBtn>
            {onRegenerate && (
              <IconBtn label="Regenerate" onClick={onRegenerate}>
                <RefreshCw className="h-3.5 w-3.5" />
              </IconBtn>
            )}
            {onDelete && (
              <IconBtn label="Delete" onClick={onDelete}>
                <Trash2 className="h-3.5 w-3.5" />
              </IconBtn>
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="hidden sm:grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-2 text-lg">
          {avatar || "🧑‍🚀"}
        </div>
      )}
    </div>
  );
}

function IconBtn({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className="grid h-7 w-7 place-items-center rounded-md border border-border/60 bg-surface/60 text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
    >
      {children}
    </button>
  );
}
