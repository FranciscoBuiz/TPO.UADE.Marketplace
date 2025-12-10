"use client"

import { useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { toggleChat, closeChat, setEntrada, enviarMensajeThunk } from "../../store/slices/chatbotSlice"
import "./ChatBotWidget.css"

const ChatBotWidget = () => {
  const dispatch = useDispatch()
  const { mostrar, mensajes, entrada, isLoading } = useSelector((state) => state.chatbot)

  const inputRef = useRef(null)
  const contenedorMensajesRef = useRef(null)

  const handleToggleChat = () => {
    dispatch(toggleChat())


    if (!mostrar) {
      document.body.classList.add("body-no-scroll")
    } else {
      document.body.classList.remove("body-no-scroll")
    }
  }

  const handleCloseChat = () => {
    dispatch(closeChat())
    document.body.classList.remove("body-no-scroll")
  }

  
  useEffect(() => {
    return () => {
      document.body.classList.remove("body-no-scroll")
    }
  }, [])

  useEffect(() => {
    if (mostrar && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 300)
    }
  }, [mostrar])

  useEffect(() => {
    if (contenedorMensajesRef.current) {
      contenedorMensajesRef.current.scrollTop = contenedorMensajesRef.current.scrollHeight
    }
  }, [mensajes])

  const handleEnviarMensaje = (e) => {
    e.preventDefault()
    if (!entrada.trim() || isLoading) return

    dispatch(enviarMensajeThunk(entrada))
  }

  const handleInputChange = (e) => {
    dispatch(setEntrada(e.target.value))
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseChat()
    }
  }

  return (
    <div className="chatbot-widget">
      {/* Toggle Button */}
      <button
        onClick={handleToggleChat}
        className="chatbot-toggle-btn"
        aria-label={mostrar ? "Cerrar chat" : "Abrir chat"}
      >
        💬
      </button>

      {/* Modal Overlay */}
      <div className={`chatbot-modal-overlay ${mostrar ? "show" : ""}`} onClick={handleOverlayClick}>
        {/* Modal */}
        <div className={`chatbot-modal ${mostrar ? "show" : ""}`}>
          {/* Header */}
          <div className="chatbot-header">
            <h3 className="chatbot-title">Urbanbot 🤖</h3>
            <button onClick={handleCloseChat} className="chatbot-close-btn" aria-label="Cerrar chat">
              ×
            </button>
          </div>

          {/* Body */}
          <div className="chatbot-body">
            {/* Messages */}
            <div className="chatbot-mensajes" ref={contenedorMensajesRef} aria-live="polite" aria-relevant="additions">
              {mensajes.map((msg, idx) => (
                <div key={idx} className={`mensaje ${msg.autor}`}>
                  <div className="contenido">{msg.texto}</div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="mensaje bot">
                  <div className="contenido">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleEnviarMensaje} className="chatbot-form">
              <input
                ref={inputRef}
                type="text"
                value={entrada}
                onChange={handleInputChange}
                placeholder="Escribe tu mensaje..."
                className="chatbot-input"
                autoComplete="off"
                aria-label="Campo de entrada de mensaje"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="chatbot-send-btn"
                disabled={!entrada.trim() || isLoading}
                aria-label="Enviar mensaje"
              >
                ➤
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatBotWidget
