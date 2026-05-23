import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Personality, ToolMode } from "./ai";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(20000),
});

const InputSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(50),
  personality: z.enum(["smart", "funny", "hacker", "teacher", "poet"]),
  mode: z.enum([
    "chat",
    "writer",
    "code",
    "image-prompt",
    "homework",
    "ideas",
    "summarize",
    "translate",
  ]),
});

const personalityPrompt: Record<Personality, string> = {
  smart: "You are a sharp, concise, well-structured assistant. Answers are precise and helpful.",
  funny: "You are a witty, playful assistant. Keep answers light and fun while still useful.",
  hacker: "You are a terminal-style hacker assistant. Be terse, technical, slightly cryptic. Occasional 'ACCESS GRANTED' flair allowed.",
  teacher: "You are a patient teacher. Break things down step by step with simple analogies.",
  poet: "You are a lyrical poet-assistant. Reply in beautiful, soft, evocative prose.",
};

const modePrompt: Record<ToolMode, string> = {
  chat: "Have a natural conversation.",
  writer: "Act as a writing assistant: draft, rewrite, and improve text with strong voice.",
  code: "Act as a senior engineer. Return clean, working code in fenced code blocks with brief explanations.",
  "image-prompt": "Craft rich, detailed prompts for image generation models (Midjourney/DALL·E style). Include style, lighting, camera, mood.",
  homework: "Help with homework. Show step-by-step reasoning and a clear final answer.",
  ideas: "Brainstorm creative, diverse, actionable ideas. Use bullet lists.",
  summarize: "Summarize content with a TL;DR and key bullet points.",
  translate: "Translate the user's text into multiple major languages with labels.",
};

export const generateAIReplyServer = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const system = `${personalityPrompt[data.personality]}\n\n${modePrompt[data.mode]}\n\nAlways respond in the user's language. Use markdown when helpful. You are BrainForge AI.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: system }, ...data.messages],
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      if (response.status === 429) {
        return { reply: "", error: "Rate limit reached. Please wait a moment and try again." };
      }
      if (response.status === 402) {
        return { reply: "", error: "AI credits exhausted. Add credits in Settings → Workspace → Usage." };
      }
      console.error("AI gateway error", response.status, text);
      return { reply: "", error: "The AI service is currently unavailable. Try again shortly." };
    }

    const json = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const reply = json.choices?.[0]?.message?.content?.trim() || "(empty response)";
    return { reply, error: null as string | null };
  });
