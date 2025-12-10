import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const initialState = {
  mostrar: false,
  mensajes: [{ autor: "bot", texto: "¡Hola! ¿En qué puedo ayudarte hoy?" }],
  entrada: "",
  isLoading: false,
}

// Thunk para enviar mensaje y generar respuesta
export const enviarMensajeThunk = createAsyncThunk("chatbot/enviarMensaje", async (mensaje, { dispatch, getState }) => {
  if (!mensaje.trim()) return

  const nuevoMensaje = { autor: "usuario", texto: mensaje.trim() }
  const respuestaBot = {
    autor: "bot",
    texto: generarRespuesta(mensaje.trim()),
  }

  // Simular delay de respuesta del bot
  await new Promise((resolve) => setTimeout(resolve, 500))

  return [nuevoMensaje, respuestaBot]
})

const generarRespuesta = (texto) => {
  const textoMin = texto.toLowerCase().trim()

  const incluyeAlguna = (frases) => frases.some((f) => textoMin.includes(f))


  const frasesCompras = [
    "quiero ver mis compras",
    "historial de compras",
    "ver pedidos anteriores",
    "dónde veo lo que compré",
    "seguimiento de pedido",
    "estado de mi pedido",
    "consultar pedido",
    "rastrear pedido",
    "pedido ya realizado",
    "ver mis pedidos",
    "compras pasadas",
    "pedidos pasados",
    "estado de compra",
    "cómo va mi compra",
    "qué pasó con mi pedido",
    "quiero chequear mis compras",
    "mi pedido ya llegó",
    "puedo ver mis compras",
    "dónde está mi pedido",
    "cómo revisar mis compras",
  ]

  const frasesPerfil = [
    "editar perfil",
    "cambiar datos personales",
    "modificar mi información",
    "actualizar perfil",
    "cambiar contraseña",
    "cambiar mi email",
    "datos personales",
    "quiero editar mi cuenta",
    "actualizar mis datos",
    "actualizar contraseña",
    "cambiar nombre de usuario",
    "editar configuración de cuenta",
    "cómo cambio mis datos",
    "ajustar perfil",
    "modificar email",
    "actualizar teléfono",
    "quiero cambiar mis datos",
    "modificar configuración",
    "editar cuenta",
    "modificar usuario",
  ]

  const frasesSaludo = [
    "hola",
    "buenos días",
    "buenas tardes",
    "buenas noches",
    "¿qué tal?",
    "buen día",
    "hola, ¿cómo estás?",
    "buenas",
    "qué onda",
    "qué hay",
    "hey",
    "holi",
    "saludos",
    "saludos cordiales",
    "buenas, bot",
    "hola bot",
    "hola amigo",
    "hola asistente",
    "hola, estoy acá",
    "hola, tengo una duda",
  ]

  const frasesEnvio = [
    "cuánto tarda el envío",
    "seguimiento de envío",
    "estado del pedido",
    "demora en la entrega",
    "dónde está mi pedido",
    "llegada del paquete",
    "fecha de entrega",
    "rastreo de envío",
    "dónde está el paquete",
    "paquete no llegó",
    "mi pedido está en camino",
    "cuándo llega el pedido",
    "cuándo entregan",
    "tarda mucho el envío",
    "ya lo enviaron",
    "ya lo mandaron",
    "cuánto demora en llegar",
    "entrega demorada",
    "quiero saber dónde está el envío",
    "no recibí mi compra",
  ]

  const frasesDevoluciones = [
    "devolución",
    "quiero devolver",
    "hacer una devolución",
    "cómo cambio un producto",
    "reembolso",
    "puedo devolver",
    "devolver un producto",
    "garantía",
    "política de devoluciones",
    "devoluciones y reembolsos",
    "quiero cambiar lo que compré",
    "producto defectuoso",
    "producto roto",
    "no me gustó el producto",
    "no es lo que pedí",
    "necesito un reembolso",
    "quiero cambiar el talle",
    "devolver por falla",
    "cómo devuelvo algo",
    "necesito cambiar lo que compré",
  ]

  const frasesTalles = [
    "qué talle uso",
    "guía de talles",
    "medidas",
    "cómo elegir talla",
    "mi talla",
    "qué talla soy",
    "tabla de talles",
    "ayuda con el talle",
    "no sé qué número soy",
    "cómo saber el talle",
    "guía de tallas",
    "equivalencia de talles",
    "qué número me queda",
    "qué talle me conviene",
    "cómo elegir el tamaño",
    "talle correcto",
    "cuál es mi número",
    "consulta de talle",
    "diferencia de talles",
    "necesito saber mi talla",
  ]

  const frasesPagos = [
    "formas de pago",
    "tarjetas aceptadas",
    "aceptan tarjeta",
    "método de pago",
    "pago con débito",
    "pago con crédito",
    "cómo pagar",
    "tarjeta de crédito",
    "tarjeta de débito",
    "transferencia",
    "mercadopago",
    "puedo pagar en cuotas",
    "cuotas sin interés",
    "aceptan efectivo",
    "qué medios de pago tienen",
    "puedo pagar online",
    "medios de pago disponibles",
    "pago electrónico",
    "pago con QR",
    "formas disponibles para pagar",
  ]

  const frasesStock = [
    "hay stock",
    "queda stock",
    "tienen en stock",
    "producto disponible",
    "disponibilidad",
    "disponible para comprar",
    "me queda este talle",
    "stock por talle",
    "queda mi número",
    "queda mi talle",
    "está disponible",
    "tienen talle 42",
    "puedo comprar este modelo",
    "modelo agotado",
    "zapatilla disponible",
    "hay disponibilidad",
    "ya no tienen stock",
    "sin stock",
    "tienen este producto",
    "quiero saber si está disponible",
  ]

  const frasesOfertas = [
    "oferta",
    "descuento",
    "promoción",
    "liquidación",
    "rebajas",
    "cupones",
    "promo",
    "precios especiales",
    "rebaja",
    "tienen alguna oferta",
    "hay descuentos",
    "cuánto está rebajado",
    "está en promoción",
    "descuentos disponibles",
    "ofertas actuales",
    "promo del día",
    "cupones de descuento",
    "promociones activas",
    "hay rebajas",
    "ofertas en zapatillas",
  ]

  const frasesContacto = [
    "contacto",
    "ayuda",
    "soporte",
    "atención al cliente",
    "cómo contacto",
    "quiero ayuda",
    "dónde contacto",
    "número de teléfono",
    "correo de soporte",
    "hablar con alguien",
    "necesito hablar",
    "necesito asistencia",
    "problema con el pedido",
    "quiero hacer una consulta",
    "necesito soporte técnico",
    "dónde puedo escribir",
    "mail de contacto",
    "dónde enviar mensaje",
    "formulario de contacto",
    "chatear con soporte",
  ]

  const frasesProcesoCompra = [
    "cómo comprar una zapatilla",
    "cómo es el proceso de compra",
    "cómo hago para comprar",
    "quiero comprar una zapatilla",
    "quiero comprar zapatilla",
    "cómo elijo un producto",
    "cómo se realiza la compra",
    "pasos para comprar",
    "cómo funciona la compra",
    "cómo funciona la tienda",
    "cómo se compra",
    "quiero saber cómo comprar",
    "necesito ayuda para comprar",
    "explicame cómo se compra",
    "me mostrás cómo comprar",
    "qué pasos sigo para comprar",
    "cómo agrego al carrito",
    "cómo finalizar la compra",
    "cómo se hace una compra",
    "quiero hacer una compra",
    "cómo empiezo a comprar",
    "qué hago para comprar",
    "desde dónde se compra",
    "quiero entender cómo comprar",
    "cómo funciona el sitio para comprar",
    "cómo uso la tienda online",
  ]

  const frasesProductos = [
    "quiero ver productos",
    "qué productos tienen",
    "mostrarme productos",
    "productos disponibles",
    "qué zapatillas tienen",
    "quiero ver zapatillas",
    "qué modelos tienen",
    "mostrarme modelos",
    "productos en stock",
    "qué hay para comprar",
    "quiero ver catálogo",
    "qué hay en la tienda",
    "mostrarme catálogo",
    "qué productos ofrecen",
    "quiero ver la tienda",
    "qué hay en la tienda online",
    "qué productos tienen disponibles",
    "quiero ver la colección",
    "qué modelos están en oferta",
    "qué modelos nuevos tienen",
    "quiero ver novedades",
    "qué hay de nuevo",
    "mostrarme novedades",
    "qué hay de nuevo en la tienda",
    "quiero ver lo nuevo",
    "qué hay de nuevo en productos",
  ]


  const contiene = (palabras) => palabras.some((p) => textoMin.includes(p))

  // Saludo
  if (incluyeAlguna(frasesSaludo) || contiene(["hola", "buenas", "saludos", "hey", "holi"])) {
    return "¡Hola! ¿En qué te puedo ayudar?"
  }

  // Productos
  if (
    incluyeAlguna(frasesProductos) ||
    contiene(["productos", "zapatillas", "modelos", "colección", "catálogo", "novedades"])
  ) {
    return "Podés ver nuestros productos en la sección de productos."
  }

  // Compras
  if (
    incluyeAlguna(frasesCompras) ||
    contiene(["comprar", "compra", "compras", "pedido", "historial", "proceso de compra"])
  ) {
    return "Puedes ver todas tus compras en la sección de historial dentro de tu cuenta."
  }

  // Perfil
  if (
    incluyeAlguna(frasesPerfil) ||
    contiene(["perfil", "cuenta", "datos", "contraseña", "usuario"])
  ) {
    return "Para editar tu perfil, ve a la opción de configuración o perfil en tu cuenta."
  }

  // Envío
  if (
    incluyeAlguna(frasesEnvio) ||
    contiene(["envío", "llega", "entrega", "paquete", "enviado"])
  ) {
    return "Los envíos tardan entre 3 y 7 días hábiles, dependiendo de tu ubicación."
  }

  // Devoluciones
  if (
    incluyeAlguna(frasesDevoluciones) ||
    contiene(["cambio", "devolución", "reembolso", "defectuoso", "garantía"])
  ) {
    return "Puedes hacer devoluciones o cambios dentro de los 30 días posteriores a la compra."
  }

  // Talles
  if (
    incluyeAlguna(frasesTalles) ||
    contiene(["talle", "número", "medida", "guía", "tamaño"])
  ) {
    return "Consulta nuestra guía de talles para elegir el tamaño correcto."
  }

  // Pagos
  if (
    incluyeAlguna(frasesPagos) ||
    contiene(["pago", "tarjeta", "mercadopago", "transferencia", "cuotas", "efectivo"])
  ) {
    return "Aceptamos tarjetas de crédito, débito, pagos por MercadoPago y transferencia bancaria."
  }

  // Stock
  if (
    incluyeAlguna(frasesStock) ||
    contiene(["stock", "disponible", "agotado", "quedan", "modelo"])
  ) {
    return "Puedes consultar el stock disponible en la página de cada producto, seleccionando el talle que deseas."
  }

  // Ofertas
  if (
    incluyeAlguna(frasesOfertas) ||
    contiene(["oferta", "promoción", "descuento", "rebaja", "liquidación"])
  ) {
    return "Tenemos ofertas y promociones especiales que renovamos periódicamente."
  }

  // Contacto
  if (
    incluyeAlguna(frasesContacto) ||
    contiene(["contacto", "ayuda", "soporte", "teléfono", "correo", "asistencia"])
  ) {
    return "Puedes contactarnos a través de nuestro formulario de contacto o enviando un correo a soporte."
  }

  // Proceso de compra
  if (incluyeAlguna(frasesProcesoCompra)) {
    return "Para comprar una zapatilla:\n1) Ingresá a la pestaña de productos\n2) Elegí el modelo y talle\n3) Hacé clic en 'Agregar al carrito'\n4) Desde el carrito, revisá tus productos y hacé clic en 'Finalizar compra'\n5) Ingresá tus datos de envío y forma de pago\n6) Confirmá la compra\n¡Listo!"
  }

  return "Lo siento, no entendí tu mensaje. ¿Podés reformularlo?"
}

const chatbotSlice = createSlice({
  name: "chatbot",
  initialState,
  reducers: {
    toggleChat: (state) => {
      state.mostrar = !state.mostrar
    },
    openChat: (state) => {
      state.mostrar = true
    },
    closeChat: (state) => {
      state.mostrar = false
    },
    setEntrada: (state, action) => {
      state.entrada = action.payload
    },
    clearEntrada: (state) => {
      state.entrada = ""
    },
    addMensaje: (state, action) => {
      state.mensajes.push(action.payload)
    },
    addMensajes: (state, action) => {
      state.mensajes.push(...action.payload)
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    resetChat: (state) => {
      state.mensajes = [{ autor: "bot", texto: "¡Hola! ¿En qué puedo ayudarte hoy?" }]
      state.entrada = ""
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(enviarMensajeThunk.pending, (state) => {
        state.isLoading = true
        state.entrada = ""
      })
      .addCase(enviarMensajeThunk.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload) {
          state.mensajes.push(...action.payload)
        }
      })
      .addCase(enviarMensajeThunk.rejected, (state) => {
        state.isLoading = false
        state.mensajes.push({
          autor: "bot",
          texto: "Lo siento, hubo un error. Por favor intenta nuevamente.",
        })
      })
  },
})

export const {
  toggleChat,
  openChat,
  closeChat,
  setEntrada,
  clearEntrada,
  addMensaje,
  addMensajes,
  setLoading,
  resetChat,
} = chatbotSlice.actions

export default chatbotSlice.reducer
