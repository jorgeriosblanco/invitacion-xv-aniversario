// ==========================================================
// CONFIGURACIÓN PRINCIPAL DE LA INVITACIÓN — V10
// ==========================================================
window.INVITACION = {
  festejada: "Sofía Mendoza",
  inicial: "S",

  fechaISO: "2026-12-12T17:00:00-06:00",
  fechaTexto: "12 de diciembre de 2026",

  intro: {
    foto: "./assets/fotos/sobre.jpg",
    mensaje: "Tu invitación ha llegado.",
    instruccion: "Abre aquí",
    hotspot: {
      x: 0.421,
      y: 0.617,
      diametro: 108
    }
  },

  portada: {
    mensaje: "Quiero compartir contigo uno de los días más importantes de mi vida.",
    foto: "./assets/fotos/portada.jpg"
  },

  frase: "Hay momentos que pasan una sola vez, pero viven para siempre en quienes los compartieron.",

  historia: {
    titulo: "Una nueva etapa comienza.",
    texto: "Después de tantos sueños, risas y momentos compartidos, llega una noche que quiero vivir rodeada de las personas que forman parte de mi historia.",
    foto: "./assets/fotos/historia.jpg"
  },

  ubicaciones: [
    {
      tipo: "Ceremonia",
      hora: "17:00 h",
      nombre: "Templo de Santa Clara",
      direccion: "Centro Histórico · San Juan del Río, Querétaro",
      mapa: "https://www.google.com/maps/search/?api=1&query=San+Juan+del+Rio+Queretaro",
      foto: "./assets/fotos/ceremonia.jpg"
    },
    {
      tipo: "Recepción",
      hora: "19:00 h",
      nombre: "Hacienda Jardín de Luna",
      direccion: "Camino de los Olivos 125 · San Juan del Río, Querétaro",
      mapa: "https://www.google.com/maps/search/?api=1&query=San+Juan+del+Rio+Queretaro",
      foto: "./assets/fotos/recepcion.jpg"
    }
  ],

  itinerario: [
    { hora: "17:00", titulo: "Ceremonia", descripcion: "El comienzo de un día inolvidable.", icono: "iglesia" },
    { hora: "19:00", titulo: "Bienvenida", descripcion: "Cóctel, fotografías y reencuentros.", icono: "copa" },
    { hora: "20:00", titulo: "Cena", descripcion: "Una mesa para compartir historias.", icono: "cubiertos" },
    { hora: "21:30", titulo: "Vals", descripcion: "El momento más esperado de la noche.", icono: "musica" },
    { hora: "22:00", titulo: "Fiesta", descripcion: "La noche apenas comienza.", icono: "estrella" }
  ],

  galeria: {
    activa: true,
    capitulos: [
      {
        foto: "./assets/fotos/galeria-01.jpg",
        titulo: "La gran presentación",
        texto: "El vestido, la elegancia y ese instante en que todo comienza."
      },
      {
        foto: "./assets/fotos/galeria-02.jpg",
        titulo: "Mi propia forma de brillar",
        texto: "Un toque contemporáneo, actitud y personalidad para romper la pose clásica."
      },
      {
        foto: "./assets/fotos/galeria-03.jpg",
        titulo: "Movimiento",
        texto: "El vestido cobra vida cuando la fotografía deja de ser una pose."
      },
      {
        foto: "./assets/fotos/detalle-zapatos.jpg",
        titulo: "Los pequeños detalles",
        texto: "Zapatos, textura y accesorios: la historia también vive en lo que casi pasa desapercibido."
      },
      {
        foto: "./assets/fotos/detalle-corona.jpg",
        titulo: "La corona",
        texto: "Un instante íntimo antes de salir y convertirse en protagonista."
      },
      {
        foto: "./assets/fotos/detalle-ramo.jpg",
        titulo: "Entre mis manos",
        texto: "El ramo, la joyería y los detalles completan la memoria del gran día."
      }
    ]
  },

  dressCode: {
    activo: true,
    texto: "Formal elegante. Evita tonos demasiado cercanos al rosa empolvado del vestido de la quinceañera.",
    foto: "./assets/fotos/dresscode.jpg"
  },

  regalos: {
    activo: true,
    texto: "Tu presencia es mi mejor regalo. Si deseas tener un detalle conmigo, puedes consultar nuestra mesa de regalos.",
    enlace: "https://www.example.com/",
    foto: "./assets/fotos/regalos.jpg"
  },

  finale: {
    foto: "./assets/fotos/finale.jpg",
    frase: "Gracias por formar parte de esta historia.",
    marca: "Creado con YRW Events"
  },

  musica: {
    activa: false,
    archivo: "./assets/audio/musica.mp3"
  },

  rsvpEndpoint: "https://script.google.com/macros/s/AKfycbzZvdSNEZBBjl3Yf9xvaoWla_Z9mRcxk25MvUcfuMdVxdo5i_ZaPYTL1tL9brdyBT-n/exec",

  rsvp: {
    confirmacion: "Confirmo",
    rechazo: "No asistiré",
    pedirDatosEnRechazo: true
  },

  pie: "YRW Tech · yrw.events@gmail.com · Invitación digital"
};
