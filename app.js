const C=window.INVITACION;
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const setText=(s,v)=>{const e=$(s);if(e)e.textContent=v??""};
const hide=s=>{const e=$(s);if(e)e.style.display="none"};

function render(){
  document.title=`XV ${C.festejada} — Invitación`;
  setText("#introName",C.festejada.split(" ")[0]);
  setText("#heroName",C.festejada.split(" ")[0]); setText("#heroMessage",C.portada.mensaje);
  setText("#quoteText",C.frase); setText("#dateText",C.fechaTexto);
  setText("#storyTitle",C.historia.titulo); setText("#storyText",C.historia.texto);
  setText("#dressCodeText",C.dressCode.texto); setText("#giftsText",C.regalos.texto);
  setText("#finalInitial",C.inicial); setText("#footerText",C.pie);

  $("#introPhoto").src=C.intro?.foto||C.portada.foto;
  $("#introPhoto").alt=`Sobre de la invitación de ${C.festejada}`;
  $("#heroPhoto").src=C.portada.foto; $("#heroPhoto").alt=`Retrato de ${C.festejada}`;
  $("#storyPhoto").src=C.historia.foto; $("#storyPhoto").alt=`Fotografía de ${C.festejada}`;

  if(C.dressCode?.foto){
    $("#dressCodePhoto").src=C.dressCode.foto;
  }
  if(C.regalos?.foto){
    $("#giftsPhoto").src=C.regalos.foto;
  }

  const d=new Date(C.fechaISO);
  setText("#dateDay",String(d.getDate()).padStart(2,"0"));
  setText("#dateMonth",d.toLocaleDateString("es-MX",{month:"long"}).toUpperCase());
  setText("#dateYear",d.getFullYear());

  $("#locations").innerHTML=C.ubicaciones.map(u=>`
    <article class="place-card reveal">
      ${u.foto
        ? `<img class="place-photo" src="${u.foto}" alt="${u.tipo}: ${u.nombre}">`
        : `<div class="map-art"></div>`}
      <div class="place-card-body">
        <div class="place-tag">${u.tipo} · ${u.hora}</div>
        <h3>${u.nombre}</h3>
        <p>${u.direccion}</p>
        <a class="btn btn-outline-dark" href="${u.mapa}" target="_blank" rel="noopener">Abrir ubicación ↗</a>
      </div>
    </article>`).join("");

  $("#timeline").innerHTML=C.itinerario.map(i=>`
    <div class="moment reveal">
      <span class="moment-dot"></span>
      <b>${i.hora} · ${i.titulo}</b>
      <span>${i.descripcion}</span>
    </div>`).join("");

  if(C.galeria?.activa&&C.galeria.fotos?.length){
    $("#gallery").innerHTML=C.galeria.fotos.map((src,i)=>`
      <figure class="gallery-slide" data-index="${i}" aria-hidden="${i===0?"false":"true"}">
        <img src="${src}" alt="Recuerdo ${i+1} de ${C.festejada}" draggable="false">
      </figure>`).join("");

    $("#galleryDots").innerHTML=C.galeria.fotos.map((_,i)=>`
      <button class="gallery-dot${i===0?" active":""}"
              type="button"
              data-gallery-dot="${i}"
              aria-label="Ver fotografía ${i+1}"
              aria-current="${i===0?"true":"false"}"></button>`).join("");
  }else hide("#gallerySection");

  if(!C.dressCode?.activo)hide("#dressCodeCard");
  if(C.regalos?.activo)$("#giftsLink").href=C.regalos.enlace; else hide("#giftsCard");
  if(C.musica?.activa)$("#music").src=C.musica.archivo; else hide("#musicButton");
}

function initGalleryCarousel(){
  if(!C.galeria?.activa||!C.galeria.fotos?.length)return;

  const carousel=$("#galleryCarousel");
  const stage=$("#galleryStage");
  const slides=$$(".gallery-slide");
  const dots=$$(".gallery-dot");
  const prev=$("#galleryPrev");
  const next=$("#galleryNext");
  const counter=$("#galleryCounter");
  const total=slides.length;
  const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let current=0;
  let timer=null;
  let isVisible=false;
  let pointerStartX=0;
  let pointerStartY=0;
  let pointerActive=false;

  const signedDistance=(index)=>{
    let d=(index-current+total)%total;
    if(d>total/2)d-=total;
    return d;
  };

  function paint(){
    slides.forEach((slide,i)=>{
      const d=signedDistance(i);
      slide.classList.remove("active","prev","next","far");

      if(d===0){
        slide.classList.add("active");
        slide.setAttribute("aria-hidden","false");
      }else if(d===-1 || (total===2&&d===1&&i!==current)){
        slide.classList.add("prev");
        slide.setAttribute("aria-hidden","true");
      }else if(d===1){
        slide.classList.add("next");
        slide.setAttribute("aria-hidden","true");
      }else{
        slide.classList.add("far");
        slide.setAttribute("aria-hidden","true");
      }
    });

    dots.forEach((dot,i)=>{
      const active=i===current;
      dot.classList.toggle("active",active);
      dot.setAttribute("aria-current",active?"true":"false");
    });

    counter.textContent=`${current+1} / ${total}`;

    if(total<2){
      prev.hidden=true;
      next.hidden=true;
      $("#galleryDots").hidden=true;
    }
  }

  function go(index,manual=true){
    current=(index+total)%total;
    paint();
    if(manual)restartAutoplay();
  }

  function stopAutoplay(){
    if(timer){clearInterval(timer);timer=null}
  }

  function startAutoplay(){
    if(reduceMotion||total<2||!isVisible||document.hidden)return;
    stopAutoplay();
    timer=setInterval(()=>go(current+1,false),5000);
  }

  function restartAutoplay(){
    stopAutoplay();
    startAutoplay();
  }

  prev.addEventListener("click",()=>go(current-1));
  next.addEventListener("click",()=>go(current+1));

  dots.forEach((dot,i)=>dot.addEventListener("click",()=>go(i)));

  stage.addEventListener("pointerdown",e=>{
    if(e.pointerType==="mouse"&&e.button!==0)return;
    pointerActive=true;
    pointerStartX=e.clientX;
    pointerStartY=e.clientY;
    stopAutoplay();
  });

  stage.addEventListener("pointerup",e=>{
    if(!pointerActive)return;
    pointerActive=false;
    const dx=e.clientX-pointerStartX;
    const dy=e.clientY-pointerStartY;

    if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.15){
      go(current+(dx<0?1:-1));
    }else{
      startAutoplay();
    }
  });

  stage.addEventListener("pointercancel",()=>{
    pointerActive=false;
    startAutoplay();
  });

  carousel.addEventListener("mouseenter",stopAutoplay);
  carousel.addEventListener("mouseleave",startAutoplay);
  carousel.addEventListener("focusin",stopAutoplay);
  carousel.addEventListener("focusout",()=>setTimeout(startAutoplay,0));

  document.addEventListener("visibilitychange",()=>{
    if(document.hidden)stopAutoplay();
    else startAutoplay();
  });

  const observer=new IntersectionObserver(entries=>{
    const entry=entries[0];
    isVisible=entry.isIntersecting&&entry.intersectionRatio>.28;
    if(isVisible){
      carousel.classList.add("carousel-seen");
      startAutoplay();
    }else stopAutoplay();
  },{threshold:[0,.28,.6]});

  observer.observe(carousel);
  paint();
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
const RSVP_STORAGE_KEY=`yrw-rsvp:${C.festejada}:${C.fechaISO}`;

function getStoredRSVP(){
  try{return localStorage.getItem(RSVP_STORAGE_KEY)||""}catch{return ""}
}

function storeRSVP(response){
  try{localStorage.setItem(RSVP_STORAGE_KEY,response)}catch{}
}

function applyCompletedRSVP(response,shouldStore=true){
  if(shouldStore)storeRSVP(response);

  $$("[data-response]").forEach(btn=>{
    btn.disabled=true;
    btn.setAttribute("aria-disabled","true");
  });

  const card=$("#rsvp .rsvp-card");
  card?.classList.add("answered");

  if(response==="Confirmo"){
    $("#rsvpStatus").textContent="✓ Ya confirmaste tu asistencia. ¡Te esperamos!";
  }else{
    $("#rsvpStatus").textContent="Respuesta registrada: no asistirás. Gracias por avisarnos.";
  }

  $("#exitButton").hidden=false;
}

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
  const comentarios=$("#guestComments").value.trim().slice(0,280);
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
    comentarios,
    evento: `XV ${C.festejada}`,
    fecha: C.fechaTexto
  });

  try{
    await fetch(C.rsvpEndpoint,{
      method:"POST",
      mode:"no-cors",
      headers:{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
      body:data.toString()
    });

    status.textContent="¡Gracias! Tu respuesta fue enviada.";
    applyCompletedRSVP(pendingResponse,true);

    setTimeout(()=>{
      closeRSVPModal();
      $("#rsvpForm").reset();
      submit.disabled=false;
      submit.textContent=pendingResponse==="Confirmo"?"Enviar confirmación":"Enviar respuesta";
    },1200);
  }catch(err){
    console.error(err);
    status.textContent="No pudimos enviar tus datos. Intenta nuevamente.";
    submit.disabled=false;
    submit.textContent=pendingResponse==="Confirmo"?"Enviar confirmación":"Enviar respuesta";
  }
}

function exitInvitation(){
  closeRSVPModal();

  // En navegadores embebidos (por ejemplo, WhatsApp) no intentamos
  // cerrar la ventana. Regresamos al inicio y mostramos nuevamente
  // el sobre de la invitación.
  window.scrollTo({top:0,left:0,behavior:"auto"});

  const intro=$("#intro");
  intro.classList.remove("opening","closed");
  document.body.classList.add("locked");

  requestAnimationFrame(()=>{
    $("#openInvitation")?.focus({preventScroll:true});
  });
}

function initRSVP(){
  const stored=getStoredRSVP();
  if(stored==="Confirmo"||stored==="No asistiré"){
    applyCompletedRSVP(stored,false);
  }

  $$("[data-response]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      if(getStoredRSVP())return;

      const response=btn.dataset.response;

      if(response==="Confirmo" || C.rsvp?.pedirDatosEnRechazo){
        openRSVPModal(response);
      }else{
        // Con pedirDatosEnRechazo:false no se envía correo porque no
        // tenemos identidad del invitado. Sí queda registrada la decisión
        // en este navegador y la interfaz se cierra para evitar duplicados.
        applyCompletedRSVP(response,true);
      }
    });
  });

  $$("[data-close-modal]").forEach(el=>el.addEventListener("click",closeRSVPModal));
  $("#rsvpForm").addEventListener("submit",submitRSVPForm);
  $("#exitButton").addEventListener("click",exitInvitation);
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

render();
initGalleryCarousel();
initIntro();
initReveal();
initProgress();
initCountdown();
initMusic();
initRSVP();
initActions();
