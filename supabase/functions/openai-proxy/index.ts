// supabase/functions/openai-proxy/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const { messages } = await req.json();
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

    if (!OPENAI_API_KEY) {
      console.log("🚫 Missing OPENAI_API_KEY");
      return new Response("Missing API key", { status: 500 });
    }

    console.log("📨 Messages:", messages);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages,
        max_tokens: 500,
      }),
    });

    const text = await response.text();
    console.log("📬 OpenAI Response:", text);

    return new Response(text, {
      headers: { "Content-Type": "application/json" },
      status: response.status,
    });

  } catch (err) {
    console.error("❌ Function error:", err);
    return new Response("Error processing request", { status: 500 });
  }
});





























