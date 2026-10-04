export default async function handler(req,res){
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers","Content-Type");
  if(req.method==="OPTIONS") return res.status(204).end();
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  const webhook=process.env.https://discord.com/api/webhooks/1556118895239372825/ZF7dVbs59IS63EApi5eBzw_di0tIP3YSP1rKSBELFPz_I3_IJa7mJBO34uuBkP-3qu0y;
  if(!webhook) return res.status(503).json({error:"Discord webhook non configurato"});
  const body=req.body||{};
  const text=[
    "🖱️ **PvP Arena — Log sito**",
    "**Azione:** "+String(body.element||"Sconosciuta").slice(0,100),
    "**ID:** "+String(body.id||"-").slice(0,100),
    "**Pagina:** "+String(body.path||"-").slice(0,200),
    "**Ora:** "+String(body.timestamp||new Date().toISOString()).slice(0,80)
  ].join("\n");
  const r=await fetch(webhook,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:text,allowed_mentions:{parse:[]}})});
  return res.status(r.ok?204:502).end();
}