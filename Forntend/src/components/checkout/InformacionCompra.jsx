"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import {
  actualizarDatosEnvio,
  establecerErroresFormulario,
  limpiarErrorFormulario,
  avanzarPaso,
  inicializarConUsuario,
} from "../../store/slices/compraSlice"
import "./InformacionCompra.css"
import ChatBotWidget from "../chatbot/ChatBotWidget"
import { obtenerImgPorStockId } from "../../store/slices/productosSlice"

const InformacionCompra = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { usuario } = useSelector((state) => state.auth)
  const { carrito } = useSelector((state) => state.carrito)
  const { datosEnvio, erroresFormulario } = useSelector((state) => state.compra)
  const { imagenesPorStockId } = useSelector((state) => state.productos)
  const provinciasArgentinas = [
    "Buenos Aires",
    "Catamarca",
    "Chaco",
    "Chubut",
    "Córdoba",
    "Corrientes",
    "Entre Ríos",
    "Formosa",
    "Jujuy",
    "La Pampa",
    "La Rioja",
    "Mendoza",
    "Misiones",
    "Neuquén",
    "Río Negro",
    "Salta",
    "San Juan",
    "San Luis",
    "Santa Cruz",
    "Santa Fe",
    "Santiago del Estero",
    "Tierra del Fuego",
    "Tucumán",
    "Ciudad Autónoma de Buenos Aires",
  ]

  useEffect(() => {
    // Inicializar con datos del usuario si está disponible
    if (usuario?.email && !datosEnvio.email) {
      dispatch(inicializarConUsuario(usuario))
    }
  }, [usuario, datosEnvio.email, dispatch])

  const obtenerPrecioTotal = () => {
    if (!carrito?.items) return 0
    return carrito.items.reduce((total, item) => {
      const precio = Number.parseFloat(item.precio || item.precioUnitario || 0) || 0
      const cantidad = Number.parseInt(item.cantidad || 1) || 1
      return total + precio * cantidad
    }, 0)
  }

  const validarFormulario = () => {
    const nuevosErrores = {}

    if (!datosEnvio.email.trim()) nuevosErrores.email = "Email es requerido"
    if (!datosEnvio.nombre.trim()) nuevosErrores.nombre = "Nombre es requerido"
    if (!datosEnvio.apellido.trim()) nuevosErrores.apellido = "Apellido es requerido"
    if (!datosEnvio.telefono.trim()) nuevosErrores.telefono = "Teléfono es requerido"
    if (!datosEnvio.dni.trim()) nuevosErrores.dni = "DNI es requerido"
    if (!datosEnvio.calle.trim()) nuevosErrores.calle = "Calle es requerida"
    if (!datosEnvio.numero.trim()) nuevosErrores.numero = "Número es requerido"
    if (!datosEnvio.codigoPostal.trim()) nuevosErrores.codigoPostal = "Código postal es requerido"
    if (!datosEnvio.provincia) nuevosErrores.provincia = "Provincia es requerida"
    if (!datosEnvio.localidad.trim()) nuevosErrores.localidad = "Localidad es requerida"

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (datosEnvio.email && !emailRegex.test(datosEnvio.email)) {
      nuevosErrores.email = "Email inválido"
    }

    if (datosEnvio.dni && (datosEnvio.dni.length < 7 || datosEnvio.dni.length > 8)) {
      nuevosErrores.dni = "DNI debe tener entre 7 y 8 dígitos"
    }

    if (datosEnvio.telefono && datosEnvio.telefono.length < 10) {
      nuevosErrores.telefono = "Teléfono debe tener al menos 10 dígitos"
    }

    dispatch(establecerErroresFormulario(nuevosErrores))
    return Object.keys(nuevosErrores).length === 0
  }

  const manejarCambio = (e) => {
    const { name, value } = e.target
    dispatch(actualizarDatosEnvio({ [name]: value }))

    if (erroresFormulario[name]) {
      dispatch(limpiarErrorFormulario(name))
    }
  }

  const manejarSiguiente = (e) => {
    e.preventDefault()

    if (validarFormulario()) {
      dispatch(avanzarPaso())
      navigate("/checkout/pago")
    }
  }

  if (!carrito || !carrito.items || carrito.items.length === 0) {
    return (
      <div className="checkout-container">
        <div className="checkout-empty">
          <h2>No hay productos en el carrito</h2>
          <p>Agrega algunos productos antes de continuar con la compra</p>
          <button onClick={() => navigate("/productos")} className="btn-primary">
            Ver Productos
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Información de Compra</h1>
        <div className="checkout-steps">
          <div className="step active">
            <div className="step-number">1</div>
            <div className="step-label">INFORMACIÓN</div>
          </div>
          <div className="step">
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
        <div className="checkout-form">
          <form onSubmit={manejarSiguiente}>
            <div className="form-section">
              <h3>Información de Contacto</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={datosEnvio.email}
                    onChange={manejarCambio}
                    className={erroresFormulario.email ? "error" : ""}
                  />
                  {erroresFormulario.email && <span className="error-text">{erroresFormulario.email}</span>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Información Personal</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre *</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={datosEnvio.nombre}
                    onChange={manejarCambio}
                    className={erroresFormulario.nombre ? "error" : ""}
                  />
                  {erroresFormulario.nombre && <span className="error-text">{erroresFormulario.nombre}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="apellido">Apellido *</label>
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={datosEnvio.apellido}
                    onChange={manejarCambio}
                    className={erroresFormulario.apellido ? "error" : ""}
                  />
                  {erroresFormulario.apellido && <span className="error-text">{erroresFormulario.apellido}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="telefono">Teléfono *</label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={datosEnvio.telefono}
                    onChange={manejarCambio}
                    placeholder="11 1234 5678"
                    className={erroresFormulario.telefono ? "error" : ""}
                  />
                  {erroresFormulario.telefono && <span className="error-text">{erroresFormulario.telefono}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="dni">DNI *</label>
                  <input
                    type="text"
                    id="dni"
                    name="dni"
                    value={datosEnvio.dni}
                    onChange={manejarCambio}
                    placeholder="12345678"
                    className={erroresFormulario.dni ? "error" : ""}
                  />
                  {erroresFormulario.dni && <span className="error-text">{erroresFormulario.dni}</span>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Dirección de Envío</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="calle">Calle *</label>
                  <input
                    type="text"
                    id="calle"
                    name="calle"
                    value={datosEnvio.calle}
                    onChange={manejarCambio}
                    className={erroresFormulario.calle ? "error" : ""}
                  />
                  {erroresFormulario.calle && <span className="error-text">{erroresFormulario.calle}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="numero">Número *</label>
                  <input
                    type="text"
                    id="numero"
                    name="numero"
                    value={datosEnvio.numero}
                    onChange={manejarCambio}
                    className={erroresFormulario.numero ? "error" : ""}
                  />
                  {erroresFormulario.numero && <span className="error-text">{erroresFormulario.numero}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="piso">Piso</label>
                  <input type="text" id="piso" name="piso" value={datosEnvio.piso} onChange={manejarCambio} />
                </div>
                <div className="form-group">
                  <label htmlFor="departamento">Departamento</label>
                  <input
                    type="text"
                    id="departamento"
                    name="departamento"
                    value={datosEnvio.departamento}
                    onChange={manejarCambio}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="codigoPostal">Código Postal *</label>
                  <input
                    type="text"
                    id="codigoPostal"
                    name="codigoPostal"
                    value={datosEnvio.codigoPostal}
                    onChange={manejarCambio}
                    className={erroresFormulario.codigoPostal ? "error" : ""}
                  />
                  {erroresFormulario.codigoPostal && (
                    <span className="error-text">{erroresFormulario.codigoPostal}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="provincia">Provincia *</label>
                  <select
                    id="provincia"
                    name="provincia"
                    value={datosEnvio.provincia}
                    onChange={manejarCambio}
                    className={erroresFormulario.provincia ? "error" : ""}
                  >
                    <option value="">Seleccionar provincia</option>
                    {provinciasArgentinas.map((provincia) => (
                      <option key={provincia} value={provincia}>
                        {provincia}
                      </option>
                    ))}
                  </select>
                  {erroresFormulario.provincia && <span className="error-text">{erroresFormulario.provincia}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="localidad">Localidad *</label>
                  <input
                    type="text"
                    id="localidad"
                    name="localidad"
                    value={datosEnvio.localidad}
                    onChange={manejarCambio}
                    className={erroresFormulario.localidad ? "error" : ""}
                  />
                  {erroresFormulario.localidad && <span className="error-text">{erroresFormulario.localidad}</span>}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => navigate("/carrito")} className="btn-secondary">
                Volver al Carrito
              </button>
              <button type="submit" className="btn-primary">
                Continuar al Pago
              </button>
            </div>
          </form>
        </div>

        <div className="checkout-summary">
          <h3>Resumen del Pedido</h3>
          <div className="summary-items">
            {carrito.items.map((item, index) => (
              <div key={index} className="summary-item">
                <img
                  src={imagenesPorStockId[item.stockId || item.productoId] || `/placeholder.svg?height=60&width=60&query=${item.nombre}`}
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

export default InformacionCompra
