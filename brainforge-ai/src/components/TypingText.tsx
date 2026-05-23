import { useEffect, useState } from "react";

/** Reveals `text` character-by-character. Calls onDone when complete. */
export function useTypingReveal(text: string, speed = 12, enabled = true) {
  const [shown, setShown] = useState(enabled ? "" : text);
  const [done, setDone] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      setShown(text);
      setDone(true);
      return;
    }
    setShown("");
    setDone(false);
    if (!text) {
      setDone(true);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += Math.max(1, Math.round(text.length / 600));
      if (i >= text.length) {
        setShown(text);
        setDone(true);
        clearInterval(id);
      } else {
        setShown(text.slice(0, i));
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, enabled]);

  return { shown, done };
}
