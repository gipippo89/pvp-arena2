export default async function handler(req,res){
  const provider=req.query.provider;
  if(!["google","discord"].includes(provider)) return res.status(404).send("Provider non supportato");
  const base=(process.env.AUTH_BASE_URL||"").replace(/\/$/,"");
  if(!base) return res.status(503).send("AUTH_BASE_URL non configurato");
  const redirect=base+"/api/auth/callback?provider="+provider;
  let url;
  if(provider==="google"){
    if(!process.env.GOOGLE_CLIENT_ID) return res.status(503).send("Google OAuth non configurato");
    url="https://accounts.google.com/o/oauth2/v2/auth?"+new URLSearchParams({client_id:process.env.GOOGLE_CLIENT_ID,redirect_uri:redirect,response_type:"code",scope:"openid email profile",access_type:"offline",prompt:"select_account"}).toString();
  }else{
    if(!process.env.DISCORD_CLIENT_ID) return res.status(503).send("Discord OAuth non configurato");
    url="https://discord.com/oauth2/authorize?"+new URLSearchParams({client_id:process.env.DISCORD_CLIENT_ID,redirect_uri:redirect,response_type:"code",scope:"identify email"}).toString();
  }
  res.redirect(302,url);
}