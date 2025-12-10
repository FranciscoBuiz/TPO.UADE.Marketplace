"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import {
  realizarCompra,
  limpiarError,
  resetCompraExitosa,
  establecerCompraRealizada,
  limpiarCheckout,
  retrocederPaso,
} from "../../store/slices/compraSlice"
import "./ConfirmacionCompra.css"
import { obtenerImgPorStockId } from "../../store/slices/productosSlice"

const ConfirmacionCompra = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { usuario } = useSelector((state) => state.auth)
  const { carrito } = useSelector((state) => state.carrito)
  const {
    cargando: procesandoCompra,
    error,
    compraCreadaExitosamente,
    compraActual,
    datosEnvio,
    datosPago,
    compraRealizada,
    numeroCompra,
  } = useSelector((state) => state.compra)

  const { imagenesPorStockId } = useSelector((state) => state.productos)

  useEffect(() => {
    if (!compraRealizada) {
      dispatch(limpiarError())
      dispatch(resetCompraExitosa())
    }

    // Si ya se realizó la compra, NO redirigir nunca
    if (compraRealizada) {
      return
    }

    // Solo redirigir si NO se ha realizado la compra Y faltan datos
    if (!datosEnvio.email || !datosEnvio.nombre) {
      navigate("/carrito")
      return
    }

    // Si no hay carrito pero tenemos datos de envío, permitir continuar
    // (el carrito puede haberse vaciado después de una compra exitosa)
    if (!carrito?.items || carrito.items.length === 0) {
      // Solo redirigir si tampoco tenemos datos de pago
      if (!datosPago.metodoPago) {
        navigate("/carrito")
        return
      }
    }
  }, [navigate, dispatch, compraRealizada, datosEnvio, datosPago, carrito])

  useEffect(() => {
    if (compraCreadaExitosamente && compraActual && !compraRealizada) {
      dispatch(
        establecerCompraRealizada({
          numeroCompra: compraActual.id || `URB-${Date.now()}`,
        }),
      )
    }
  }, [compraCreadaExitosamente, compraActual, compraRealizada, dispatch])

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

  const calcularTotal = () => {
    if (!carrito?.items || carrito.items.length === 0) return 0

    return carrito.items.reduce((total, item) => {
      const precio = Number.parseFloat(item.precio || item.precioUnitario || 0) || 0
      const cantidad = Number.parseInt(item.cantidad || 1) || 1
      return total + precio * cantidad
    }, 0)
  }

  const confirmarCompra = async () => {
    try {
      dispatch(limpiarError())
      const resultado = await dispatch(realizarCompra(usuario.id)).unwrap()
      // NO vaciar el carrito aquí - el backend ya lo hace
      // El carrito se vaciará automáticamente cuando se actualice el estado de Redux
    } catch (error) {
      console.error("=== ERROR EN COMPRA ===", error)
      // Mostrar error al usuario
      alert("Error al procesar la compra: " + (error.mensaje || error.message || "Error desconocido"))
    }
  }

  const volverAlPago = () => {
    dispatch(retrocederPaso())
    navigate("/checkout/pago")
  }

  const irAInicio = () => {
    dispatch(limpiarCheckout())
    setTimeout(() => {
      navigate("/")
    }, 100)
  }

  const irAMisPedidos = () => {
    dispatch(limpiarCheckout())
    setTimeout(() => {
      navigate("/perfil?tab=historial")
    }, 100)
  }

  // Si la compra fue realizada, mostrar pantalla de éxito
  if (compraRealizada) {
    return (
      <div className="checkout-container">
        <div className="confirmacion-exitosa">
          <div className="exito-header">
            <div className="exito-icon">✅</div>
            <h1>¡Compra Realizada con Éxito!</h1>
            <p>Tu pedido ha sido confirmado y está siendo procesado</p>
            <div className="numero-compra">
              <strong>Número de Pedido: {numeroCompra}</strong>
            </div>
          </div>

          <div className="exito-contenido">
            <div className="info-envio-exitosa">
              <h3>📦 Información de Envío</h3>
              <div className="destinatario">
                <p>
                  <strong>Destinatario:</strong> {datosEnvio?.nombre} {datosEnvio?.apellido}
                </p>
                <p>
                  <strong>Email:</strong> {datosEnvio?.email}
                </p>
                <p>
                  <strong>Teléfono:</strong> {datosEnvio?.telefono}
                </p>
                <p>
                  <strong>Dirección:</strong> {datosEnvio?.calle} {datosEnvio?.numero}
                </p>
                <p>
                  <strong>Ciudad:</strong> {datosEnvio?.localidad}, {datosEnvio?.provincia}
                </p>
              </div>
            </div>

            <div className="exito-info">
              <h3>¿Qué sigue ahora?</h3>
              <ul>
                <li>✓ Recibirás un email de confirmación en {datosEnvio?.email}</li>
                <li>✓ Te contactaremos por teléfono al {datosEnvio?.telefono} para coordinar la entrega</li>
                <li>✓ El envío llegará a la dirección proporcionada en 3-5 días hábiles</li>
                <li>✓ Puedes seguir el estado de tu pedido en tu perfil</li>
              </ul>
            </div>

            <div className="exito-acciones">
              <button onClick={irAMisPedidos} className="btn-primary">
                Ver Mis Pedidos
              </button>
              <button onClick={irAInicio} className="btn-secondary">
                Volver al Inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!datosEnvio.email) {
    return (
      <div className="checkout-container">
        <div className="loading">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Confirmar Compra</h1>
        <div className="checkout-steps">
          <div className="step completed">
            <div className="step-number">✓</div>
            <div className="step-label">INFORMACIÓN</div>
          </div>
          <div className="step completed">
            <div className="step-number">✓</div>
            <div className="step-label">PAGO</div>
          </div>
          <div className="step active">
            <div className="step-number">3</div>
            <div className="step-label">CONFIRMACIÓN</div>
          </div>
        </div>
      </div>

      <div className="checkout-content">
        <div className="confirmacion-section">
          {error && <div className="error-message">{error}</div>}

          <div className="confirmacion-card">
            <h2>Información de Envío</h2>
            <div className="info-grid">
              <div className="info-item">
                <strong>Nombre:</strong> {datosEnvio.nombre} {datosEnvio.apellido}
              </div>
              <div className="info-item">
                <strong>Email:</strong> {datosEnvio.email}
              </div>
              <div className="info-item">
                <strong>Teléfono:</strong> {datosEnvio.telefono}
              </div>
              <div className="info-item">
                <strong>Dirección:</strong> {datosEnvio.calle} {datosEnvio.numero}
                {datosEnvio.piso && `, Piso ${datosEnvio.piso}`}
                {datosEnvio.departamento && `, Depto ${datosEnvio.departamento}`}
              </div>
              <div className="info-item">
                <strong>Ciudad:</strong> {datosEnvio.localidad}, {datosEnvio.provincia}
              </div>
              <div className="info-item">
                <strong>Código Postal:</strong> {datosEnvio.codigoPostal}
              </div>
            </div>
          </div>

          <div className="confirmacion-card">
            <h2>Método de Pago</h2>
            <div className="pago-info">
              {datosPago?.metodoPago === "tarjeta" && (
                <div>
                  <p>
                    <strong>Tarjeta de Crédito/Débito</strong>
                  </p>
                  <p>**** **** **** {datosPago.datosTarjeta.numero?.slice(-4)}</p>
                  <p>{datosPago.datosTarjeta.nombre}</p>
                </div>
              )}
              {datosPago?.metodoPago === "transferencia" && (
                <div>
                  <p>
                    <strong>Transferencia Bancaria</strong>
                  </p>
                  <p>Recibirás los datos bancarios por email para realizar la transferencia</p>
                </div>
              )}
              {(datosPago?.metodoPago === "efectivo" || !datosPago?.metodoPago) && (
                <div>
                  <p>
                    <strong>Pago en Efectivo</strong>
                  </p>
                  <p>Pagarás al momento de la entrega</p>
                </div>
              )}
            </div>
          </div>

          <div className="confirmacion-card">
            <h2>Productos</h2>
            <div className="productos-confirmacion">
              {carrito.items.map((item, index) => (
                <div key={`${item.stockId}-${index}`} className="producto-confirmacion">
                  <div className="producto-imagen">
                    <img
                      src={imagenesPorStockId[item.stockId || item.productoId] || "/placeholder.svg?height=80&width=80"}
                      alt={item.nombreZapatilla}
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=80&width=80"
                      }}
                    />
                  </div>
                  <div className="producto-info">
                    <h4>{item.nombreZapatilla}</h4>
                    <p>Marca: {item.marca}</p>
                    <p>Talle: {item.talle}</p>
                    <p>Cantidad: {item.cantidad}</p>
                  </div>
                  <div className="producto-precio">
                    <span>
                      $
                      {(
                        (Number.parseFloat(item.precio || item.precioUnitario || 0) || 0) *
                        (Number.parseInt(item.cantidad || 1) || 1)
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={volverAlPago} className="btn-secondary" disabled={procesandoCompra}>
              Volver al Pago
            </button>
            <button onClick={confirmarCompra} className="btn-primary" disabled={procesandoCompra}>
              {procesandoCompra ? "Procesando Compra..." : "Confirmar Compra"}
            </button>
          </div>
        </div>

        <div className="checkout-summary">
          <div className="summary-card">
            <h3>Resumen Final</h3>
            <div className="summary-items">
              {carrito.items.map((item, index) => {
                const precio = Number.parseFloat(item.precio || item.precioUnitario || 0) || 0
                const cantidad = Number.parseInt(item.cantidad || 1) || 1
                const subtotal = precio * cantidad

                return (
                  <div key={`summary-${item.stockId}-${index}`} className="summary-item">
                    <div className="item-info">
                      <span className="item-name">{item.nombreZapatilla || "Producto"}</span>
                      <span className="item-details">
                        Talle {item.talle} × {cantidad}
                      </span>
                    </div>
                    <span className="item-price">${subtotal.toLocaleString()}</span>
                  </div>
                )
              })}
            </div>

            <div className="summary-totals">
              <div className="summary-line">
                <span>Subtotal:</span>
                <span>${calcularTotal().toLocaleString()}</span>
              </div>
              <div className="summary-line">
                <span>Envío:</span>
                <span>Gratis</span>
              </div>
              <div className="summary-line total">
                <span>Total a Pagar:</span>
                <span>${calcularTotal().toLocaleString()}</span>
              </div>
            </div>

            <div className="garantia-info">
              <h4>Garantías</h4>
              <ul>
                <li>✅ Envío gratis</li>
                <li>✅ 30 días para cambios</li>
                <li>✅ Garantía de calidad</li>
                <li>✅ Soporte 24/7</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmacionCompra
