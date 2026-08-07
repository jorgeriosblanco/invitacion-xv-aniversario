const C=window.INVITACION;
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const setText=(s,v)=>{const e=$(s);if(e)e.textContent=v??""};
const hide=s=>{const e=$(s);if(e)e.style.display="none"};

function render(){
  document.title=`XV ${C.festejada} — Invitación`;
  setText("#introInitial",C.inicial); setText("#introName",C.festejada.split(" ")[0]);
  setText("#heroName",C.festejada.split(" ")[0]); setText("#heroMessage",C.portada.mensaje);
  setText("#quoteText",C.frase); setText("#dateText",C.fechaTexto);
  setText("#storyTitle",C.historia.titulo); setText("#storyText",C.historia.texto);
  setText("#dressCodeText",C.dressCode.texto); setText("#giftsText",C.regalos.texto);
  setText("#finalInitial",C.inicial); setText("#footerText",C.pie);

  $("#heroPhoto").src=C.portada.foto; $("#heroPhoto").alt=`Retrato de ${C.festejada}`;
  $("#storyPhoto").src=C.historia.foto; $("#storyPhoto").alt=`Fotografía de ${C.festejada}`;

  const d=new Date(C.fechaISO);
  setText("#dateDay",String(d.getDate()).padStart(2,"0"));
  setText("#dateMonth",d.toLocaleDateString("es-MX",{month:"long"}).toUpperCase());
  setText("#dateYear",d.getFullYear());

  $("#locations").innerHTML=C.ubicaciones.map(u=>`
    <article class="place-card reveal">
      <div class="map-art"></div>
      <div class="place-tag">${u.tipo} · ${u.hora}</div>
      <h3>${u.nombre}</h3>
      <p>${u.direccion}</p>
      <a class="btn btn-outline-dark" href="${u.mapa}" target="_blank" rel="noopener">Abrir ubicación ↗</a>
    </article>`).join("");

  $("#timeline").innerHTML=C.itinerario.map(i=>`
    <div class="moment reveal">
      <span class="moment-dot"></span>
      <b>${i.hora} · ${i.titulo}</b>
      <span>${i.descripcion}</span>
    </div>`).join("");

  if(C.galeria?.activa&&C.galeria.fotos?.length){
    $("#gallery").innerHTML=C.galeria.fotos.map((src,i)=>`<img class="reveal" src="${src}" alt="Galería ${i+1}">`).join("");
  }else hide("#gallerySection");

  if(!C.dressCode?.activo)hide("#dressCodeCard");
  if(C.regalos?.activo)$("#giftsLink").href=C.regalos.enlace; else hide("#giftsCard");
  if(C.musica?.activa)$("#music").src=C.musica.archivo; else hide("#musicButton");
}

function initReveal(){
  const o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");o.unobserve(e.target)}}),{threshold:.12});
  $$(".reveal").forEach(e=>o.observe(e));
}
function initIntro(){
  $("#openInvitation").addEventListener("click",()=>{
    $("#intro").classList.add("opening");
    setTimeout(()=>{$("#intro").classList.add("closed");document.body.classList.remove("locked")},950);
  });
}
function initProgress(){
  const u=()=>{const m=document.documentElement.scrollHeight-innerHeight;$("#progressBar").style.width=`${m>0?(scrollY/m)*100:0}%`};
  addEventListener("scroll",u,{passive:true});u();
}
function initCountdown(){
  const t=new Date(C.fechaISO).getTime();
  const tick=()=>{const x=Math.max(0,t-Date.now());
    setText("#days",String(Math.floor(x/86400000)).padStart(3,"0"));
    setText("#hours",String(Math.floor((x%86400000)/3600000)).padStart(2,"0"));
    setText("#minutes",String(Math.floor((x%3600000)/60000)).padStart(2,"0"));
    setText("#seconds",String(Math.floor((x%60000)/1000)).padStart(2,"0"));
  };tick();setInterval(tick,1000);
}
function initMusic(){
  if(!C.musica?.activa)return;
  const a=$("#music"),b=$("#musicButton");let p=false;
  b.addEventListener("click",async()=>{try{if(p){a.pause();p=false;b.textContent="♫"}else{await a.play();p=true;b.textContent="Ⅱ"}}catch(e){console.warn(e)}});
}
async function sendRSVP(response,button){
  const s=$("#rsvpStatus");
  if(!C.formspreeEndpoint){s.textContent=`Modo demo: ${response}. Configura formspreeEndpoint en config.js para enviar por correo.`;return}
  const all=$$("[data-response]");all.forEach(b=>b.disabled=true);button.textContent="Enviando…";s.textContent="Registrando tu respuesta…";
  try{
    const r=await fetch(C.formspreeEndpoint,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify({respuesta:response,evento:`XV ${C.festejada}`,fecha:C.fechaTexto})});
    if(!r.ok)throw new Error();
    s.textContent="¡Gracias! Hemos recibido tu respuesta.";
    button.textContent=response==="Confirmo"?"✓ Confirmado":"✓ Respuesta enviada";
  }catch(e){
    s.textContent="No pudimos enviar la respuesta. Intenta nuevamente.";
    all.forEach(b=>b.disabled=false);button.textContent=response==="Confirmo"?"✓ Confirmo":"No asistiré";
  }
}
function initRSVP(){$$("[data-response]").forEach(b=>b.addEventListener("click",()=>sendRSVP(b.dataset.response,b)))}
function initActions(){
  $("#calendarButton").addEventListener("click",()=>{
    const start=new Date(C.fechaISO),end=new Date(start.getTime()+6*60*60*1000),fmt=d=>d.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}Z$/,"Z");
    const ics=`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Invitacion XV//ES
BEGIN:VEVENT
UID:xv-${Date.now()}@local
DTSTAMP:${fmt(new Date())}
DTSTART:${fmt(start)}
DTEND:${fmt(end)}
SUMMARY:XV ${C.festejada}
LOCATION:${C.ubicaciones?.[1]?.direccion||""}
DESCRIPTION:${C.fechaTexto}
END:VEVENT
END:VCALENDAR`;
    const blob=new Blob([ics],{type:"text/calendar;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download=`XV-${C.festejada.replace(/\s+/g,"-")}.ics`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  $("#copyButton").addEventListener("click",async()=>{
    const text=`XV ${C.festejada}\n${C.fechaTexto}\n${C.ubicaciones.map(u=>`${u.tipo}: ${u.hora} · ${u.nombre}`).join("\n")}`;
    try{await navigator.clipboard.writeText(text);$("#copyButton").textContent="✓ Copiado"}catch{alert(text)}
    setTimeout(()=>$("#copyButton").textContent="Copiar datos",1500);
  });
}
render();initIntro();initReveal();initProgress();initCountdown();initMusic();initRSVP();initActions();
