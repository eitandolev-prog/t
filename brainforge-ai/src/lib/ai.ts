// Mock AI responder. Swap with real OpenAI call later.
// Returns a string asynchronously. Personality + tool modes shape the reply.

export type Personality = "smart" | "funny" | "hacker" | "teacher" | "poet";
export type ToolMode =
  | "chat"
  | "writer"
  | "code"
  | "image-prompt"
  | "homework"
  | "ideas"
  | "summarize"
  | "translate";

const personalityIntro: Record<Personality, string> = {
  smart: "",
  funny: "😄 ",
  hacker: "> ",
  teacher: "📚 ",
  poet: "🌙 ",
};

const personalityTone: Record<Personality, string> = {
  smart: "Here is a concise, well-structured answer.",
  funny: "Buckle up — here comes a slightly unserious take.",
  hacker: "ACCESS GRANTED. Decrypting response payload...",
  teacher: "Let's break this down step by step so it sticks.",
  poet: "A whisper of insight, lightly verse-shaped.",
};

function fakeCode(lang: string, prompt: string) {
  return `Here's a starter snippet for **${prompt}**:

\`\`\`${lang}
// ${prompt}
function solve(input) {
  // TODO: real logic
  const result = input;
  return result;
}

console.log(solve("hello"));
\`\`\`

Want me to extend it with tests or edge cases?`;
}

function pickLang(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes("python")) return "python";
  if (p.includes("rust")) return "rust";
  if (p.includes("go ")) return "go";
  if (p.includes("sql")) return "sql";
  if (p.includes("html")) return "html";
  return "ts";
}

function bullets(items: string[]) {
  return items.map((i) => `- ${i}`).join("\n");
}

function generateBody(prompt: string, mode: ToolMode): string {
  const trimmed = prompt.trim();
  switch (mode) {
    case "writer":
      return `### Draft

${trimmed}

Here's an improved version with stronger voice and rhythm:

> ${trimmed} — refined, tightened, and ready to publish.

**Suggested next steps:**
${bullets(["Add a concrete example", "Cut filler words", "Punch up the opening line"])}`;

    case "code":
      return fakeCode(pickLang(trimmed), trimmed);

    case "image-prompt":
      return `**Image prompt (Midjourney/DALL·E style):**

> ${trimmed}, cinematic lighting, ultra-detailed, 8k, volumetric fog, neon rim light, shallow depth of field, shot on Hasselblad, --ar 16:9 --v 6

Variations:
${bullets([
  `${trimmed}, isometric, low-poly, vibrant pastel palette`,
  `${trimmed}, dark fantasy oil painting, dramatic chiaroscuro`,
  `${trimmed}, retro-futurist 80s synthwave, chrome and magenta`,
])}`;

    case "homework":
      return `**Question:** ${trimmed}

**Approach**
1. Identify what's being asked.
2. List known information.
3. Apply the relevant concept.
4. Verify the result makes sense.

**Worked answer:** _Mock response — wire in your model to compute a real solution._`;

    case "ideas":
      return `Here are 5 ideas inspired by **${trimmed}**:

${bullets([
  "A weekend project version with a single bold constraint",
  "A community-driven twist (leaderboards / shared library)",
  "An AI-augmented assistant that personalizes itself",
  "A mobile-first micro-tool — one screen, one job",
  "A playful gamified take with XP and streaks",
])}`;

    case "summarize":
      return `**TL;DR:** ${trimmed.slice(0, 140)}${trimmed.length > 140 ? "…" : ""}

**Key points**
${bullets(["Main idea distilled", "Supporting evidence", "Notable counterpoint", "Actionable takeaway"])}`;

    case "translate":
      return `**Translations of:** _${trimmed}_

- 🇪🇸 Spanish: _${trimmed}_ (mock)
- 🇫🇷 French: _${trimmed}_ (mock)
- 🇩🇪 German: _${trimmed}_ (mock)
- 🇯🇵 Japanese: _${trimmed}_ (mock)
- 🇨🇳 Chinese: _${trimmed}_ (mock)

_Wire in a real translation model to get true outputs._`;

    case "chat":
    default:
      return `${personalityTone[("smart") as Personality]} 

You said: _${trimmed}_

This is a **placeholder response** from BrainForge AI. Connect an OpenAI key in Settings to enable live answers.

A few things I can help with right now:
${bullets([
  "Brainstorm and refine ideas",
  "Draft, rewrite, and summarize text",
  "Generate code snippets in any language",
  "Translate between dozens of languages",
])}`;
  }
}

export interface AIRequest {
  prompt: string;
  personality: Personality;
  mode: ToolMode;
}

export async function generateAIReply({ prompt, personality, mode }: AIRequest): Promise<string> {
  // Simulated latency
  await new Promise((r) => setTimeout(r, 400 + Math.random() * 500));
  const body = generateBody(prompt, mode);
  if (mode === "chat") {
    return `${personalityIntro[personality]}${personalityTone[personality]}\n\n${body.split("\n\n").slice(1).join("\n\n")}`;
  }
  return `${personalityIntro[personality]}${body}`;
}

export const PERSONALITIES: { id: Personality; label: string; desc: string }[] = [
  { id: "smart", label: "Smart", desc: "Concise & precise" },
  { id: "funny", label: "Funny", desc: "Light & witty" },
  { id: "hacker", label: "Hacker", desc: "Terminal energy" },
  { id: "teacher", label: "Teacher", desc: "Patient & clear" },
  { id: "poet", label: "Poet", desc: "Lyrical & soft" },
];

export const TOOL_MODES: { id: ToolMode; label: string; desc: string; icon: string }[] = [
  { id: "chat", label: "Chat", desc: "Free-form conversation", icon: "💬" },
  { id: "writer", label: "Writer", desc: "Drafts & improvements", icon: "✍️" },
  { id: "code", label: "Code", desc: "Generate snippets", icon: "💻" },
  { id: "image-prompt", label: "Image Prompt", desc: "Crafted for image models", icon: "🎨" },
  { id: "homework", label: "Homework", desc: "Step-by-step help", icon: "🎓" },
  { id: "ideas", label: "Ideas", desc: "Brainstorm anything", icon: "💡" },
  { id: "summarize", label: "Summarize", desc: "TL;DR + key points", icon: "📝" },
  { id: "translate", label: "Translate", desc: "Multi-language output", icon: "🌐" },
];
