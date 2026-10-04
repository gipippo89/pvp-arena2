async function upsertLogin(profile){
  const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key) return;
  await fetch(url+"/rest/v1/login_events",{method:"POST",headers:{apikey:key,Authorization:"Bearer "+key,"Content-Type":"application/json",Prefer:"return=minimal"},body:JSON.stringify({provider:profile.provider,provider_id:profile.id,email:profile.email,name:profile.name,avatar:profile.avatar,logged_in_at:new Date().toISOString()})});
}
export default async function handler(req,res){
  const {provider,code}=req.query;
  if(!code||!["google","discord"].includes(provider)) return res.status(400).send("OAuth callback non valido");
  const base=(process.env.AUTH_BASE_URL||"").replace(/\/$/,""),redirect=base+"/api/auth/callback?provider="+provider;
  let token,user;
  if(provider==="google"){
    const r=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({code,client_id:process.env.GOOGLE_CLIENT_ID,client_secret:process.env.GOOGLE_CLIENT_SECRET,redirect_uri:redirect,grant_type:"authorization_code"})});
    token=await r.json(); if(!token.access_token) return res.status(401).send("Google OAuth fallito");
    const u=await fetch("https://openidconnect.googleapis.com/v1/userinfo",{headers:{Authorization:"Bearer "+token.access_token}}); const x=await u.json();
    user={id:x.sub,email:x.email,name:x.name,avatar:x.picture,provider};
  }else{
    const r=await fetch("https://discord.com/api/oauth2/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({code,client_id:process.env.DISCORD_CLIENT_ID,client_secret:process.env.DISCORD_CLIENT_SECRET,redirect_uri:redirect,grant_type:"authorization_code"})});
    token=await r.json(); if(!token.access_token) return res.status(401).send("Discord OAuth fallito");
    const u=await fetch("https://discord.com/api/users/@me",{headers:{Authorization:"Bearer "+token.access_token}}); const x=await u.json();
    user={id:x.id,email:x.email||"",name:x.global_name||x.username,avatar:x.avatar?("https://cdn.discordapp.com/avatars/"+x.id+"/"+x.avatar+".png"):"",provider};
  }
  await upsertLogin(user);
  const payload=Buffer.from(JSON.stringify({id:user.id,name:user.name,email:user.email,avatar:user.avatar,provider:user.provider})).toString("base64url");
  res.setHeader("Set-Cookie","pvp_user="+payload+"; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800");
  res.redirect(302,base+"/#profilo");
}