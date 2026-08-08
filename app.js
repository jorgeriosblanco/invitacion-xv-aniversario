const C=window.INVITACION;
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const setText=(s,v)=>{const e=$(s);if(e)e.textContent=v??""};
const hide=s=>{const e=$(s);if(e)e.style.display="none"};
const clamp=(v,min=0,max=1)=>Math.min(max,Math.max(min,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const ease=t=>1-Math.pow(1-clamp(t),3);
const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const iconSVG=name=>{
  const icons={
    iglesia:`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 6v8M20 10h8M11 40h26M14 40V21l10-7 10 7v19M20 40V29h8v11M10 21h28"/></svg>`,
    copa:`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 9h20l-2 13a8 8 0 0 1-16 0L14 9Zm10 21v9m-7 0h14"/></svg>`,
    cubiertos:`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 7v14m-4-14v9a4 4 0 0 0 8 0V7m-4 14v20M31 7v34m0-24c6 0 8-4 8-10v10h-8Z"/></svg>`,
    musica:`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M19 34a5 5 0 1 1-5-5c2 0 3 .5 5 1V13l18-4v20M37 29a5 5 0 1 1-5-5c2 0 3 .5 5 1"/></svg>`,
    estrella:`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="m24 7 4.5 10 10.5 1-8 7 2.5 10.5L24 30l-9.5 5.5L17 25l-8-7 10.5-1L24 7Z"/></svg>`
  };
  return icons[name]||icons.estrella;
};

function render(){
  document.title=`XV ${C.festejada} — Invitación`;
  const first=C.festejada.split(" ")[0];

  setText("#introName",first);
  setText("#introMessage",C.intro?.mensaje||"Tu invitación ha llegado.");
  setText("#introInstruction",C.intro?.instruccion||"Abre aquí");
  setText("#heroName",first);
  setText("#heroMessage",C.portada.mensaje);
  setText("#quoteText",C.frase);
  setText("#dateText",C.fechaTexto);
  setText("#storyTitle",C.historia.titulo);
  setText("#storyText",C.historia.texto);
  setText("#dressCodeText",C.dressCode.texto);
  setText("#giftsText",C.regalos.texto);
  setText("#finalInitial",C.inicial);
  setText("#footerText",C.pie);

  $("#introPhoto").src=C.intro?.foto||C.portada.foto;
  $("#heroPhoto").src=C.portada.foto;
  $("#storyPhoto").src=C.historia.foto;
  if(C.dressCode?.foto)$("#dressCodePhoto").src=C.dressCode.foto;
  if(C.regalos?.foto)$("#giftsPhoto").src=C.regalos.foto;

  const finalePhoto=C.finale?.foto||C.portada.foto;
  $("#finalePhoto").src=finalePhoto;
  $("#thankYouPhoto").src=finalePhoto;
  setText("#finaleName",first);
  setText("#finaleDate",C.fechaTexto);
  setText("#finalePlace",C.ubicaciones?.[1]?.nombre||C.ubicaciones?.[0]?.nombre||"");
  setText("#finalePhrase",C.finale?.frase||"Gracias por formar parte de esta historia.");
  setText("#finaleBrand",C.finale?.marca||"Creado con YRW Events");

  setText("#thankYouName",`${first} · XV Años`);
  setText("#thankYouDate",C.fechaTexto);
  setText("#thankYouPlace",C.ubicaciones?.[1]?.nombre||"");

  const d=new Date(C.fechaISO);
  setText("#dateDay",String(d.getDate()).padStart(2,"0"));
  setText("#dateMonth",d.toLocaleDateString("es-MX",{month:"long"}).toUpperCase());
  setText("#dateYear",d.getFullYear());

  $("#locations").innerHTML=C.ubicaciones.map((u,i)=>`
    <article class="place-card reveal" data-place-index="${i}">
      <div class="place-media">
        <img class="place-photo" src="${u.foto}" loading="lazy" decoding="async" alt="${u.tipo}: ${u.nombre}">
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

  $("#timeline").innerHTML=C.itinerario.map((item,index)=>`
    <article class="timeline-item" data-timeline-item>
      <div class="timeline-node">
        <span class="timeline-icon">${iconSVG(item.icono)}</span>
      </div>
      <div class="timeline-copy">
        <span class="timeline-time">${item.hora}</span>
        <h3>${item.titulo}</h3>
        <p>${item.descripcion}</p>
      </div>
    </article>`).join("");

  const chapters=C.galeria?.capitulos||[];
  if(C.galeria?.activa&&chapters.length){
    $("#gallery").innerHTML=chapters.map((item,i)=>`
      <figure class="story-slide" data-index="${i}" aria-hidden="${i===0?"false":"true"}">
        <img src="${item.foto}" ${i===0?'fetchpriority="high"':'loading="lazy"'} decoding="async"
             alt="${item.titulo}" draggable="false">
      </figure>`).join("");
    setGalleryText(0);
  }else hide("#gallerySection");

  if(!C.dressCode?.activo)hide("#dressCodeCard");
  if(C.regalos?.activo)$("#giftsLink").href=C.regalos.enlace; else hide("#giftsCard");

  if(C.musica?.activa)$("#music").src=C.musica.archivo; else hide("#musicButton");
}

function setGalleryText(index){
  const items=C.galeria?.capitulos||[];
  const item=items[index];
  if(!item)return;
  setText("#galleryChapter",`CAPÍTULO ${String(index+1).padStart(2,"0")}`);
  setText("#galleryTitle",item.titulo);
  setText("#galleryText",item.texto);
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

    if(!reduceMotion){
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
    }
  }

  const request=()=>{
    if(!ticking){
      ticking=true;
      requestAnimationFrame(update);
    }
  };
  addEventListener("scroll",request,{passive:true});
  addEventListener("resize",request,{passive:true});
  update();
}

function initTimeline(){
  const section=$("#momentsSection");
  const fill=$("#timelineFill");
  const items=$$("[data-timeline-item]");
  if(!section||!fill||!items.length)return;

  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting)entry.target.classList.add("visible");
    });
  },{threshold:.32});
  items.forEach(item=>observer.observe(item));

  let ticking=false;
  const update=()=>{
    ticking=false;
    const r=section.getBoundingClientRect();
    const start=innerHeight*.70;
    const end=innerHeight*.25;
    const total=Math.max(1,r.height-(start-end));
    const progressed=clamp((start-r.top)/total);
    fill.style.transform=`scaleY(${progressed})`;
  };
  addEventListener("scroll",()=>{
    if(!ticking){
      ticking=true;
      requestAnimationFrame(update);
    }
  },{passive:true});
  addEventListener("resize",update,{passive:true});
  update();
}

function initGalleryStory(){
  const carousel=$("#galleryCarousel");
  const stage=$("#galleryStage");
  const slides=$$(".story-slide");
  const progress=$("#galleryProgress");
  const backdropA=$("#galleryBackdropA");
  const backdropB=$("#galleryBackdropB");
  const items=C.galeria?.capitulos||[];
  const total=slides.length;
  if(!carousel||!stage||!total)return;

  let current=0;
  let timer=null;
  let visible=false;
  let userControlled=false;
  let pointer=false;
  let sx=0,sy=0,dx=0;
  let activeBackdrop=0;

  const signedDistance=index=>{
    let d=(index-current+total)%total;
    if(d>total/2)d-=total;
    return d;
  };

  const updateBackdrop=index=>{
    const url=`url("${items[index].foto}")`;
    const next=activeBackdrop===0?backdropB:backdropA;
    const prev=activeBackdrop===0?backdropA:backdropB;
    next.style.backgroundImage=url;
    next.classList.add("active");
    prev.classList.remove("active");
    activeBackdrop=activeBackdrop===0?1:0;
  };

  function paint(){
    slides.forEach((slide,i)=>{
      const d=signedDistance(i);
      slide.classList.remove("active","prev","next","far");
      if(d===0)slide.classList.add("active");
      else if(d===-1)slide.classList.add("prev");
      else if(d===1)slide.classList.add("next");
      else slide.classList.add("far");
      slide.setAttribute("aria-hidden",d===0?"false":"true");
    });

    setGalleryText(current);
    progress.style.width=`${((current+1)/total)*100}%`;
    updateBackdrop(current);
  }

  const stop=()=>{
    if(timer){clearInterval(timer);timer=null}
  };

  const start=()=>{
    if(reduceMotion||userControlled||!visible||document.hidden||total<2)return;
    stop();
    timer=setInterval(()=>go(current+1,false),4600);
  };

  function go(index,manual=true){
    current=(index+total)%total;
    stage.style.setProperty("--drag-x","0px");
    paint();
    if(manual){
      userControlled=true;
      stop();
    }
  }

  stage.addEventListener("pointerdown",e=>{
    if(e.pointerType==="mouse"&&e.button!==0)return;
    pointer=true; sx=e.clientX; sy=e.clientY; dx=0;
    stop();
    try{stage.setPointerCapture(e.pointerId)}catch{}
  });

  stage.addEventListener("pointermove",e=>{
    if(!pointer)return;
    dx=clamp(e.clientX-sx,-100,100);
    stage.style.setProperty("--drag-x",`${dx*.28}px`);
  });

  stage.addEventListener("pointerup",e=>{
    if(!pointer)return;
    pointer=false;
    const x=e.clientX-sx;
    const y=e.clientY-sy;
    stage.style.setProperty("--drag-x","0px");
    if(Math.abs(x)>42&&Math.abs(x)>Math.abs(y)*1.15)go(current+(x<0?1:-1),true);
    else{
      userControlled=true;
      stop();
    }
  });

  stage.addEventListener("pointercancel",()=>{
    pointer=false;
    stage.style.setProperty("--drag-x","0px");
  });

  const io=new IntersectionObserver(entries=>{
    const e=entries[0];
    visible=e.isIntersecting&&e.intersectionRatio>.28;
    if(visible){
      carousel.classList.add("story-seen");
      start();
    }else stop();
  },{threshold:[0,.28,.55]});
  io.observe(carousel);

  document.addEventListener("visibilitychange",()=>{
    if(document.hidden)stop(); else start();
  });

  backdropA.style.backgroundImage=`url("${items[0].foto}")`;
  backdropA.classList.add("active");
  activeBackdrop=0;
  paint();
}

function initDetailDeck(){
  const deck=$("#detailDeck");
  const viewport=$("#detailViewport");
  const track=$("#detailTrack");
  const cards=$$(".detail-card").filter(card=>getComputedStyle(card).display!=="none");
  const prev=$("#detailPrev");
  const next=$("#detailNext");
  const progress=$("#detailProgress");
  const counter=$("#detailCounter");
  if(!deck||!viewport||!track||!cards.length)return;

  let current=0;
  let pointer=false,sx=0,sy=0;
  let peeked=false;

  function paint(animate=true){
    track.style.transition=animate?"transform .72s cubic-bezier(.18,.84,.24,1)":"none";
    const cardW=cards[0].getBoundingClientRect().width;
    const gap=parseFloat(getComputedStyle(track).gap)||14;
    const step=cardW+gap;
    track.style.transform=`translateX(${-current*step}px)`;

    cards.forEach((card,i)=>{
      card.classList.toggle("active",i===current);
      card.classList.toggle("adjacent",Math.abs(i-current)===1);
    });

    counter.textContent=`${current+1} / ${cards.length}`;
    progress.style.width=`${((current+1)/cards.length)*100}%`;
    prev.disabled=current===0;
    next.disabled=current===cards.length-1;
  }

  const go=index=>{
    current=clamp(index,0,cards.length-1);
    paint(true);
  };

  prev.addEventListener("click",()=>go(current-1));
  next.addEventListener("click",()=>go(current+1));

  viewport.addEventListener("pointerdown",e=>{
    if(e.target.closest("a,button"))return;
    pointer=true;sx=e.clientX;sy=e.clientY;
  });
  viewport.addEventListener("pointerup",e=>{
    if(!pointer)return;
    pointer=false;
    const dx=e.clientX-sx,dy=e.clientY-sy;
    if(Math.abs(dx)>42&&Math.abs(dx)>Math.abs(dy)*1.2)go(current+(dx<0?1:-1));
  });

  const io=new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting&&!peeked&&cards.length>1&&!reduceMotion){
      peeked=true;
      setTimeout(()=>{
        if(current!==0)return;
        const cardW=cards[0].getBoundingClientRect().width;
        const gap=parseFloat(getComputedStyle(track).gap)||14;
        track.style.transition="transform .48s ease";
        track.style.transform=`translateX(${-Math.min((cardW+gap)*.13,52)}px)`;
        setTimeout(()=>paint(true),650);
      },450);
    }
  },{threshold:.55});
  io.observe(deck);

  addEventListener("resize",()=>paint(false),{passive:true});
  paint(false);
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

function positionIntroHotspot(){
  const img=$("#introPhoto");
  const scene=$(".intro-scene");
  const hotspot=$("#openInvitation");
  if(!img||!scene||!hotspot||!img.naturalWidth||!img.naturalHeight)return;

  const h=C.intro?.hotspot||{};
  const nx=Number.isFinite(h.x)?h.x:.421;
  const ny=Number.isFinite(h.y)?h.y:.617;
  const sceneW=scene.clientWidth;
  const sceneH=scene.clientHeight;
  const scale=Math.max(sceneW/img.naturalWidth,sceneH/img.naturalHeight);
  const renderedW=img.naturalWidth*scale;
  const renderedH=img.naturalHeight*scale;
  const offsetX=(sceneW-renderedW)/2;
  const offsetY=(sceneH-renderedH)/2;
  const x=offsetX+(nx*renderedW);
  const y=offsetY+(ny*renderedH);
  const requested=Number(h.diametro)||108;
  const responsive=Math.min(sceneW,sceneH)*.27;
  const size=clamp(Math.min(requested,responsive),82,112);

  hotspot.style.left=`${x}px`;
  hotspot.style.top=`${y}px`;
  hotspot.style.width=`${size}px`;
  hotspot.style.height=`${size}px`;
}

function initIntro(){
  const btn=$("#openInvitation");
  const img=$("#introPhoto");
  btn.addEventListener("click",openInvitation);
  if(img.complete)positionIntroHotspot();
  else img.addEventListener("load",positionIntroHotspot,{once:true});
  addEventListener("resize",positionIntroHotspot,{passive:true});
  addEventListener("orientationchange",()=>setTimeout(positionIntroHotspot,120),{passive:true});
}

function initProgress(){
  const u=()=>{
    const m=document.documentElement.scrollHeight-innerHeight;
    $("#progressBar").style.width=`${m>0?(scrollY/m)*100:0}%`;
  };
  addEventListener("scroll",u,{passive:true});u();
}

function initCountdown(){
  const eventTime=new Date(C.fechaISO).getTime();
  const startTime=Date.now();
  const initial=Math.max(1,eventTime-startTime);

  const tick=()=>{
    const remaining=Math.max(0,eventTime-Date.now());
    setText("#days",String(Math.floor(remaining/86400000)));
    setText("#hours",String(Math.floor((remaining%86400000)/3600000)).padStart(2,"0"));
    setText("#minutes",String(Math.floor((remaining%3600000)/60000)).padStart(2,"0"));
    setText("#seconds",String(Math.floor((remaining%60000)/1000)).padStart(2,"0"));

    const elapsed=clamp(1-(remaining/initial));
    $("#countdownProgress").style.width=`${Math.max(4,elapsed*100)}%`;
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

  $("#rsvp .rsvp-card")?.classList.add("answered");
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

  if(honeypot){closeRSVPModal();return}
  if(!nombre||!correo||!whatsapp){
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
    nombre,correo,whatsapp,comentarios,
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

function prepareThankYou(response){
  const first=C.festejada.split(" ")[0];
  if(response==="Confirmo"){
    setText("#thankYouTitle","Gracias por confirmar");
    setText("#thankYouText","Tu respuesta quedó registrada. Nos dará muchísimo gusto compartir este día contigo.");
    setText("#thankYouSignature","Nos vemos muy pronto.");
  }else{
    setText("#thankYouTitle","Gracias por avisarnos");
    setText("#thankYouText","Tu respuesta quedó registrada. Gracias por acompañarnos de corazón, aunque esta vez sea a la distancia.");
    setText("#thankYouSignature","Siempre formarás parte de este momento.");
  }
  setText("#thankYouName",`${first} · XV Años`);
}

function exitInvitation(){
  closeRSVPModal();
  const response=getStoredRSVP()||pendingResponse;
  prepareThankYou(response);

  if(C.musica?.activa){
    const audio=$("#music");
    audio.pause();
    $("#musicButton").textContent="♫";
  }

  window.scrollTo({top:0,left:0,behavior:"auto"});
  const thanks=$("#thankYouScreen");
  thanks.hidden=false;
  document.body.classList.add("locked","thankyou-open");
  setTimeout(()=>thanks.classList.add("visible"),20);
}

function initRSVP(){
  const stored=getStoredRSVP();
  if(stored==="Confirmo"||stored==="No asistiré")applyCompletedRSVP(stored,false);

  $$("[data-response]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      if(getStoredRSVP())return;
      const response=btn.dataset.response;
      if(response==="Confirmo"||C.rsvp?.pedirDatosEnRechazo)openRSVPModal(response);
      else applyCompletedRSVP(response,true);
    });
  });

  $$("[data-close-modal]").forEach(el=>el.addEventListener("click",closeRSVPModal));
  $("#rsvpForm").addEventListener("submit",submitRSVPForm);
  $("#exitButton").addEventListener("click",exitInvitation);
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeRSVPModal()});
}

function initActions(){
  $("#calendarButton").addEventListener("click",()=>{
    const start=new Date(C.fechaISO),end=new Date(start.getTime()+6*60*60*1000);
    const fmt=d=>d.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}Z$/,"Z");
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
    const blob=new Blob([ics],{type:"text/calendar;charset=utf-8"});
    const url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download=`XV-${C.festejada.replace(/\s+/g,"-")}.ics`;
    document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  });

  $("#copyButton").addEventListener("click",async()=>{
    const text=`XV ${C.festejada}\n${C.fechaTexto}\n${C.ubicaciones.map(u=>`${u.tipo}: ${u.hora} · ${u.nombre}`).join("\n")}`;
    try{
      await navigator.clipboard.writeText(text);
      $("#copyButton").textContent="✓ Copiado";
    }catch{alert(text)}
    setTimeout(()=>$("#copyButton").textContent="Copiar datos",1500);
  });
}

render();
initIntro();
initReveal();
initScrollCinema();
initTimeline();
initGalleryStory();
initDetailDeck();
initProgress();
initCountdown();
initMusic();
initRSVP();
initActions();
