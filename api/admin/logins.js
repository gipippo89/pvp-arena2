export default async function handler(req,res){
  if(req.method!=="GET") return res.status(405).json({error:"Method not allowed"});
  if(req.headers["x-admin-password"]!==process.env.ADMIN_PASSWORD) return res.status(401).json({error:"Unauthorized"});
  const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key) return res.status(503).json({error:"Supabase non configurato"});
  const r=await fetch(url+"/rest/v1/login_events?select=provider,email,name,avatar,logged_in_at&order=logged_in_at.desc&limit=100",{headers:{apikey:key,Authorization:"Bearer "+key}});
  const data=await r.json(); return res.status(r.ok?200:500).json(data);
}