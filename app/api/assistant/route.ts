export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getServerSession } from "@/lib/auth/session";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt) return NextResponse.json({ error: "Prompt is required" }, { status: 400 });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      reply: `I can help with campus guidance, but the live AI provider is not configured yet. Based on your request, start by checking /events for upcoming opportunities, /clubs for communities, and /calendar for scheduling context.`,
    });
  }

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      system: "You are the CollegiaX campus assistant. Give concise, helpful guidance about campus events, clubs, collaboration, schedules, and student participation.",
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content
      .filter((item) => item.type === "text")
      .map((item) => item.text)
      .join("\n")
      .trim();

    return NextResponse.json({ reply: text || "I couldn't generate a response just now." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Assistant request failed" }, { status: 500 });
  }
}
