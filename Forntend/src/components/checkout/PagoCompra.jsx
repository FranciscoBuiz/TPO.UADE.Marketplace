"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import {
  establecerMetodoPago,
  actualizarDatosTarjeta,
  establecerErroresFormulario,
  limpiarErrorFormulario,
  avanzarPaso,
  retrocederPaso,
  iniciarProcesoPago,
  finalizarProcesoPago,
} from "../../store/slices/compraSlice"
import "./PagoCompra.css"
import ChatBotWidget from "../chatbot/ChatBotWidget"
import { obtenerImgPorStockId } from "../../store/slices/productosSlice"


const PagoCompra = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { usuario } = useSelector((state) => state.auth)
  const { carrito } = useSelector((state) => state.carrito)
  const { datosEnvio, datosPago, erroresFormulario, procesandoPago } = useSelector((state) => state.compra)

  const obtenerPrecioTotal = () => {
    if (!carrito?.items) return 0
    return carrito.items.reduce((total, item) => {
      const precio = Number.parseFloat(item.precio || item.precioUnitario || 0) || 0
      const cantidad = Number.parseInt(item.cantidad || 1) || 1
      return total + precio * cantidad
    }, 0)
  }
  const { imagenesPorStockId } = useSelector((state) => state.productos)
  

  useEffect(() => {
    if (!datosEnvio.email || !datosEnvio.nombre) {
      navigate("/checkout/informacion")
      return
    }
  }, [datosEnvio, navigate])

  // Cargar imágenes de los productos
  useEffect(() => {
    if (carrito?.items && carrito.items.length > 0) {
      const stockIds = carrito.items.map((item) => item.stockId || item.productoId).filter(Boolean)

      // Cargar imágenes para cada producto
      stockIds.forEach((stockId) => {
        dispatch(obtenerImgPorStockId(stockId))
      })
    }
  }, [carrito?.items, dispatch])

  const validarTarjeta = () => {
    const nuevosErrores = {}

    if (!datosPago.datosTarjeta.numero.trim()) {
      nuevosErrores.numero = "Número de tarjeta es requerido"
    } else if (datosPago.datosTarjeta.numero.replace(/\s/g, "").length !== 16) {
      nuevosErrores.numero = "Número de tarjeta debe tener 16 dígitos"
    }

    if (!datosPago.datosTarjeta.nombre.trim()) {
      nuevosErrores.nombre = "Nombre del titular es requerido"
    }

    if (!datosPago.datosTarjeta.vencimiento.trim()) {
      nuevosErrores.vencimiento = "Fecha de vencimiento es requerida"
    } else if (!/^\d{2}\/\d{2}$/.test(datosPago.datosTarjeta.vencimiento)) {
      nuevosErrores.vencimiento = "Formato inválido (MM/AA)"
    }

    if (!datosPago.datosTarjeta.cvv.trim()) {
      nuevosErrores.cvv = "CVV es requerido"
    } else if (datosPago.datosTarjeta.cvv.length !== 3) {
      nuevosErrores.cvv = "CVV debe tener 3 dígitos"
    }

    dispatch(establecerErroresFormulario(nuevosErrores))
    return Object.keys(nuevosErrores).length === 0
  }

  const formatearNumeroTarjeta = (valor) => {
    const soloNumeros = valor.replace(/\D/g, "")
    return soloNumeros.replace(/(\d{4})(?=\d)/g, "$1 ").substring(0, 19)
  }

  const formatearVencimiento = (valor) => {
    const soloNumeros = valor.replace(/\D/g, "")
    if (soloNumeros.length >= 2) {
      return soloNumeros.substring(0, 2) + "/" + soloNumeros.substring(2, 4)
    }
    return soloNumeros
  }

  const manejarCambioTarjeta = (e) => {
    const { name, value } = e.target
    let valorFormateado = value

    if (name === "numero") {
      valorFormateado = formatearNumeroTarjeta(value)
    } else if (name === "vencimiento") {
      valorFormateado = formatearVencimiento(value)
    } else if (name === "cvv") {
      valorFormateado = value.replace(/\D/g, "").substring(0, 3)
    } else if (name === "nombre") {
      valorFormateado = value.toUpperCase()
    }

    dispatch(actualizarDatosTarjeta({ [name]: valorFormateado }))

    if (erroresFormulario[name]) {
      dispatch(limpiarErrorFormulario(name))
    }
  }

  const manejarFinalizarCompra = async () => {
    if (datosPago.metodoPago === "tarjeta" && !validarTarjeta()) {
      return
    }

    dispatch(iniciarProcesoPago())

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      dispatch(avanzarPaso())
      navigate("/checkout/confirmacion")
    } catch (error) {
      alert("Error al procesar el pago. Intenta nuevamente.")
    } finally {
      dispatch(finalizarProcesoPago())
    }
  }

  if (!datosEnvio.email || !carrito) {
    return (
      <div className="checkout-container">
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Método de Pago</h1>
        <div className="checkout-steps">
          <div className="step completed">
            <div className="step-number">✓</div>
            <div className="step-label">INFORMACIÓN</div>
          </div>
          <div className="step active">
            <div className="step-number">2</div>
            <div className="step-label">PAGO</div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-label">CONFIRMACIÓN</div>
          </div>
        </div>
      </div>

      <div className="checkout-content">
        <div className="payment-section">
          <div className="info-summary">
            <h3>Información de Envío</h3>
            <div className="info-card">
              <div className="info-row">
                <strong>
                  {datosEnvio.nombre} {datosEnvio.apellido}
                </strong>
              </div>
              <div className="info-row">{datosEnvio.email}</div>
              <div className="info-row">
                {datosEnvio.calle} {datosEnvio.numero}
                {datosEnvio.piso && `, Piso ${datosEnvio.piso}`}
                {datosEnvio.departamento && `, Depto ${datosEnvio.departamento}`}
              </div>
              <div className="info-row">
                {datosEnvio.localidad}, {datosEnvio.provincia} ({datosEnvio.codigoPostal})
              </div>
              <div className="info-row">
                Tel: {datosEnvio.telefono} | DNI: {datosEnvio.dni}
              </div>
            </div>
          </div>

          <div className="payment-methods">
            <h3>Método de Pago</h3>

            <div className="payment-options">
              <label className={`payment-option ${datosPago.metodoPago === "tarjeta" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="metodoPago"
                  value="tarjeta"
                  checked={datosPago.metodoPago === "tarjeta"}
                  onChange={(e) => dispatch(establecerMetodoPago(e.target.value))}
                />
                <div className="payment-option-content">
                  <span className="payment-icon">💳</span>
                  <span>Tarjeta de Crédito/Débito</span>
                </div>
              </label>

              <label className={`payment-option ${datosPago.metodoPago === "transferencia" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="metodoPago"
                  value="transferencia"
                  checked={datosPago.metodoPago === "transferencia"}
                  onChange={(e) => dispatch(establecerMetodoPago(e.target.value))}
                />
                <div className="payment-option-content">
                  <span className="payment-icon">🏦</span>
                  <span>Transferencia Bancaria</span>
                </div>
              </label>

              <label className={`payment-option ${datosPago.metodoPago === "efectivo" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="metodoPago"
                  value="efectivo"
                  checked={datosPago.metodoPago === "efectivo"}
                  onChange={(e) => dispatch(establecerMetodoPago(e.target.value))}
                />
                <div className="payment-option-content">
                  <span className="payment-icon">💵</span>
                  <span>Pago en Efectivo (Contra entrega)</span>
                </div>
              </label>
            </div>

            {datosPago.metodoPago === "tarjeta" && (
              <div className="card-form">
                <h4>Datos de la Tarjeta</h4>
                <div className="form-row">
                  <div className="form-group full-width">
                    <label htmlFor="numero">Número de Tarjeta *</label>
                    <input
                      type="text"
                      id="numero"
                      name="numero"
                      value={datosPago.datosTarjeta.numero}
                      onChange={manejarCambioTarjeta}
                      placeholder="1234 5678 9012 3456"
                      className={erroresFormulario.numero ? "error" : ""}
                      maxLength="19"
                    />
                    {erroresFormulario.numero && <span className="error-text">{erroresFormulario.numero}</span>}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre del Titular *</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={datosPago.datosTarjeta.nombre}
                      onChange={manejarCambioTarjeta}
                      placeholder="JUAN PEREZ"
                      className={erroresFormulario.nombre ? "error" : ""}
                    />
                    {erroresFormulario.nombre && <span className="error-text">{erroresFormulario.nombre}</span>}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="vencimiento">Vencimiento *</label>
                    <input
                      type="text"
                      id="vencimiento"
                      name="vencimiento"
                      value={datosPago.datosTarjeta.vencimiento}
                      onChange={manejarCambioTarjeta}
                      placeholder="MM/AA"
                      className={erroresFormulario.vencimiento ? "error" : ""}
                      maxLength="5"
                    />
                    {erroresFormulario.vencimiento && (
                      <span className="error-text">{erroresFormulario.vencimiento}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="cvv">CVV *</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={datosPago.datosTarjeta.cvv}
                      onChange={manejarCambioTarjeta}
                      placeholder="123"
                      className={erroresFormulario.cvv ? "error" : ""}
                      maxLength="3"
                    />
                    {erroresFormulario.cvv && <span className="error-text">{erroresFormulario.cvv}</span>}
                  </div>
                </div>
              </div>
            )}

            {datosPago.metodoPago === "transferencia" && (
              <div className="payment-info">
                <h4>Datos para Transferencia</h4>
                <div className="bank-info">
                  <p>
                    <strong>Banco:</strong> Banco Nación
                  </p>
                  <p>
                    <strong>CBU:</strong> 0110599520000001234567
                  </p>
                  <p>
                    <strong>Alias:</strong> URBANSTRIDE.SHOES
                  </p>
                  <p>
                    <strong>Titular:</strong> UrbanStride S.A.
                  </p>
                  <p className="note">Envía el comprobante por email después de realizar la transferencia</p>
                </div>
              </div>
            )}

            {datosPago.metodoPago === "efectivo" && (
              <div className="payment-info">
                <h4>Pago en Efectivo</h4>
                <div className="cash-info">
                  <p>💵 Pagarás en efectivo al momento de la entrega</p>
                  <p>📦 El repartidor llevará el cambio necesario</p>
                  <p>⏰ Tiempo de entrega: 3-5 días hábiles</p>
                </div>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => {
                dispatch(retrocederPaso())
                navigate("/checkout/informacion")
              }}
              className="btn-secondary"
            >
              Volver
            </button>
            <button onClick={manejarFinalizarCompra} className="btn-primary" disabled={procesandoPago}>
              {procesandoPago ? (
                <>
                  <span className="spinner-small"></span>
                  Procesando...
                </>
              ) : (
                "Finalizar Compra"
              )}
            </button>
          </div>
        </div>

        <div className="checkout-summary">
          <h3>Resumen del Pedido</h3>
          <div className="summary-items">
            {carrito.items.map((item, index) => (
              <div key={index} className="summary-item">
                <img
                  src={imagenesPorStockId[item.stockId || item.productoId] || "/placeholder.svg?height=80&width=80"}
                  alt={item.nombre}
                  className="summary-item-image"
                />
                <div className="summary-item-info">
                  <h4>{item.nombre}</h4>
                  <p>
                    Talle: {item.talle} | Cantidad: {item.cantidad}
                  </p>
                  <p className="summary-item-price">
                    $
                    {(
                      (Number.parseFloat(item.precio || item.precioUnitario || 0) || 0) *
                      (Number.parseInt(item.cantidad || 1) || 1)
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${obtenerPrecioTotal().toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Envío:</span>
              <span>Gratis</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${obtenerPrecioTotal().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
      <ChatBotWidget />
    </div>
  )
}

export default PagoCompra
