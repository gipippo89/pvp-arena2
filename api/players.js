export default async function handler(req,res){
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers","Content-Type");
  if(req.method==="OPTIONS") return res.status(204).end();
  const url=process.env.SUPABASE_URL, key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key) return res.status(503).json({error:"Realtime backend not configured"});
  const r=await fetch(url+"/rest/v1/players?select=*&order=score.desc",{headers:{apikey:key,Authorization:"Bearer "+key}});
  const data=await r.json();
  return res.status(r.ok?200:500).json(data);
}