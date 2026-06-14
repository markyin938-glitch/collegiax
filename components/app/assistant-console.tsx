"use client";

import { FormEvent, useState } from "react";
import { Bot, Loader2, SendHorizontal } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function AssistantConsole() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Ask me about campus events, clubs, scheduling, or how to make the most of CollegiaX.",
    },
  ]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const prompt = input.trim();
    if (!prompt) return;

    const nextMessages = [...messages, { role: "user" as const, content: prompt }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: data.reply || "I couldn't find a response just now. Please try again.",
        },
      ]);
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: "I couldn't reach the assistant service. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.45fr_0.9fr]">
      <section className="ui-card flex min-h-[540px] flex-col overflow-hidden">
        <div className="border-b border-[var(--outline-variant)] px-5 py-4">
          <p className="ui-eyebrow">AI assistant</p>
          <h2 className="font-heading text-2xl font-semibold text-[var(--on-background)]">Campus copilot</h2>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === "user"
                    ? "bg-[var(--primary)] text-white"
                    : "border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] text-[var(--on-surface)]"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {loading ? (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-4 py-3 text-sm text-[var(--on-surface-variant)]">
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking...
              </div>
            </div>
          ) : null}
        </div>
        <form onSubmit={onSubmit} className="border-t border-[var(--outline-variant)] p-4">
          <div className="flex items-end gap-3">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about events, clubs, schedules, or recommendations..."
              rows={3}
              className="ui-input min-h-24 flex-1 resize-none"
            />
            <button type="submit" disabled={loading} className="ui-button ui-button-primary h-12">
              <SendHorizontal className="h-4 w-4" />
              Send
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <div className="ui-card p-5">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[color:rgba(42,96,137,0.12)] text-[var(--primary)]">
            <Bot className="h-5 w-5" />
          </div>
          <h3 className="font-heading text-xl font-semibold text-[var(--on-background)]">What it can help with</h3>
          <ul className="mt-4 space-y-3 text-sm text-[var(--on-surface-variant)]">
            <li>Find relevant campus events based on your interests.</li>
            <li>Recommend clubs, workshops, and collaboration opportunities.</li>
            <li>Help summarize schedules, deadlines, and participation history.</li>
          </ul>
        </div>
        <div className="ui-card p-5">
          <h3 className="font-heading text-xl font-semibold text-[var(--on-background)]">Suggested prompts</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              "What events are best for first-year students?",
              "Show me upcoming tech workshops.",
              "How can I improve my participation score?",
            ].map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setInput(prompt)}
                className="rounded-full bg-[var(--surface-container-low)] px-4 py-2 text-left text-xs font-medium text-[var(--on-surface-variant)] transition hover:bg-[color:rgba(42,96,137,0.12)] hover:text-[var(--primary)]"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
