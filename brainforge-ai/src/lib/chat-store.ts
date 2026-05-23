import { useEffect, useState } from "react";
import type { Personality, ToolMode } from "./ai";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  personality: Personality;
  mode: ToolMode;
  updatedAt: number;
}

const KEY = "brainforge.chats";

function read(): Chat[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Chat[]) : [];
  } catch {
    return [];
  }
}
function write(chats: Chat[]) {
  localStorage.setItem(KEY, JSON.stringify(chats));
  window.dispatchEvent(new Event("brainforge:chats"));
}

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  useEffect(() => {
    setChats(read());
    const handler = () => setChats(read());
    window.addEventListener("brainforge:chats", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("brainforge:chats", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return chats;
}

export function getChat(id: string): Chat | undefined {
  return read().find((c) => c.id === id);
}

export function createChat(personality: Personality, mode: ToolMode): Chat {
  const chat: Chat = {
    id: crypto.randomUUID(),
    title: "New chat",
    messages: [],
    personality,
    mode,
    updatedAt: Date.now(),
  };
  write([chat, ...read()]);
  return chat;
}

export function upsertChat(chat: Chat) {
  const all = read();
  const idx = all.findIndex((c) => c.id === chat.id);
  if (idx === -1) all.unshift(chat);
  else all[idx] = chat;
  all.sort((a, b) => b.updatedAt - a.updatedAt);
  write(all);
}

export function deleteChat(id: string) {
  write(read().filter((c) => c.id !== id));
}

export function clearAllChats() {
  write([]);
}
