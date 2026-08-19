import { NextResponse } from 'next/server';

export async function POST(request:Request){
  try{
    const data=await request.json();
    const {name,email,phone,service,date,message}=data;
    if(!name||!email||!service||!message)return NextResponse.json({error:'Champs requis manquants.'},{status:400});
    if(!/^\S+@\S+\.\S+$/.test(email))return NextResponse.json({error:'Adresse email invalide.'},{status:400});

    const apiKey=process.env.RESEND_API_KEY;
    const destination=process.env.CONTACT_EMAIL;
    if(apiKey&&destination){
      const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({from:process.env.CONTACT_FROM_EMAIL||'Portfolio <onboarding@resend.dev>',to:[destination],reply_to:email,subject:`Nouvelle demande photo — ${service}`,html:`<h2>Nouvelle demande de ${name}</h2><p><b>Email :</b> ${email}</p><p><b>Téléphone :</b> ${phone||'Non renseigné'}</p><p><b>Service :</b> ${service}</p><p><b>Date :</b> ${date||'Non renseignée'}</p><p>${String(message).replace(/</g,'&lt;')}</p>`})});
      if(!response.ok)throw new Error('Échec du service email');
    }
    return NextResponse.json({ok:true,delivered:Boolean(apiKey&&destination)});
  }catch{return NextResponse.json({error:"Le message n'a pas pu être envoyé."},{status:500})}
}
