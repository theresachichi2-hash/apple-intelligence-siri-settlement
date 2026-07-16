import { createFileRoute } from "@tanstack/react-router";

const SYSTEM_PROMPT = `You are a helpful, courteous support agent for the Apple Intelligence & Siri Settlement (2026), also known as Lopez v. Apple Inc.

Key settlement facts you must use:
- Settlement Amount: $250,000,000
- Eligibility: Anyone who purchased an eligible iPhone (iPhone X through iPhone 17 Pro Max) between June 10, 2024 and March 29, 2026, in the United States.
- Claim Tiers:
  * Standard Claim: $1,980 (no proof of ownership required)
  * Documented Claim: $12,980 (proof of ownership required — receipt, invoice, or serial verification)
  * Family Claim: $20,980 (for households with multiple eligible devices; list family members)
- Estimated per-device compensation range: $980 – $12,000 depending on approved claims and final court terms.
- Claim Submission Email: applesettlementclaim@icloud.com (all claim info and proof documents are mailed here upon submission)
- Support Phone: 1-985-602-3749
- Support Email: applesettlementclaim@icloud.com
- Note: A small Bitcoin initiation fee is required to process the settlement claim once an amount is selected.
- Payment Process: After approval, settlement funds are transferred to the claimant's designated wallet address per the court-approved schedule.

Rules:
- Only discuss topics related to the Apple Intelligence & Siri Settlement claim process.
- Be concise (2–4 sentences typical), warm, and clear.
- Never invent legal advice; direct users to file their claim via the "File Your Claim" button on the site.
- If asked something unrelated, politely steer back to settlement enquiries.`;

export const Route = createFileRoute("/api/support-chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages } = (await request.json()) as {
            messages: Array<{ role: "user" | "assistant"; content: string }>;
          };
          if (!Array.isArray(messages)) {
            return new Response(JSON.stringify({ error: "messages required" }), {
              status: 400,
              headers: { "content-type": "application/json" },
            });
          }

          const apiKey = process.env.LOVABLE_API_KEY;
          if (!apiKey) {
            return new Response(
              JSON.stringify({ error: "Support chat is not configured." }),
              { status: 500, headers: { "content-type": "application/json" } },
            );
          }

          const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash",
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...messages.slice(-12),
              ],
            }),
          });

          if (!res.ok) {
            const text = await res.text();
            return new Response(
              JSON.stringify({ error: "Upstream error", detail: text.slice(0, 500) }),
              { status: 502, headers: { "content-type": "application/json" } },
            );
          }
          const data = (await res.json()) as {
            choices?: Array<{ message?: { content?: string } }>;
          };
          const reply = data.choices?.[0]?.message?.content?.trim() ?? "I'm sorry, I couldn't generate a response. Please try again.";
          return new Response(JSON.stringify({ reply }), {
            headers: { "content-type": "application/json" },
          });
        } catch (err) {
          return new Response(
            JSON.stringify({ error: (err as Error).message }),
            { status: 500, headers: { "content-type": "application/json" } },
          );
        }
      },
    },
  },
});
