function parseCookie(v){const out={};for(const p of (v||"").split(";")){const i=p.indexOf("=");if(i>0)out[p.slice(0,i).trim()]=decodeURIComponent(p.slice(i+1).trim())}return out}
export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  const cookies=parseCookie(req.headers.cookie),raw=cookies.pvp_user;
  if(!raw) return res.status(401).json({error:"Not logged in"});
  let user;try{user=JSON.parse(Buffer.from(raw,"base64url").toString())}catch(e){return res.status(401).json({error:"Invalid session"})}
  const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key) return res.status(503).json({error:"Supabase non configurato"});
  const body=req.body||{};
  const r=await fetch(url+"/rest/v1/players?on_conflict=provider,provider_id",{method:"POST",headers:{apikey:key,Authorization:"Bearer "+key,"Content-Type":"application/json",Prefer:"resolution=merge-duplicates,return=minimal"},body:JSON.stringify({provider:user.provider,provider_id:user.id,name:body.name||user.name,description:body.description||"",logo:body.logo||user.avatar||"",updated_at:new Date().toISOString()})});
  return res.status(r.ok?200:500).json({ok:r.ok});
}