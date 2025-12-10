"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  actualizarFormData,
  enviarFormularioContacto,
  establecerMensaje,
  limpiarMensaje,
  toggleFaq,
} from "../../store/slices/contactoSlice"
import "./Contacto.css"
import ChatBotWidget from "../chatbot/ChatBotWidget"

const Contacto = () => {
  const dispatch = useDispatch()


  const { formData, enviando, mensaje, faqAbierto } = useSelector((state) => state.contacto)


  useEffect(() => {
    if (mensaje.texto && mensaje.tipo === "success") {
      const timer = setTimeout(() => {
        dispatch(limpiarMensaje())
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [mensaje, dispatch])

  const manejarCambio = (e) => {
    dispatch(
      actualizarFormData({
        [e.target.name]: e.target.value,
      }),
    )
  }

  const manejarEnvio = async (e) => {
    e.preventDefault()


    if (!formData.nombre.trim() || !formData.email.trim() || !formData.asunto || !formData.mensaje.trim()) {
      dispatch(
        establecerMensaje({
          tipo: "error",
          texto: "Por favor, completa todos los campos obligatorios.",
        }),
      )
      return
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      dispatch(
        establecerMensaje({
          tipo: "error",
          texto: "Por favor, ingresa un email válido.",
        }),
      )
      return
    }


    dispatch(enviarFormularioContacto(formData))
  }

  const manejarToggleFaq = (index) => {
    dispatch(toggleFaq(index))
  }

  const preguntasFrecuentes = [
    {
      pregunta: "¿Cuál es el tiempo de entrega?",
      respuesta:
        "El tiempo de entrega estándar es de 3-5 días hábiles para CABA y GBA. Para el interior del país, puede tomar entre 5-10 días hábiles dependiendo de la ubicación.",
    },
    {
      pregunta: "¿Puedo cambiar o devolver un producto?",
      respuesta:
        "Sí, aceptamos cambios y devoluciones dentro de los 30 días posteriores a la compra. El producto debe estar en perfectas condiciones y con su embalaje original.",
    },
    {
      pregunta: "¿Qué métodos de pago aceptan?",
      respuesta:
        "Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), transferencias bancarias, MercadoPago y efectivo en nuestra tienda física.",
    },
    {
      pregunta: "¿Tienen garantía los productos?",
      respuesta:
        "Todos nuestros productos tienen garantía del fabricante. Las zapatillas deportivas tienen 6 meses de garantía por defectos de fabricación.",
    },
    {
      pregunta: "¿Puedo retirar mi pedido en la tienda?",
      respuesta:
        "Sí, ofrecemos la opción de retiro en tienda sin costo adicional. Te notificaremos cuando tu pedido esté listo para retirar.",
    },
    {
      pregunta: "¿Hacen envíos al interior del país?",
      respuesta:
        "Sí, realizamos envíos a todo el país a través de correo argentino y empresas de transporte. Los costos varían según el destino y el peso del paquete.",
    },
  ]

  return (
    <div className="container contact-container">
      {/* Header */}
      <div className="contact-header">
        <h1 className="contact-title">Contáctanos</h1>
        <p className="contact-subtitle">
          ¿Tienes alguna pregunta o necesitas ayuda? Estamos aquí para ayudarte. Contáctanos a través de cualquiera de
          nuestros canales de comunicación.
        </p>
      </div>

      {/* Contenido principal */}
      <div className="contact-content">
        {/* Información de contacto */}
        <div className="contact-info">
          <h3>Información de Contacto</h3>

          <div className="contact-item">
            <svg className="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div className="contact-details">
              <h4>Dirección</h4>
              <p>
                Av. Corrientes 1234
                <br />
                Buenos Aires, Argentina
                <br />
                C1043AAZ
              </p>
            </div>
          </div>

          <div className="contact-item">
            <svg className="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <div className="contact-details">
              <h4>Teléfono</h4>
              <p>
                +54 11 1234-5678
                <br />
                Lunes a Viernes: 9:00 - 18:00
                <br />
                Sábados: 9:00 - 14:00
              </p>
            </div>
          </div>

          <div className="contact-item">
            <svg className="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <div className="contact-details">
              <h4>Email</h4>
              <p>
                info@zapatillasstore.com
                <br />
                ventas@zapatillasstore.com
                <br />
                soporte@zapatillasstore.com
              </p>
            </div>
          </div>

          <div className="contact-item">
            <svg className="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <div className="contact-details">
              <h4>WhatsApp</h4>
              <p>
                +54 9 11 1234-5678
                <br />
                Atención inmediata
                <br />
                24/7 disponible
              </p>
            </div>
          </div>
        </div>

        {/* Formulario de contacto */}
        <div className="contact-form">
          <h3>Envíanos un Mensaje</h3>

          {mensaje.texto && (
            <div className={mensaje.tipo === "success" ? "success-message" : "error-message"}>{mensaje.texto}</div>
          )}

          <form onSubmit={manejarEnvio}>
            <div className="form-group">
              <label className="form-label">Nombre completo *</label>
              <input
                type="text"
                name="nombre"
                className="form-input"
                value={formData.nombre}
                onChange={manejarCambio}
                required
                placeholder="Tu nombre completo"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={manejarCambio}
                required
                placeholder="tu@email.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                className="form-input"
                value={formData.telefono}
                onChange={manejarCambio}
                placeholder="+54 11 1234-5678"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Asunto *</label>
              <select name="asunto" className="form-input" value={formData.asunto} onChange={manejarCambio} required>
                <option value="">Selecciona un asunto</option>
                <option value="consulta-producto">Consulta sobre producto</option>
                <option value="problema-pedido">Problema con mi pedido</option>
                <option value="cambio-devolucion">Cambio o devolución</option>
                <option value="garantia">Garantía</option>
                <option value="sugerencia">Sugerencia</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Mensaje *</label>
              <textarea
                name="mensaje"
                className="form-textarea"
                value={formData.mensaje}
                onChange={manejarCambio}
                required
                placeholder="Escribe tu mensaje aquí..."
                rows="5"
              />
            </div>

            <button type="submit" className="submit-btn" disabled={enviando}>
              {enviando ? (
                <>
                  <svg className="spinner" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray="32"
                      strokeDashoffset="32"
                    >
                      <animate
                        attributeName="stroke-dasharray"
                        dur="2s"
                        values="0 32;16 16;0 32;0 32"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="stroke-dashoffset"
                        dur="2s"
                        values="0;-16;-32;-32"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </svg>
                  Enviando...
                </>
              ) : (
                "Enviar Mensaje"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Preguntas Frecuentes */}
      <div className="faq-section">
        <h3>Preguntas Frecuentes</h3>
        <div className="faq-container">
          {preguntasFrecuentes.map((faq, index) => (
            <div key={index} className="faq-item">
              <button
                className={`faq-question ${faqAbierto === index ? "active" : ""}`}
                onClick={() => manejarToggleFaq(index)}
              >
                <span>{faq.pregunta}</span>
                <svg
                  className={`faq-icon ${faqAbierto === index ? "rotated" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`faq-answer ${faqAbierto === index ? "open" : ""}`}>
                <p>{faq.respuesta}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <br />

      {/* Mapa */}
      <div className="map-section">
        <h3>Nuestra Ubicación</h3>
        <div className="map-container">
          <div className="map-info">
            <h4>📍 UrbanStride</h4>
            <p>Av. Corrientes 1234, Buenos Aires</p>
            <p><br /></p>
            <div className="map-actions">
              <a
                href="https://maps.google.com/?q=Av.+Corrientes+1234,+Buenos+Aires"
                target="_blank"
                rel="noopener noreferrer"
                className="map-btn1"
              >
                Ver en Google Maps
              </a>
            </div>
          </div>
          <div className="map-placeholder">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0168903618447!2d-58.38375908477033!3d-34.60373998045853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccacb9f8ff113%3A0x22fd08da6711928d!2sAv.+Corrientes+1234%2C+C1043AAZ+CABA!5e0!3m2!1ses!2sar!4v1234567890123"
              width="100%"
              height="300"
              style={{ border: 0, borderRadius: "12px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de Zapatillas Store"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Horarios */}
      <div className="hours-section">
        <h3>Horarios de Atención</h3>
        <div className="hours-grid">
          <div className="hours-item">
            <div className="hours-icon">🏪</div>
            <h4>Tienda Física</h4>
            <p>
              Lun - Vie: 9:00 - 20:00
              <br />
              Sáb: 9:00 - 18:00
              <br />
              Dom: 10:00 - 16:00
            </p>
          </div>
          <div className="hours-item">
            <div className="hours-icon">📞</div>
            <h4>Atención Telefónica</h4>
            <p>
              Lun - Vie: 8:00 - 22:00
              <br />
              Sáb: 9:00 - 20:00
              <br />
              Dom: 10:00 - 18:00
            </p>
          </div>
          <div className="hours-item">
            <div className="hours-icon">💬</div>
            <h4>Soporte Online</h4>
            <p>
              24/7 disponible
              <br />
              Respuesta en menos
              <br />
              de 2 horas
            </p>
          </div>
        </div>
      </div>
      <ChatBotWidget />
    </div>
  )
}

export default Contacto
