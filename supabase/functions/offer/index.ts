import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const CORS = {
  "Access-Control-Allow-Origin": "https://aulas.com",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  try {
    const { name, email, company, amount, message, lang } = await req.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return new Response(JSON.stringify({ error: "name required" }), {
        status: 400,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "invalid email" }), {
        status: 400,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const notifyEmail = Deno.env.get("NOTIFY_EMAIL");

    const insertResponse = await fetch(`${supabaseUrl}/rest/v1/offers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: "Bearer " + serviceKey,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        company,
        amount,
        message,
        lang: lang || "pt",
      }),
    });

    if (!insertResponse.ok) {
      throw new Error("offer insert failed");
    }

    if (resendKey && notifyEmail) {
      try {
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + resendKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "noreply@aulas.com",
            to: notifyEmail,
            subject: `Nova proposta de ${name} — aulas.com`,
            text: `Nome: ${name}\nEmail: ${email}\nEmpresa: ${company || "-"}\nValor: ${amount || "-"}\nMensagem: ${message || "-"}\nIdioma: ${lang || "pt"}`,
          }),
        });

        if (!resendResponse.ok) {
          console.error("resend notification failed");
        }
      } catch (_error) {
        console.error("resend notification failed");
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (_e) {
    return new Response(JSON.stringify({ error: "server error" }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
