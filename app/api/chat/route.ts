import { readFile } from "node:fs/promises";
import path from "node:path";
import OpenAI from "openai";

export const runtime = "nodejs";

const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";
const MODEL = "meta/llama-3.1-8b-instruct";

const unavailableReply =
  "The assistant is currently unavailable. Please try again later.";

const fallbackReply =
  "I do not have enough information on that yet. Please contact Xandrea Harshey Services Inc. directly for the most accurate answer.";

/** Keep the conversation light so replies stay fast. */
const MAX_TURNS = 10;
const MAX_MESSAGE_CHARS = 2000;

/**
 * Lazily create (and cache) the OpenAI-compatible NVIDIA client. Instantiating
 * at module scope crashes the whole route at import time when no key is set
 * (the SDK throws "Missing credentials"), turning every request into a 500 and
 * bypassing our graceful 503. Returning null lets the handler degrade cleanly.
 */
let client: OpenAI | null = null;
function getClient(): OpenAI | null {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) return null;
  if (!client) {
    client = new OpenAI({
      apiKey,
      baseURL: NVIDIA_BASE_URL,
      timeout: 30_000,
      maxRetries: 1,
    });
  }
  return client;
}

type Role = "user" | "assistant";
type ChatMessage = { role: Role; content: string };
type ChatRequest = { messages?: unknown };

/**
 * Read the knowledge file once and reuse it across requests. Reading on every
 * request would add disk latency to each answer.
 */
let knowledgePromise: Promise<string> | null = null;
function loadKnowledge() {
  if (!knowledgePromise) {
    const knowledgePath = path.join(
      process.cwd(),
      "data",
      "xandrea-knowledge.txt",
    );
    knowledgePromise = readFile(knowledgePath, "utf8");
  }
  return knowledgePromise;
}

function buildSystemPrompt(companyKnowledge: string) {
  return [
    "You are the Xandrea AI Assistant — the website assistant for Xandrea Harshey Services Inc.",
    "You help visitors understand the company, its divisions, and its services, and you guide them to the right division.",
    "",
    "Knowledge boundary:",
    "- Use only the company knowledge provided below.",
    "- Do not invent pricing, timelines, guarantees, project details, phone numbers, email addresses beyond what is provided, legal advice, investment advice, or contract advice.",
    `- If the answer is not in the knowledge, reply exactly: "${fallbackReply}"`,
    "",
    "Response style:",
    "- Be warm, professional, premium, and trustworthy — like a knowledgeable corporate concierge.",
    "- Keep most answers to 1-4 short sentences.",
    "- For service lists, use no more than 6 short lines, one item per line.",
    "- Use plain text only. Do not use Markdown, asterisks, bold text, tables, headings, or emojis.",
    "- Do not repeat the full company overview unless the visitor asks for background.",
    "- Do not end every answer with a long sales pitch.",
    "- If a question is broad, give a short answer and ask one helpful follow-up question.",
    "",
    "Valid website pages you may mention: /, /about, /companies, /services, /leadership, /careers, /contact. Never reference any other path (for example /projects or /safety do not exist).",
    "",
    "Routing guidance:",
    "- Construction and development: G-Pinoy Construction & Development Inc.",
    "- Cleaning, janitorial, maintenance, building operations: Xandrea Facility Services.",
    "- Commodity trading, import/export, procurement, distribution: Primeport Commodity Inc.",
    "- Renovation, restoration, painting, stucco, concrete repair, property maintenance: Xandrea Construction & Property Services.",
    "",
    "Company knowledge:",
    companyKnowledge,
  ].join("\n");
}

/** Validate and normalize the incoming conversation history. */
function parseMessages(raw: unknown): ChatMessage[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;

  const cleaned: ChatMessage[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const role = (item as { role?: unknown }).role;
    const content = (item as { content?: unknown }).content;
    if (role !== "user" && role !== "assistant") continue;
    if (typeof content !== "string") continue;
    const trimmed = content.trim();
    if (!trimmed) continue;
    cleaned.push({ role, content: trimmed.slice(0, MAX_MESSAGE_CHARS) });
  }

  if (cleaned.length === 0) return null;
  // The latest message must be from the visitor.
  if (cleaned[cleaned.length - 1].role !== "user") return null;

  return cleaned.slice(-MAX_TURNS);
}

function plainTextResponse(text: string, status = 200) {
  return new Response(text, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export async function POST(request: Request) {
  let body: ChatRequest;
  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    return plainTextResponse("Invalid request.", 400);
  }

  const messages = parseMessages(body.messages);
  if (!messages) {
    return plainTextResponse(
      "A valid message is required to chat with the assistant.",
      400,
    );
  }

  const openai = getClient();
  if (!openai) {
    return plainTextResponse(unavailableReply, 503);
  }

  let companyKnowledge: string;
  try {
    companyKnowledge = await loadKnowledge();
  } catch (error) {
    console.error("Xandrea chat: failed to load knowledge file", error);
    return plainTextResponse(unavailableReply, 500);
  }

  try {
    const stream = await openai.chat.completions.create({
      model: MODEL,
      temperature: 0.3,
      max_tokens: 700,
      stream: true,
      messages: [
        { role: "system", content: buildSystemPrompt(companyKnowledge) },
        ...messages,
      ],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) controller.enqueue(encoder.encode(delta));
          }
        } catch (error) {
          console.error("Xandrea chat: stream error", error);
          controller.enqueue(encoder.encode(unavailableReply));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Xandrea chat API error:", error);
    return plainTextResponse(unavailableReply, 500);
  }
}
