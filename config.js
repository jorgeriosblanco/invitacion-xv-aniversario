// ==========================================================
// CONFIGURACIÓN PRINCIPAL DE LA INVITACIÓN
// Aquí cambias contenido sin tocar diseño ni lógica.
// ==========================================================
window.INVITACION = {
  festejada: "Sofía Mendoza",
  inicial: "S",

  fechaISO: "2026-12-12T17:00:00-06:00",
  fechaTexto: "12 de diciembre de 2026",

  portada: {
    mensaje: "Quiero compartir contigo uno de los días más importantes de mi vida.",
    foto: "./assets/fotos/portada.svg"
  },

  frase: "Hay momentos que pasan una sola vez, pero viven para siempre en quienes los compartieron.",

  historia: {
    titulo: "Una nueva etapa comienza.",
    texto: "Después de tantos sueños, risas y momentos compartidos, llega una noche que quiero vivir rodeada de las personas que forman parte de mi historia.",
    foto: "./assets/fotos/historia.svg"
  },

  ubicaciones: [
    {
      tipo: "Ceremonia",
      hora: "17:00 h",
      nombre: "Templo de Santa Clara",
      direccion: "Centro Histórico · San Juan del Río, Querétaro",
      mapa: "https://www.google.com/maps/search/?api=1&query=San+Juan+del+Rio+Queretaro"
    },
    {
      tipo: "Recepción",
      hora: "19:00 h",
      nombre: "Hacienda Jardín de Luna",
      direccion: "Camino de los Olivos 125 · San Juan del Río, Querétaro",
      mapa: "https://www.google.com/maps/search/?api=1&query=San+Juan+del+Rio+Queretaro"
    }
  ],

  itinerario: [
    { hora: "17:00", titulo: "Ceremonia", descripcion: "El comienzo de un día inolvidable." },
    { hora: "19:00", titulo: "Bienvenida", descripcion: "Cóctel, fotografías y reencuentros." },
    { hora: "20:00", titulo: "Cena", descripcion: "Una mesa para compartir historias." },
    { hora: "21:30", titulo: "Vals", descripcion: "El momento más esperado de la noche." },
    { hora: "22:00", titulo: "Fiesta", descripcion: "La noche apenas comienza." }
  ],

  galeria: {
    activa: true,
    fotos: [
      "./assets/fotos/galeria-01.svg",
      "./assets/fotos/galeria-02.svg",
      "./assets/fotos/galeria-03.svg"
    ]
  },

  dressCode: {
    activo: true,
    texto: "Formal elegante. Reserva por favor los tonos champagne y rosa empolvado para la quinceañera."
  },

  regalos: {
    activo: true,
    texto: "Tu presencia es mi mejor regalo. Si deseas tener un detalle conmigo, puedes consultar nuestra mesa de regalos.",
    enlace: "https://www.example.com/"
  },

  musica: {
    activa: false,
    archivo: "./assets/audio/musica.mp3"
  },

  // URL pública de tu Google Apps Script desplegado como Web App.
  // Ejemplo: https://script.google.com/macros/s/XXXXXXXXXXXX/exec
  rsvpEndpoint: "https://script.google.com/macros/s/AKfycbzZvdSNEZBBjl3Yf9xvaoWla_Z9mRcxk25MvUcfuMdVxdo5i_ZaPYTL1tL9brdyBT-n/exec",


  rsvp: {
    confirmacion: "Confirmo",
    rechazo: "No asistiré",

    // false = solo "Confirmo" solicita nombre/correo/WhatsApp.
    // true  = también "No asistiré" solicita esos datos.
    pedirDatosEnRechazo: false
  },

  pie: "YRW Tech · yrw.events@gmail.com · Invitación digital"
};
