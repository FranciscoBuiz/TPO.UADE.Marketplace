"use client"

import { useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { agregarAlCarrito } from "../../store/slices/carritoSlice"
import {
  cargarDetalleProducto,
  seleccionarTalle,
  cambiarCantidad,
  incrementarCantidad,
  decrementarCantidad,
  mostrarConfirmacionCarrito,
  ocultarConfirmacionCarrito,
  limpiarDetalle,
  selectStockDisponible,
  selectEstadoStock,
  selectStockPorTalle,
} from "../../store/slices/detalleProductoSlice"
import "./DetalleProducto.css"

const DetalleProducto = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // SE AGREGA EL TOKEN ACA
  const { estaAutenticado, usuario, token } = useSelector((state) => state.auth)
  const { cargando: cargandoCarrito } = useSelector((state) => state.carrito)
  const {
    producto,
    talles,
    talleSeleccionado,
    cantidad,
    cargando,
    error,
    mostrarConfirmacion,
    productoAgregado,
  } = useSelector((state) => state.detalleProducto)

  const stockDisponible = useSelector(selectStockDisponible)
  const estadoStock = useSelector(selectEstadoStock)
  const stockPorTalle = useSelector(selectStockPorTalle)

  useEffect(() => {
    if (id) {
      dispatch(cargarDetalleProducto(id))
    }
    return () => {
      dispatch(limpiarDetalle())
    }
  }, [id, dispatch])

  useEffect(() => {
    if (mostrarConfirmacion) {
      const timer = setTimeout(() => {
        dispatch(ocultarConfirmacionCarrito())
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [mostrarConfirmacion, dispatch])

  const manejarSeleccionTalle = (numeroTalle) => {
    const tieneStock = stockPorTalle[numeroTalle] > 0
    if (tieneStock) {
      dispatch(seleccionarTalle(numeroTalle.toString()))
    }
  }

  const manejarCambioCantidad = (nuevaCantidad) => {
    dispatch(cambiarCantidad(nuevaCantidad))
  }

  const manejarIncrementarCantidad = () => {
    dispatch(incrementarCantidad())
  }

  const manejarDecrementarCantidad = () => {
    dispatch(decrementarCantidad())
  }

  const manejarAgregarCarrito = async () => {
    if (!estaAutenticado) {
      navigate("/iniciar-sesion")
      return
    }

    if (!talleSeleccionado) {
      alert("Por favor selecciona un talle")
      return
    }

    const stock = producto?.stockDisponible?.find((s) => s.numeroTalle === Number(talleSeleccionado))

    if (!stock) {
      alert("No se encontró el stock para ese talle")
      return
    }

    // TOKEN
    const resultado = await dispatch(
      agregarAlCarrito({
        usuarioId: usuario.id,
        stockId: stock.id,
        cantidad,
        token,
      }),
    )

    if (agregarAlCarrito.fulfilled.match(resultado)) {
      dispatch(
        mostrarConfirmacionCarrito({
          modelo: producto.modelo,
          talle: talleSeleccionado,
          cantidad,
        }),
      )
    } else {
      alert(resultado.payload || "Error al agregar al carrito")
    }
  }

  const manejarVerCarrito = () => {
    dispatch(ocultarConfirmacionCarrito())
    setTimeout(() => {
      navigate("/carrito")
    }, 100)
  }

  const manejarSeguirComprando = () => {
    dispatch(ocultarConfirmacionCarrito())
    setTimeout(() => {
      navigate("/productos")
    }, 100)
  }

  if (cargando) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    )
  }

  if (error || !producto) {
    return (
      <div className="container">
        <div className="error-container">
          <h2>Producto no encontrado</h2>
          <p>El producto que buscas no existe o ha sido eliminado.</p>
          <Link to="/productos" className="back-btn">
            Volver al catálogo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {mostrarConfirmacion && productoAgregado && (
        <div className="popup-carrito-confirmado">
          <h4>¡Producto añadido al carrito!</h4>
          <p>{productoAgregado.modelo}</p>
          <p>Talle: {productoAgregado.talle}</p>
          <p>Cantidad: {productoAgregado.cantidad}</p>
          <button onClick={manejarVerCarrito}>Ver Carrito</button>
          <button onClick={manejarSeguirComprando}>Seguir Comprando</button>
        </div>
      )}

      <div className="container product-detail-container">
        <div className="product-detail-card">
          <div className="product-detail-content">
            <div className="product-image-section">
              <img
                src={
                  producto.imagen ||
                  `/placeholder.svg?height=400&width=400&query=zapatilla+${producto.modelo || "/placeholder.svg"}`
                }
                alt={producto.modelo}
                className="product-main-image"
              />
            </div>

            <div className="product-info-section">
              <span className="product-brand-badge">{producto.marca}</span>

              <h1 className="product-title">{producto.modelo}</h1>

              <p className="product-description">
                {producto.descripcion || "Zapatilla de alta calidad con diseño moderno y cómodo para uso diario."}
              </p>

              <div className="product-price">${producto.precio?.toLocaleString()}</div>

              <div className="size-selection">
                <label className="size-label">Selecciona tu talle:</label>
                <div className="size-grid">
                  {talles.map((talle) => {
                    const tieneStock = stockPorTalle[talle.numero] > 0

                    return (
                      <button
                        key={talle.id}
                        className={`size-option ${
                          talleSeleccionado === talle.numero.toString() ? "selected" : ""
                        } ${!tieneStock ? "out-of-stock" : ""}`}
                        onClick={() => manejarSeleccionTalle(talle.numero)}
                        disabled={!tieneStock}
                      >
                        {talle.numero}
                      </button>
                    )
                  })}
                </div>

                {talleSeleccionado && <div className={`stock-info ${estadoStock.clase}`}>{estadoStock.texto}</div>}
              </div>

              {talleSeleccionado && stockDisponible > 0 && (
                <div className="quantity-selection">
                  <span className="quantity-label">Cantidad:</span>
                  <div className="quantity-controls">
                    <button className="quantity-btn" onClick={manejarDecrementarCantidad} disabled={cantidad <= 1}>
                      -
                    </button>
                    <input
                      type="number"
                      className="quantity-input"
                      value={cantidad}
                      onChange={(e) => manejarCambioCantidad(Number.parseInt(e.target.value) || 1)}
                      min="1"
                      max={stockDisponible}
                    />
                    <button
                      className="quantity-btn"
                      onClick={manejarIncrementarCantidad}
                      disabled={cantidad >= stockDisponible}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="action-buttons">
                <button
                  className="add-to-cart-btn"
                  onClick={manejarAgregarCarrito}
                  disabled={!talleSeleccionado || stockDisponible === 0 || cargandoCarrito}
                >
                  {cargandoCarrito ? "Agregando..." : "Agregar al Carrito"}
                </button>
              </div>

              <div className="product-features">
                <h3 className="features-title">Características</h3>
                <ul className="features-list">
                  <li>Material de alta calidad</li>
                  <li>Diseño ergonómico</li>
                  <li>Suela antideslizante</li>
                  <li>Transpirable</li>
                  <li>Garantía de 6 meses</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DetalleProducto
