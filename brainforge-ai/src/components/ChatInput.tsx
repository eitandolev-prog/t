import { useRef, useState, type FormEvent } from "react";
import { Send, Paperclip, X } from "lucide-react";

interface Props {
  onSend: (text: string, files: string[]) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: Props) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed, files);
    setText("");
    setFiles([]);
  };

  const onFiles = (list: FileList | null) => {
    if (!list) return;
    setFiles((prev) => [...prev, ...Array.from(list).map((f) => f.name)].slice(0, 4));
  };

  return (
    <form
      onSubmit={submit}
      className="glass mx-auto w-full max-w-3xl rounded-2xl border border-primary/20 p-2 shadow-[var(--glow-cyan)]"
    >
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 px-2 pb-2">
          {files.map((f, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-md bg-surface-2 px-2 py-1 text-xs text-muted-foreground"
            >
              📎 {f}
              <button
                type="button"
                onClick={() => setFiles((p) => p.filter((_, j) => j !== i))}
                className="ml-1 hover:text-primary"
                aria-label="Remove file"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex items-end gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-surface-2 hover:text-primary"
          aria-label="Attach file"
        >
          <Paperclip className="h-5 w-5" />
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          hidden
          onChange={(e) => onFiles(e.target.files)}
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit(e as unknown as FormEvent);
            }
          }}
          rows={1}
          placeholder="Ask BrainForge anything…"
          className="min-h-[40px] max-h-40 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground/70"
        />
        <button
          type="submit"
          disabled={!text.trim() || disabled}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-primary text-background shadow-[var(--glow-cyan)] transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          aria-label="Send"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
}
