export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  try {
    const webhook = process.env.https://discord.com/api/webhooks/1556094738841739274/KACJMOf59LVmlFrOPLVxBxom17iOfCREMU5RcFktH7zkkdH2YIxp3715tS8AXT7Ny0yk;
    if (!webhook) return res.status(503).json({ ok: false });
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const clean = value => String(value || "").replace(/\x60/g, "'").slice(0, 200);
    const content = [
      "🖱️ **Click registrato — PvP Arena**",
      "🔘 Elemento: `" + clean(body.element) + "`",
      body.id ? "🆔 ID: `" + clean(body.id) + "`" : null,
      "🌐 Pagina: `" + clean(body.path || "/") + "`",
      "🕐 Ora: " + clean(body.timestamp || new Date().toISOString())
    ].filter(Boolean).join("\n");
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, allowed_mentions: { parse: [] } })
    });
    if (!response.ok) return res.status(502).json({ ok: false });
    return res.status(204).end();
  } catch {
    return res.status(400).json({ ok: false });
  }
}