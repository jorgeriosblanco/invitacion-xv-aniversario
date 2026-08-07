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
let pendingResponse="Confirmo";

function openRSVPModal(response){
  pendingResponse=response;
  $("#rsvpResponse").value=response;
  $("#rsvpModalTitle").textContent=response==="Confirmo"?"Confirma tus datos":"Datos de contacto";
  $("#submitRSVP").textContent=response==="Confirmo"?"Enviar confirmación":"Enviar respuesta";
  $("#formStatus").textContent="";
  $("#rsvpModal").classList.add("open");
  $("#rsvpModal").setAttribute("aria-hidden","false");
  document.body.classList.add("modal-open");
  setTimeout(()=>$("#guestName").focus(),150);
}

function closeRSVPModal(){
  $("#rsvpModal").classList.remove("open");
  $("#rsvpModal").setAttribute("aria-hidden","true");
  document.body.classList.remove("modal-open");
}

async function submitRSVPForm(e){
  e.preventDefault();

  const status=$("#formStatus");
  const submit=$("#submitRSVP");
  const nombre=$("#guestName").value.trim();
  const correo=$("#guestEmail").value.trim();
  const whatsapp=$("#guestWhatsapp").value.trim();
  const honeypot=$("#website").value.trim();

  if(honeypot){
    closeRSVPModal();
    return;
  }

  if(!nombre || !correo || !whatsapp){
    status.textContent="Completa todos los campos.";
    return;
  }

  if(!C.rsvpEndpoint){
    status.textContent="Modo demo: configura rsvpEndpoint en config.js para enviar el correo.";
    return;
  }

  submit.disabled=true;
  submit.textContent="Enviando…";
  status.textContent="Enviando tu respuesta…";

  const data=new URLSearchParams({
    respuesta: pendingResponse,
    nombre,
    correo,
    whatsapp,
    evento: `XV ${C.festejada}`,
    fecha: C.fechaTexto
  });

  try{
    // no-cors evita problemas de CORS con Google Apps Script.
    // La respuesta es opaca, por eso no se inspecciona el status HTTP.
    await fetch(C.rsvpEndpoint,{
      method:"POST",
      mode:"no-cors",
      headers:{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
      body:data.toString()
    });

    status.textContent="¡Gracias! Tu respuesta fue enviada.";
    $("#rsvpStatus").textContent=`Respuesta enviada: ${pendingResponse}.`;
    setTimeout(()=>{
      closeRSVPModal();
      $("#rsvpForm").reset();
      submit.disabled=false;
      submit.textContent="Enviar confirmación";
    },1200);
  }catch(err){
    console.error(err);
    status.textContent="No pudimos enviar tus datos. Intenta nuevamente.";
    submit.disabled=false;
    submit.textContent=pendingResponse==="Confirmo"?"Enviar confirmación":"Enviar respuesta";
  }
}

function initRSVP(){
  $$("[data-response]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const response=btn.dataset.response;
      if(response==="Confirmo" || C.rsvp?.pedirDatosEnRechazo){
        openRSVPModal(response);
      }else{
        $("#rsvpStatus").textContent="Gracias. Registraremos que no asistirás cuando actives el envío por correo.";
      }
    });
  });

  $$("[data-close-modal]").forEach(el=>el.addEventListener("click",closeRSVPModal));
  $("#rsvpForm").addEventListener("submit",submitRSVPForm);
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeRSVPModal()});
}

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
