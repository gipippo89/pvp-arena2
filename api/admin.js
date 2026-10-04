export default async function handler(req,res){
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers","Content-Type");
  if(req.method==="OPTIONS") return res.status(204).end();
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  const {password}=req.body||{};
  const expected=process.env.ADMIN_PASSWORD;
  if(!expected) return res.status(503).json({error:"Admin backend not configured"});
  if(password!==expected) return res.status(401).json({error:"Unauthorized"});
  return res.status(200).json({ok:true});
}