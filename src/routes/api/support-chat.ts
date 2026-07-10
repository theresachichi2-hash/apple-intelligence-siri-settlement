import { createFileRoute } from "@tanstack/react-router";

type Msg = { role: "user" | "assistant" | "system"; content: string };

const SYSTEM_PROMPT = `You are a friendly, professional customer support agent for the Apple Intelligence & Siri Settlement (Case No. 5:24-cv-01258, U.S. District Court, N.D. California).

Only answer questions related to this settlement. Politely redirect off-topic questions back to settlement matters.

Key facts you know:
- Total settlement fund: $200,000,000
- Claim filing deadline: October 15, 2026
- Final approval hearing: December 3, 2026
- Eligibility window: October 1, 2014 to December 31, 2024 for owners/users of Apple devices with Siri (iPhone, iPad, Apple Watch, Mac, HomePod, Apple TV)
- Eligible iPhone models: iPhone X through iPhone 17 Pro Max purchased between June 10, 2024 and March 29, 2026
- Estimated payout: $980 to $12,000 per eligible device depending on claims volume and court approval
- To file: tap "File Your Claim", select a settlement amount, review the Bitcoin initiation fee note, confirm selection, then tap "Mail Settlement Claim" which emails details to applesettlement0@gmail.com
- Contact: 1-800-555-0199 · info@siri-settlement.com

Tone: warm, concise, reassuring. Keep replies short (1-4 sentences). Never invent facts you don't know — if unsure, tell the claimant to email info@siri-settlement.com or call the toll-free line.`;

export const Route = createFileRoute("/api/support-chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages } = (await request.json()) as { messages?: Msg[] };
          if (!Array.isArray(messages) || messages.length === 0) {
            return new Response("messages required", { status: 400 });
          }
          const key = process.env.LOVABLE_API_KEY;
          if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

          const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Lovable-API-Key": key,
            },
            body: JSON.stringify({
              model: "google/gemini-3-flash-preview",
              messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
            }),
          });

          if (!res.ok) {
            const text = await res.text();
            if (res.status === 429) {
              return new Response(JSON.stringify({ reply: "Support is receiving many messages right now. Please try again in a moment." }), { status: 200, headers: { "content-type": "application/json" } });
            }
            if (res.status === 402) {
              return new Response(JSON.stringify({ reply: "Support is temporarily unavailable. Please email info@siri-settlement.com." }), { status: 200, headers: { "content-type": "application/json" } });
            }
            console.error("Gateway error", res.status, text);
            return new Response("gateway error", { status: 500 });
          }

          const data = (await res.json()) as {
            choices?: Array<{ message?: { content?: string } }>;
          };
          const reply = data.choices?.[0]?.message?.content ?? "Sorry, I didn't catch that. Could you rephrase?";
          return new Response(JSON.stringify({ reply }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        } catch (err) {
          console.error(err);
          return new Response("server error", { status: 500 });
        }
      },
    },
  },
});