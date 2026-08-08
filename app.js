const C=window.INVITACION;
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const setText=(s,v)=>{const e=$(s);if(e)e.textContent=v??""};
const hide=s=>{const e=$(s);if(e)e.style.display="none"};
const clamp=(v,min=0,max=1)=>Math.min(max,Math.max(min,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const ease=t=>1-Math.pow(1-clamp(t),3);
const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function render(){
  document.title=`XV ${C.festejada} — Invitación`;

  setText("#introName",C.festejada.split(" ")[0]);
  setText("#introMessage",C.intro?.mensaje||"");
  setText("#introInstruction",C.intro?.instruccion||"Toca para abrir");
  setText("#heroName",C.festejada.split(" ")[0]);
  setText("#heroMessage",C.portada.mensaje);
  setText("#quoteText",C.frase);
  setText("#dateText",C.fechaTexto);
  setText("#storyTitle",C.historia.titulo);
  setText("#storyText",C.historia.texto);
  setText("#dressCodeText",C.dressCode.texto);
  setText("#giftsText",C.regalos.texto);
  setText("#finalInitial",C.inicial);
  setText("#footerText",C.pie);

  setText("#thankYouTitle",C.agradecimiento?.titulo||"Gracias por tu respuesta");
  setText("#thankYouText",C.agradecimiento?.texto||"Hemos recibido tu respuesta.");
  setText("#thankYouSignature",`XV ${C.festejada}`);

  $("#introPhoto").src=C.intro?.foto||C.portada.foto;
  $("#introPhoto").alt=`Mensajero real entregando la invitación de ${C.festejada}`;
  $("#heroPhoto").src=C.portada.foto;
  $("#heroPhoto").alt=`Retrato de ${C.festejada}`;
  $("#storyPhoto").src=C.historia.foto;
  $("#storyPhoto").alt=`Fotografía de ${C.festejada}`;

  if(C.dressCode?.foto)$("#dressCodePhoto").src=C.dressCode.foto;
  if(C.regalos?.foto)$("#giftsPhoto").src=C.regalos.foto;

  const d=new Date(C.fechaISO);
  setText("#dateDay",String(d.getDate()).padStart(2,"0"));
  setText("#dateMonth",d.toLocaleDateString("es-MX",{month:"long"}).toUpperCase());
  setText("#dateYear",d.getFullYear());

  $("#locations").innerHTML=C.ubicaciones.map((u,i)=>`
    <article class="place-card reveal" data-place-index="${i}">
      <div class="place-media">
        ${u.foto
          ? `<img class="place-photo" src="${u.foto}" loading="lazy" decoding="async" alt="${u.tipo}: ${u.nombre}">`
          : `<div class="map-art"></div>`}
        <div class="place-photo-shade"></div>
      </div>
      <div class="place-card-body">
        <div class="place-index">0${i+1}</div>
        <div class="place-tag">${u.tipo} · ${u.hora}</div>
        <h3>${u.nombre}</h3>
        <p>${u.direccion}</p>
        <a class="btn place-link" href="${u.mapa}" target="_blank" rel="noopener">Abrir ubicación ↗</a>
      </div>
    </article>`).join("");

  $("#timeline").innerHTML=C.itinerario.map((i,index)=>`
    <article class="moment-card" style="--i:${index}" data-moment-index="${index}">
      <div class="moment-number">${String(index+1).padStart(2,"0")}</div>
      <div class="moment-time">${i.hora}</div>
      <h3>${i.titulo}</h3>
      <p>${i.descripcion}</p>
      <div class="moment-line"></div>
    </article>`).join("");

  if(C.galeria?.activa&&C.galeria.fotos?.length){
    $("#gallery").innerHTML=C.galeria.fotos.map((src,i)=>`
      <figure class="gallery-slide" data-index="${i}" aria-hidden="${i===0?"false":"true"}">
        <img src="${src}" ${i===0?'fetchpriority="high"':'loading="lazy"'} decoding="async"
             alt="Recuerdo ${i+1} de ${C.festejada}" draggable="false">
        <figcaption>0${i+1}</figcaption>
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

function initScrollCinema(){
  const heroSection=$("#heroSection");
  const heroSticky=$("#heroSticky");
  const heroMedia=$("#heroMedia");
  const heroPhoto=$("#heroPhoto");
  const heroCopy=$("#heroCopy");
  const storySection=$("#storySection");
  const storyMedia=$("#storyMedia");
  const storyPhoto=$("#storyPhoto");
  const storyCopy=$("#storyCopy");

  let ticking=false;

  const visibleProgress=el=>{
    const r=el.getBoundingClientRect();
    return clamp((innerHeight-r.top)/(innerHeight+r.height));
  };

  function update(){
    ticking=false;

    if(reduceMotion){
      heroMedia.style.width="100%";
      heroMedia.style.height="100%";
      heroMedia.style.borderRadius="0px";
      heroMedia.style.transform="translate(-50%,-50%)";
      heroCopy.style.opacity="1";
      storyMedia.style.clipPath="inset(0% 0% 0% 0% round 30px)";
      storyPhoto.style.transform="none";
      storyCopy.style.transform="none";
      storyCopy.style.opacity="1";
      return;
    }

    const hr=heroSection.getBoundingClientRect();
    const travel=Math.max(1,heroSection.offsetHeight-innerHeight);
    const hp=ease(clamp(-hr.top/travel));
    const containerW=heroSticky.clientWidth;
    const viewportH=heroSticky.clientHeight;
    const startW=Math.min(containerW*.84,480);
    const startH=Math.min(startW*4/3,viewportH*.74);

    heroMedia.style.width=`${lerp(startW,containerW,hp)}px`;
    heroMedia.style.height=`${lerp(startH,viewportH,hp)}px`;
    heroMedia.style.borderRadius=`${lerp(34,0,hp)}px`;
    heroMedia.style.transform=`translate(-50%,-50%) translateY(${lerp(16,0,hp)}px)`;
    heroPhoto.style.transform=`scale(${lerp(1.09,1.02,hp)}) translateY(${lerp(-10,0,hp)}px)`;
    heroCopy.style.opacity=String(lerp(.50,1,hp));
    heroCopy.style.transform=`translateY(${lerp(18,0,hp)}px)`;

    const sp=ease(visibleProgress(storySection));
    const inset=lerp(11,0,sp);
    storyMedia.style.clipPath=`inset(${inset}% ${lerp(7,0,sp)}% ${inset}% ${lerp(7,0,sp)}% round ${lerp(42,28,sp)}px)`;
    storyPhoto.style.transform=`scale(1.08) translateY(${lerp(-24,22,sp)}px)`;
    storyCopy.style.transform=`translateY(${lerp(44,0,sp)}px)`;
    storyCopy.style.opacity=String(lerp(.35,1,sp));

    $$(".place-card").forEach(card=>{
      const p=ease(visibleProgress(card));
      const photo=card.querySelector(".place-photo");
      const body=card.querySelector(".place-card-body");
      if(photo)photo.style.transform=`scale(${lerp(1.12,1.01,p)}) translateY(${lerp(-18,12,p)}px)`;
      if(body)body.style.transform=`translateY(${lerp(34,0,p)}px)`;
    });

    $$(".moment-card").forEach((card,i)=>{
      const rect=card.getBoundingClientRect();
      const stickyTop=86+i*11;
      const stuck=rect.top<=stickyTop+2;
      card.classList.toggle("is-stacked",stuck);
    });
  }

  function request(){
    if(!ticking){
      ticking=true;
      requestAnimationFrame(update);
    }
  }

  addEventListener("scroll",request,{passive:true});
  addEventListener("resize",request,{passive:true});
  update();
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

  function resetDrag(){
    stage.style.setProperty("--drag-x","0px");
    stage.style.setProperty("--drag-rotate","0deg");
  }

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

    counter.textContent=`${String(current+1).padStart(2,"0")} / ${String(total).padStart(2,"0")}`;

    if(total<2){
      prev.hidden=true;
      next.hidden=true;
      $("#galleryDots").hidden=true;
    }
  }

  function go(index,manual=true){
    current=(index+total)%total;
    resetDrag();
    paint();
    if(manual)restartAutoplay();
  }

  function stopAutoplay(){
    if(timer){clearInterval(timer);timer=null}
  }

  function startAutoplay(){
    if(reduceMotion||total<2||!isVisible||document.hidden)return;
    stopAutoplay();
    timer=setInterval(()=>go(current+1,false),4800);
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
    try{stage.setPointerCapture(e.pointerId)}catch{}
  });

  stage.addEventListener("pointermove",e=>{
    if(!pointerActive)return;
    const dx=clamp(e.clientX-pointerStartX,-90,90);
    stage.style.setProperty("--drag-x",`${dx*.34}px`);
    stage.style.setProperty("--drag-rotate",`${dx*.045}deg`);
  });

  stage.addEventListener("pointerup",e=>{
    if(!pointerActive)return;
    pointerActive=false;
    const dx=e.clientX-pointerStartX;
    const dy=e.clientY-pointerStartY;
    resetDrag();

    if(Math.abs(dx)>42&&Math.abs(dx)>Math.abs(dy)*1.12){
      go(current+(dx<0?1:-1));
    }else{
      startAutoplay();
    }
  });

  stage.addEventListener("pointercancel",()=>{
    pointerActive=false;
    resetDrag();
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
    isVisible=entry.isIntersecting&&entry.intersectionRatio>.25;
    if(isVisible){
      carousel.classList.add("carousel-seen");
      startAutoplay();
    }else stopAutoplay();
  },{threshold:[0,.25,.55]});

  observer.observe(carousel);
  paint();
}

function initDetailDeck(){
  const deck=$("#detailDeck");
  if(!deck)return;

  const cards=$$(".detail-deck-card").filter(card=>getComputedStyle(card).display!=="none");
  const prev=$("#detailPrev");
  const next=$("#detailNext");
  const dots=$("#detailDots");
  let current=0;
  let startX=0;
  let startY=0;
  let activePointer=false;

  if(!cards.length){
    hide("#detailsSection");
    return;
  }

  dots.innerHTML=cards.map((_,i)=>`
    <button type="button" class="detail-dot${i===0?" active":""}"
            data-detail-dot="${i}" aria-label="Ver detalle ${i+1}"></button>`).join("");

  const dotButtons=$$(".detail-dot");

  function paint(){
    cards.forEach((card,i)=>{
      const d=(i-current+cards.length)%cards.length;
      card.classList.remove("active","next","behind");
      if(i===current)card.classList.add("active");
      else if(d===1)card.classList.add("next");
      else card.classList.add("behind");
      card.setAttribute("aria-hidden",i===current?"false":"true");
    });
    dotButtons.forEach((dot,i)=>dot.classList.toggle("active",i===current));
  }

  const go=index=>{
    current=(index+cards.length)%cards.length;
    paint();
  };

  prev.addEventListener("click",()=>go(current-1));
  next.addEventListener("click",()=>go(current+1));
  dotButtons.forEach((dot,i)=>dot.addEventListener("click",()=>go(i)));

  deck.addEventListener("pointerdown",e=>{
    if(e.target.closest("a,button"))return;
    activePointer=true;
    startX=e.clientX;
    startY=e.clientY;
  });

  deck.addEventListener("pointerup",e=>{
    if(!activePointer)return;
    activePointer=false;
    const dx=e.clientX-startX;
    const dy=e.clientY-startY;
    if(Math.abs(dx)>42&&Math.abs(dx)>Math.abs(dy)*1.2){
      go(current+(dx<0?1:-1));
    }
  });

  if(cards.length<2){
    prev.hidden=true;
    next.hidden=true;
    dots.hidden=true;
  }

  paint();
}

function initReveal(){
  const o=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add("in");
      o.unobserve(e.target);
    }
  }),{threshold:.10});
  $$(".reveal").forEach(e=>o.observe(e));
}

function openInvitation(){
  $("#intro").classList.add("opening");
  setTimeout(()=>{
    $("#intro").classList.add("closed");
    document.body.classList.remove("locked","thankyou-open");
    $("#thankYouScreen").hidden=true;
  },950);
}

function initIntro(){
  const btn=$("#openInvitation");
  btn.addEventListener("click",openInvitation);
}

function initProgress(){
  const u=()=>{
    const m=document.documentElement.scrollHeight-innerHeight;
    $("#progressBar").style.width=`${m>0?(scrollY/m)*100:0}%`;
  };
  addEventListener("scroll",u,{passive:true});u();
}

function initCountdown(){
  const t=new Date(C.fechaISO).getTime();
  const tick=()=>{
    const x=Math.max(0,t-Date.now());
    setText("#days",String(Math.floor(x/86400000)).padStart(3,"0"));
    setText("#hours",String(Math.floor((x%86400000)/3600000)).padStart(2,"0"));
    setText("#minutes",String(Math.floor((x%3600000)/60000)).padStart(2,"0"));
    setText("#seconds",String(Math.floor((x%60000)/1000)).padStart(2,"0"));
  };
  tick();setInterval(tick,1000);
}

function initMusic(){
  if(!C.musica?.activa)return;
  const a=$("#music"),b=$("#musicButton");let p=false;
  b.addEventListener("click",async()=>{
    try{
      if(p){a.pause();p=false;b.textContent="♫"}
      else{await a.play();p=true;b.textContent="Ⅱ"}
    }catch(e){console.warn(e)}
  });
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
    status.textContent="Completa todos los campos obligatorios.";
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
    respuesta:pendingResponse,
    nombre,
    correo,
    whatsapp,
    comentarios,
    evento:`XV ${C.festejada}`,
    fecha:C.fechaTexto
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

  if(C.musica?.activa){
    const audio=$("#music");
    audio.pause();
    $("#musicButton").textContent="♫";
  }

  window.scrollTo({top:0,left:0,behavior:"auto"});

  const thanks=$("#thankYouScreen");
  thanks.hidden=false;
  document.body.classList.add("locked","thankyou-open");

  setTimeout(()=>{
    thanks.classList.add("visible");
  },20);
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
initIntro();
initReveal();
initScrollCinema();
initGalleryCarousel();
initDetailDeck();
initProgress();
initCountdown();
initMusic();
initRSVP();
initActions();
